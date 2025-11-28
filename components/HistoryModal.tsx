import React from 'react';
import { HistoryItem, BMCData } from '../types';
import { X, Clock, RotateCcw, Trash2, FileText } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onRestore: (data: BMCData) => void;
  onDelete: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onRestore, 
  onDelete 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-600" />
              পূর্বের ইতিহাস (History)
            </h2>
            <p className="text-slate-500 text-sm mt-1">আপনার সংরক্ষিত এবং এনালাইসিস করা প্ল্যানগুলো</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors border border-slate-200 text-slate-500 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">কোন ইতিহাস পাওয়া যায়নি।</p>
              <p className="text-sm">নতুন এনালাইসিস করলে বা সেভ করলে এখানে দেখা যাবে।</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className="group bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1 bg-indigo-50 px-2 py-1 rounded-md w-fit">
                    <Clock size={12} />
                    {new Date(item.timestamp).toLocaleString('bn-BD')}
                  </div>
                  <h4 className="font-semibold text-slate-800 text-lg line-clamp-1 mb-1">
                    {item.preview || "নামবিহীন প্রজেক্ট"}
                  </h4>
                  <p className="text-slate-500 text-sm line-clamp-1">
                    Customer: {item.data.customerSegments || 'N/A'}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      onRestore(item.data);
                      onClose();
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors font-medium text-sm"
                  >
                    <RotateCcw size={16} />
                    লোড করুন
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl text-center text-xs text-slate-400">
          সর্বোচ্চ ২০টি সাম্প্রতিক ইতিহাস সংরক্ষিত থাকবে
        </div>
      </div>
    </div>
  );
};