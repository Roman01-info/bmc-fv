import React, { useRef, useEffect } from "react";
import { BMCData, BMC_LABELS } from "../types";
import {
  Handshake,
  Activity,
  Box,
  Gift,
  Heart,
  Truck,
  Users,
  CreditCard,
  DollarSign,
  Save,
  X,
} from "lucide-react";

interface BMCInputProps {
  data: BMCData;
  onChange: (field: keyof BMCData, value: string) => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Handshake: <Handshake className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  Box: <Box className="w-6 h-6" />,
  Gift: <Gift className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Truck: <Truck className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  CreditCard: <CreditCard className="w-6 h-6" />,
  DollarSign: <DollarSign className="w-6 h-6" />,
};

export const BMCInput: React.FC<BMCInputProps> = ({
  data,
  onChange,
  onSubmit,
  onSaveDraft,
}) => {
  // Check if at least some fields are filled
  const isFormValid = Object.values(data).some(
    (val) => (val as string).trim().length > 0
  );

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8 pb-32">
      <div className="text-center mb-12 mt-4">
        <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 tracking-tight">
          বিজনেস মডেল ক্যানভাস
        </h2>
        <p className="text-2xl text-slate-600 max-w-4xl mx-auto font-light">
          নিচের বক্সগুলোতে আপনার ব্যবসার পরিকল্পনার বিস্তারিত লিখুন। যতটা সম্ভব
          পরিষ্কার এবং বিস্তারিত তথ্য দিন যাতে এনালাইসিস সঠিক হয়।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 xl:gap-8 auto-rows-fr">
        {/* Row 1 Top */}
        <div className="md:col-span-1 lg:row-span-2 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-xl hover:border-indigo-200 group">
          <InputCard field="keyPartners" data={data} onChange={onChange} />
        </div>
        <div className="md:col-span-1 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-xl hover:border-indigo-200 group">
          <InputCard field="keyActivities" data={data} onChange={onChange} />
        </div>
        <div className="md:col-span-1 lg:row-span-2 flex flex-col bg-white rounded-3xl shadow-md border-2 border-indigo-100 p-6 transition-all hover:shadow-xl hover:border-indigo-300 bg-indigo-50/30 group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
          <InputCard
            field="valuePropositions"
            data={data}
            onChange={onChange}
            highlight
          />
        </div>
        <div className="md:col-span-1 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-xl hover:border-indigo-200 group">
          <InputCard
            field="customerRelationships"
            data={data}
            onChange={onChange}
          />
        </div>
        <div className="md:col-span-1 lg:row-span-2 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-xl hover:border-indigo-200 group">
          <InputCard field="customerSegments" data={data} onChange={onChange} />
        </div>

        {/* Row 1 Bottom */}
        <div className="md:col-span-1 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-xl hover:border-indigo-200 md:col-start-2 group">
          <InputCard field="keyResources" data={data} onChange={onChange} />
        </div>
        <div className="md:col-span-1 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-xl hover:border-indigo-200 md:col-start-4 group">
          <InputCard field="channels" data={data} onChange={onChange} />
        </div>

        {/* Row 2 Bottom */}
        <div className="md:col-span-1 lg:col-span-2.5 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-xl hover:border-indigo-200 lg:col-span-2 group">
          <InputCard field="costStructure" data={data} onChange={onChange} />
        </div>
        <div className="md:col-span-1 lg:col-span-2.5 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-xl hover:border-indigo-200 lg:col-start-3 lg:col-span-3 group">
          <InputCard field="revenueStreams" data={data} onChange={onChange} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 p-6 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onSaveDraft}
            disabled={!isFormValid}
            className={`px-8 py-3.5 rounded-full font-bold text-lg shadow-lg border transition-all duration-300 flex items-center gap-2
              ${
                isFormValid
                  ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-indigo-600"
                  : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
              }`}
          >
            <Save className="w-5 h-5" />
            ড্রাফট সংরক্ষণ
          </button>

          <button
            onClick={onSubmit}
            disabled={!isFormValid}
            className={`px-10 py-3.5 rounded-full font-bold text-xl shadow-xl transform transition-all duration-300 flex items-center gap-2
              ${
                isFormValid
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white hover:scale-105 hover:shadow-indigo-500/40 ring-4 ring-indigo-100"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
          >
            {isFormValid ? (
              <>
                <SparklesIcon />
                এনালাইসিস করুন (Analyze)
              </>
            ) : (
              "দয়া করে তথ্য পূরণ করুন"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L14.39 9.39L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.39L12 2Z"
      fill="currentColor"
    />
  </svg>
);

const InputCard: React.FC<{
  field: keyof BMCData;
  data: BMCData;
  onChange: (field: keyof BMCData, value: string) => void;
  highlight?: boolean;
}> = ({ field, data, onChange, highlight }) => {
  const meta = BMC_LABELS[field];
  const value = data[field] || "";
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset to calculate scrollHeight correctly
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(scrollHeight, 180)}px`; // Ensure min-height matches CSS
    }
  }, [value]);

  const handleClear = () => {
    onChange(field, "");
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-5">
        <div
          className={`p-4 rounded-2xl transition-colors duration-300 ${
            highlight
              ? "bg-indigo-100 text-indigo-700"
              : "bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600"
          }`}
        >
          {iconMap[meta.icon]}
        </div>
        <h3
          className={`font-bold text-2xl leading-tight ${
            highlight ? "text-indigo-900" : "text-slate-800"
          }`}
        >
          {meta.label}
        </h3>
      </div>
      <p className="text-base text-slate-500 mb-4 font-medium">
        {meta.description}
      </p>

      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          className={`w-full p-5 pr-12 pb-8 rounded-2xl border bg-slate-50 focus:bg-white transition-all resize-none text-lg leading-relaxed min-h-[180px] overflow-hidden block
            ${
              highlight
                ? "border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 shadow-sm"
                : "border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-slate-100 hover:border-indigo-200"
            }`}
          placeholder="লিখুন..."
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
        />

        {/* Clear Button */}
        <div
          className={`absolute top-2 right-2 transition-opacity duration-200 ${
            value ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={handleClear}
            className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="মুছে ফেলুন"
            aria-label="Clear input"
          >
            <X size={20} />
          </button>
        </div>

        {/* Character Count */}
        <div className="absolute bottom-3 right-4 text-xs font-bold text-slate-400 pointer-events-none select-none bg-white/60 backdrop-blur-[2px] px-2 py-0.5 rounded-md">
          {value.length} chars
        </div>
      </div>
    </div>
  );
};
