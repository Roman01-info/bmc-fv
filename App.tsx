import React, { useState, useEffect } from "react";
import { BMCData, AnalysisResult, AppState, HistoryItem } from "./types";
import { BMCInput } from "./components/BMCInput";
import { AnalysisReport } from "./components/AnalysisReport";
import { HistoryModal } from "./components/HistoryModal";
import { analyzeBMC } from "./services/geminiService";
import { LayoutGrid, Loader2, History, ArrowLeft } from "lucide-react";

const initialBMCData: BMCData = {
  keyPartners: "",
  keyActivities: "",
  keyResources: "",
  valuePropositions: "",
  customerRelationships: "",
  channels: "",
  customerSegments: "",
  costStructure: "",
  revenueStreams: "",
};

function App() {
  const [data, setData] = useState<BMCData>(initialBMCData);
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem("bmc_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (currentData: BMCData, manual: boolean = false) => {
    const hasData = Object.values(currentData).some((v) => v.trim().length > 0);
    if (!hasData) return;

    // Create a preview from available data
    const preview =
      currentData.valuePropositions ||
      currentData.keyActivities ||
      currentData.customerSegments ||
      "Untitled Plan";

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      preview: preview.slice(0, 60) + (preview.length > 60 ? "..." : ""),
      data: { ...currentData }, // Copy
    };

    const updated = [newItem, ...history].slice(0, 20); // Keep max 20
    setHistory(updated);
    localStorage.setItem("bmc_history", JSON.stringify(updated));

    if (manual) {
      // Could add a toast notification here
      // alert("Draft Saved!");
    }
  };

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem("bmc_history", JSON.stringify(updated));
  };

  const handleRestoreHistory = (oldData: BMCData) => {
    setData(oldData);
    setAppState(AppState.INPUT);
    // Optional: Reset analysis result if restoring
    setAnalysisResult(null);
  };

  const handleInputChange = (field: keyof BMCData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Auto save before analysis
    saveToHistory(data);

    setAppState(AppState.ANALYZING);
    setError(null);
    try {
      const result = await analyzeBMC(data);
      setAnalysisResult(result);
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setError(
        "দুঃখিত, এনালাইসিস করতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
      );
      setAppState(AppState.INPUT);
    }
  };

  const handleReset = () => {
    setAppState(AppState.INPUT);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onRestore={handleRestoreHistory}
        onDelete={deleteHistoryItem}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full max-w-screen-2xl mx-auto px-6 h-24 flex items-center justify-between">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => setAppState(AppState.INPUT)}
          >
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
              <LayoutGrid size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 hidden sm:block tracking-tight">
              BMC AI <span className="text-indigo-600">Analyst</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {appState === AppState.RESULT && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors mr-2"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">এডিট মোড</span>
              </button>
            )}

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl transition-all border border-slate-200 group"
            >
              <History className="w-5 h-5 group-hover:rotate-[-20deg] transition-transform" />
              <span className="font-bold">ইতিহাস ({history.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {error && (
          <div className="max-w-4xl mx-auto mt-6 p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-lg animate-fade-in">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {appState === AppState.INPUT && (
          <BMCInput
            data={data}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onSaveDraft={() => saveToHistory(data, true)}
          />
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh] animate-fade-in">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-25"></div>
              <div className="relative bg-white p-8 rounded-full shadow-2xl border border-indigo-100">
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              আপনার পরিকল্পনা এনালাইসিস করা হচ্ছে...
            </h2>
            <p className="text-slate-500 max-w-xl text-xl leading-relaxed">
              AI আপনার বিজনেস মডেলের প্রতিটি দিক যাচাই করছে। শক্তিশালী এবং
              দুর্বল দিকগুলো খুঁজে বের করা হচ্ছে। কিছুক্ষণ অপেক্ষা করুন।
            </p>
          </div>
        )}

        {appState === AppState.RESULT && analysisResult && (
          <AnalysisReport result={analysisResult} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 text-center text-slate-400 text-lg">
        <p>
          © {new Date().getFullYear()} BMC AI Analyst. Powered by Gemini API.
        </p>
      </footer>
    </div>
  );
}

export default App;
