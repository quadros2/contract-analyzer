import AuthButtons from "./components/AuthButtons";
import Uploader from "./components/Uploader";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Contract Analyzer (MVP)</h1>
      <AuthButtons />
      <div>
        <h2 className="font-medium mb-2">Upload a PDF/DOCX</h2>
        <Uploader />
      </div>
    </main>
  );
}
