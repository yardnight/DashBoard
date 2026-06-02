import React, { useState } from "react";
import { parseCSV, DEFAULT_WHISKEY_CSV } from "../data";
import { Whiskey } from "../types";
import { FileSpreadsheet, Upload, AlertCircle, CheckCircle2, RotateCcw, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CsvImporterProps {
  onImport: (newData: Whiskey[], rawCsv: string) => void;
  currentRawCsv: string;
}

export const CsvImporter: React.FC<CsvImporterProps> = ({ onImport, currentRawCsv }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [csvText, setCsvText] = useState(currentRawCsv);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleImportSubmit = () => {
    try {
      const parsed = parseCSV(csvText);
      if (parsed.length === 0) {
        setFeedback({
          type: "error",
          message: "Не вдалося розпізнати дані. Перевірте, чи є заголовки та підтримувану структуру.",
        });
        return;
      }
      onImport(parsed, csvText);
      setFeedback({
        type: "success",
        message: `Успішно імпортовано та візуалізовано ${parsed.length} записів!`,
      });
      // Auto close after 2.5 seconds
      setTimeout(() => {
        setIsOpen(false);
        setFeedback(null);
      }, 2500);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: `Помилка розбору CSV: ${err?.message || "невідома помилка"}`,
      });
    }
  };

  const handleReset = () => {
    const parsed = parseCSV(DEFAULT_WHISKEY_CSV);
    setCsvText(DEFAULT_WHISKEY_CSV);
    onImport(parsed, DEFAULT_WHISKEY_CSV);
    setFeedback({
      type: "success",
      message: "Відновлено початковий набір даних про віскі (33 найкращих сортів).",
    });
    setTimeout(() => {
      setFeedback(null);
    }, 3000);
  };

  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 shadow-xl backdrop-blur-xl overflow-hidden transition-all duration-250">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 border border-white/10 rounded-xl text-white">
            <FileSpreadsheet className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="font-sans font-medium text-white text-sm sm:text-base leading-tight">
              Ваші власні дані для аналізу (CSV Джерело)
            </h4>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Вставляйте власні CSV-таблиці та миттєво оновлюйте діаграми панелі
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto self-end sm:self-auto justify-end">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border font-sans tracking-tight transition-all duration-250 cursor-pointer ${
              isOpen
                ? "bg-white/15 border-white/20 text-white shadow-md"
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {isOpen ? "Згорнути налаштування" : "Імпортувати нові дані"}
          </button>
          
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-250 cursor-pointer"
            title="Скинути до стандартних віскі"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-4 pt-4 border-t border-white/10 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                  Редактор CSV Даних (Використовуйте розділювач крапка з комою ";" або кому ",")
                </label>
                <textarea
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full h-44 bg-white/5 border border-white/10 rounded-2xl p-3 text-slate-300 font-mono text-[11px] leading-relaxed focus:border-white/30 focus:outline-none transition-all scrollbar"
                  placeholder="Вставте рядки CSV сюди..."
                  spellCheck="false"
                />
              </div>

              <div className="md:col-span-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl flex flex-col justify-between text-xs leading-relaxed space-y-3 shadow-inner">
                <div className="space-y-2">
                  <h5 className="font-mono font-medium text-slate-300 uppercase tracking-wide text-[10px] flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                    Заголовки стовпців:
                  </h5>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Для повної інтеграції переконайтеся, що першим рядком є назви колонок. Обов'язково вкажіть:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[10px] font-mono text-slate-400 leading-tight">
                    <li><strong className="text-slate-300">Title</strong> – назва віскі</li>
                    <li><strong className="text-slate-300">Region</strong> – шотландський чи інший регіон</li>
                    <li><strong className="text-slate-300">Category</strong> – тип або сорт</li>
                    <li><strong className="text-slate-300">Flavour</strong> – смаковий профіль</li>
                    <li><strong className="text-slate-300">Price Paid</strong> – ціна купівлі (число)</li>
                    <li><strong className="text-slate-300">My Rates</strong> – власна оцінка (1-5)</li>
                    <li><strong className="text-slate-300">Avg.Rating</strong> – рейтинг від сервісу</li>
                    <li><strong className="text-slate-300">Country</strong> – країна походження</li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={handleImportSubmit}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20"
                  >
                    <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                    Завантажити в панель
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                    feedback.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-300"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span className="font-sans">{feedback.message}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
