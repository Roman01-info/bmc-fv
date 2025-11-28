import React, { useRef, useState } from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { CheckCircle, AlertTriangle, Lightbulb, Target, ArrowLeft, FileText, Printer, Download, Share2 } from 'lucide-react';

interface AnalysisReportProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ result, onReset }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const scoreData = [
    { name: 'Score', value: result.overallScore },
    { name: 'Remaining', value: 100 - result.overallScore },
  ];
  
  const COLORS = ['#4f46e5', '#e2e8f0'];

  const radarData = result.segmentAnalysis.map(item => ({
    subject: item.segment,
    A: item.score,
    fullMark: 10,
  }));

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!reportRef.current) return;
    setIsDownloading(true);

    const element = reportRef.current;
    
    // @ts-ignore - html2pdf is loaded from CDN
    if (typeof window.html2pdf === 'undefined') {
      alert("PDF library not loaded yet. Please try printing instead.");
      setIsDownloading(false);
      return;
    }

    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     'BMC_Analysis_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    window.html2pdf().set(opt).from(element).save().then(() => {
      setIsDownloading(false);
    });
  };

  const downloadWord = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>BMC Analysis Report</title>
        <style>
          body { font-family: 'Hind Siliguri', sans-serif; font-size: 14pt; }
          h1 { color: #4f46e5; font-size: 24pt; margin-bottom: 20px; }
          h2 { color: #333; font-size: 18pt; margin-top: 30px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
          p { margin-bottom: 15px; line-height: 1.6; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8fafc; color: #333; }
          .score { font-size: 28pt; font-weight: bold; color: #4f46e5; }
        </style>
      </head>
      <body>
        <h1>বিজনেজ মডেল ক্যানভাস (BMC) রিপোর্ট</h1>
        
        <div>
          <h2>ওভারভিউ (Overview)</h2>
          <p><strong>স্কোর:</strong> <span class="score">${result.overallScore}/100</span></p>
          <p>${result.executiveSummary}</p>
        </div>

        <div>
          <h2>প্যারামিটার বিশ্লেষণ (Segment Analysis)</h2>
          <table>
            <thead>
              <tr>
                <th>সেগমেন্ট (Segment)</th>
                <th>ফিডব্যাক (Feedback)</th>
                <th>স্কোর (Score)</th>
              </tr>
            </thead>
            <tbody>
              ${result.segmentAnalysis.map(item => `
                <tr>
                  <td>${item.segment}</td>
                  <td>${item.feedback}</td>
                  <td>${item.score}/10</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div>
          <h2>SWOT অ্যানালাইসিস</h2>
          
          <h3>শক্তিমত্তা (Strengths)</h3>
          <ul>${result.swot.strengths.map(s => `<li>${s}</li>`).join('')}</ul>

          <h3>দুর্বলতা (Weaknesses)</h3>
          <ul>${result.swot.weaknesses.map(s => `<li>${s}</li>`).join('')}</ul>

          <h3>সুযোগ (Opportunities)</h3>
          <ul>${result.swot.opportunities.map(s => `<li>${s}</li>`).join('')}</ul>

          <h3>ঝুঁকি (Threats)</h3>
          <ul>${result.swot.threats.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>

        <div>
          <h2>পরামর্শ (Suggestions)</h2>
          <ul>
            ${result.suggestions.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'BMC_Report.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-[95%] mx-auto p-4 sm:p-8 space-y-10 animate-fade-in pb-24">
      
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 no-print bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
           <h2 className="text-3xl font-bold text-slate-800">রিপোর্ট ড্যাশবোর্ড</h2>
           <p className="text-slate-500">আপনার ব্যবসার বিস্তারিত বিশ্লেষণ</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={downloadWord}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 font-medium transition-colors border border-blue-200"
          >
            <FileText className="w-5 h-5" />
            Word ফাইল
          </button>
          
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 font-medium transition-colors border border-red-200"
          >
            {isDownloading ? (
              <span className="w-5 h-5 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Download className="w-5 h-5" />
            )}
            PDF ডাউনলোড
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-medium transition-colors border border-slate-200"
          >
            <Printer className="w-5 h-5" />
            প্রিন্ট
          </button>
        </div>
      </div>

      {/* Report Content Container - ID used for PDF Generation */}
      <div id="report-content" ref={reportRef} className="space-y-8 bg-white/50 p-2 md:p-4 rounded-3xl">
        
        {/* Header & Score */}
        <div className="flex flex-col xl:flex-row gap-8 items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-64 h-64 relative flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  innerRadius={90}
                  outerRadius={120}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-slate-800 tracking-tighter">{result.overallScore}</span>
              <span className="text-sm text-slate-400 uppercase font-bold tracking-widest mt-2">Score</span>
            </div>
          </div>
          
          <div className="flex-1 text-center xl:text-left">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">এক্সিকিউটিভ সামারি</h2>
            <p className="text-slate-600 text-xl leading-relaxed">{result.executiveSummary}</p>
          </div>
        </div>

        {/* Segment Radar Chart & Details */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 break-inside-avoid">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Target className="w-7 h-7 text-indigo-500" />
              প্যারামিটার বিশ্লেষণ
            </h3>
            <div className="h-[400px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 14, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="#4f46e5"
                    fillOpacity={0.2}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
             <h3 className="text-2xl font-bold text-slate-800 mb-6">বিস্তারিত মূল্যায়ন</h3>
             <div className="space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
               {result.segmentAnalysis.map((seg, idx) => (
                 <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 break-inside-avoid">
                   <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-lg text-slate-700">{seg.segment}</span>
                     <span className={`text-sm font-bold px-3 py-1 rounded-full ${seg.score >= 7 ? 'bg-green-100 text-green-700' : seg.score >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                       {seg.score}/10
                     </span>
                   </div>
                   <p className="text-base text-slate-600 leading-relaxed">{seg.feedback}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* SWOT Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
          <SwotCard title="শক্তিমত্তা (Strengths)" items={result.swot.strengths} type="strength" />
          <SwotCard title="দুর্বলতা (Weaknesses)" items={result.swot.weaknesses} type="weakness" />
          <SwotCard title="সুযোগ (Opportunities)" items={result.swot.opportunities} type="opportunity" />
          <SwotCard title="ঝুঁকি (Threats)" items={result.swot.threats} type="threat" />
        </div>

        {/* Actionable Suggestions */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 break-inside-avoid">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-yellow-300" />
            উন্নতির জন্য পরামর্শ (Suggestions)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className="flex gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10">
                <span className="font-bold text-2xl text-indigo-300 opacity-50">#{index + 1}</span>
                <p className="text-lg text-indigo-50 leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center pt-8 pb-4 text-slate-400 text-sm no-print">
          Generated by BMC AI Analyst
        </div>
      </div>

       <div className="flex justify-center pt-4 no-print">
        <button
          onClick={onReset}
          className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-300 rounded-full text-slate-700 font-bold hover:bg-slate-50 hover:shadow-lg transition-all text-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          নতুন পরিকল্পনা শুরু করুন
        </button>
      </div>
    </div>
  );
};

const SwotCard: React.FC<{ title: string; items: string[]; type: 'strength' | 'weakness' | 'opportunity' | 'threat' }> = ({ title, items, type }) => {
  const styles = {
    strength: { border: 'border-l-8 border-green-500', icon: <CheckCircle className="w-6 h-6 text-green-600" />, bg: 'bg-green-50/50' },
    weakness: { border: 'border-l-8 border-orange-500', icon: <AlertTriangle className="w-6 h-6 text-orange-600" />, bg: 'bg-orange-50/50' },
    opportunity: { border: 'border-l-8 border-blue-500', icon: <Lightbulb className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50/50' },
    threat: { border: 'border-l-8 border-red-500', icon: <AlertTriangle className="w-6 h-6 text-red-600" />, bg: 'bg-red-50/50' },
  };
  
  const style = styles[type];

  return (
    <div className={`bg-white p-8 rounded-3xl shadow-sm border border-slate-100 ${style.border} break-inside-avoid flex flex-col`}>
      <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        {style.icon}
        {title}
      </h4>
      <ul className="space-y-4 flex-1">
        {items.map((item, i) => (
          <li key={i} className="text-lg text-slate-700 flex gap-3 items-start leading-relaxed">
            <span className="mt-2.5 w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};