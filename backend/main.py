from fastapi import FastAPI, File, UploadFile, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
from docx import Document
import tempfile
import os

# Firebase Admin + Firestore (uses Cloud Run service account automatically)
import firebase_admin
from firebase_admin import auth as fb_auth
from google.cloud import firestore

# Initialize Firebase Admin once
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.Client()

app = FastAPI()

# CORS: allow your Vercel app (update the domain)
ALLOWED_ORIGINS = [
    os.environ.get("FRONTEND_ORIGIN", "http://localhost:3000"),
    # e.g., "https://your-app.vercel.app"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

def verify_firebase_token(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    id_token = authorization.split(" ", 1)[1]
    try:
        decoded = fb_auth.verify_id_token(id_token)
        return decoded["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid ID token")

def parse_pdf(p: str) -> str:
    text = ""
    with pdfplumber.open(p) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def parse_docx(p: str) -> str:
    doc = Document(p)
    return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), authorization: str | None = Header(default=None)):
    uid = verify_firebase_token(authorization)

    # NOTE: Phase 1: no quota yet; that comes in Phase 2.

    # Save to temp, parse, return preview
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
        tmp.flush()
        if file.filename.lower().endswith(".pdf"):
            text = parse_pdf(tmp.name)
        elif file.filename.lower().endswith(".docx"):
            text = parse_docx(tmp.name)
        else:
            raise HTTPException(status_code=400, detail="Only PDF or DOCX supported")

    if not text.strip():
        raise HTTPException(status_code=400, detail="No extractable text found. We don't support scans yet.")

    # Return minimal preview (Phase 1)
    return {
        "user": uid,
        "filename": file.filename,
        "chars": len(text),
        "preview": text[:600]
    }
