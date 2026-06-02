import React, { useState } from "react";
import { Whiskey } from "../types";
import { GitCompare, ArrowRightLeft, Star, ExternalLink, RefreshCw, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface WhiskeyComparisonProps {
  whiskeys: Whiskey[];
}

export const WhiskeyComparison: React.FC<WhiskeyComparisonProps> = ({ whiskeys }) => {
  const [whiskeyAId, setWhiskeyAId] = useState<string>("");
  const [whiskeyBId, setWhiskeyBId] = useState<string>("");

  // Populate smart defaults (e.g. first two whiskeys if available)
  React.useEffect(() => {
    if (whiskeys.length >= 2) {
      if (!whiskeyAId || !whiskeys.some(w => w.id === whiskeyAId)) {
        setWhiskeyAId(whiskeys[0].id);
      }
      if (!whiskeyBId || !whiskeys.some(w => w.id === whiskeyBId)) {
        setWhiskeyBId(whiskeys[1].id);
      }
    }
  }, [whiskeys, whiskeyAId, whiskeyBId]);

  const whiskeyA = whiskeys.find((w) => w.id === whiskeyAId);
  const whiskeyB = whiskeys.find((w) => w.id === whiskeyBId);

  // Compare helper to calculate highlights
  const getBetterRating = () => {
    if (!whiskeyA || !whiskeyB) return null;
    if (whiskeyA.myRating > whiskeyB.myRating) return "A";
    if (whiskeyB.myRating > whiskeyA.myRating) return "B";
    return "equal";
  };

  const getCheaperPrice = () => {
    if (!whiskeyA || !whiskeyB) return null;
    if (whiskeyA.pricePaid < whiskeyB.pricePaid) return "A";
    if (whiskeyB.pricePaid < whiskeyA.pricePaid) return "B";
    return "equal";
  };

  const betterRating = getBetterRating();
  const cheaperPrice = getCheaperPrice();

  return (
    <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-5 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col h-auto group">
      <div className="pb-4 mb-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h4 className="font-sans font-medium text-white text-base flex items-center gap-1.5">
            <GitCompare className="w-4 h-4 text-amber-500 animate-pulse" />
            Порівняння віскі ("Head-to-Head")
          </h4>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Зіставте характеристики та вартість двох улюблених брендів
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (whiskeys.length >= 2) {
                const idxA = Math.floor(Math.random() * whiskeys.length);
                let idxB = Math.floor(Math.random() * whiskeys.length);
                while (idxB === idxA) {
                  idxB = Math.floor(Math.random() * whiskeys.length);
                }
                setWhiskeyAId(whiskeys[idxA].id);
                setWhiskeyBId(whiskeys[idxB].id);
              }
            }}
            className="text-[10px] bg-white/5 text-slate-300 hover:text-white border border-white/10 px-2.5 py-1.5 rounded-xl flex items-center gap-1 font-mono transition-all cursor-pointer hover:bg-white/10"
            title="Вибрати випадкову пару"
          >
            <RefreshCw className="w-3 h-3" />
            Випадкова пара
          </button>
        </div>
      </div>

      {whiskeys.length < 2 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-xs py-10 text-center">
          Потрібно принаймні 2 елементи у базі даних для порівняння. Будь ласка, зніміть деякі фільтри
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-center">
            {/* Dropdown A */}
            <div className="sm:col-span-5">
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Зразок А</label>
              <select
                value={whiskeyAId}
                onChange={(e) => setWhiskeyAId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-2xl px-3 py-2.5 focus:border-white/30 focus:outline-none transition-all cursor-pointer font-sans [&>option]:bg-slate-950 [&>option]:text-white"
              >
                {whiskeys.map((w) => (
                  <option key={`opt-a-${w.id}`} value={w.id}>
                    {w.title} ({w.flavour})
                  </option>
                ))}
              </select>
            </div>

            {/* Split Indicator */}
            <div className="sm:col-span-1 flex justify-center pt-4 sm:pt-0">
              <div className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 backdrop-blur-md">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Dropdown B */}
            <div className="sm:col-span-5">
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Зразок Б</label>
              <select
                value={whiskeyBId}
                onChange={(e) => setWhiskeyBId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-2xl px-3 py-2.5 focus:border-white/30 focus:outline-none transition-all cursor-pointer font-sans [&>option]:bg-slate-950 [&>option]:text-white"
              >
                {whiskeys.map((w) => (
                  <option key={`opt-b-${w.id}`} value={w.id}>
                    {w.title} ({w.flavour})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {whiskeyA && whiskeyB && (
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-4 space-y-4 shadow-xl backdrop-blur-md">
              
              {/* Cards layout */}
              <div className="grid grid-cols-2 gap-4">
                {/* Whiskey A Core Details */}
                <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5 relative">
                  {betterRating === "A" && (
                    <span className="absolute -top-2 -right-1 bg-amber-500 text-slate-950 text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded font-mono uppercase flex items-center gap-0.5 animate-float">
                      <Sparkles className="w-2 h-2" /> Лідер бал
                    </span>
                  )}
                  <h5 className="font-sans font-semibold text-xs text-white leading-tight mt-1 truncate">
                    {whiskeyA.title}
                  </h5>
                  <p className="text-[10px] font-mono text-amber-500 truncate">{whiskeyA.category}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{whiskeyA.region}, {whiskeyA.country}</p>
                </div>

                {/* Whiskey B Core Details */}
                <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5 relative">
                  {betterRating === "B" && (
                    <span className="absolute -top-2 -right-1 bg-amber-500 text-slate-950 text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded font-mono uppercase flex items-center gap-0.5 animate-float">
                      <Sparkles className="w-2 h-2" /> Лідер бал
                    </span>
                  )}
                  <h5 className="font-sans font-semibold text-xs text-white leading-tight mt-1 truncate">
                    {whiskeyB.title}
                  </h5>
                  <p className="text-[10px] font-mono text-amber-500 truncate">{whiskeyB.category}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{whiskeyB.region}, {whiskeyB.country}</p>
                </div>
              </div>

              {/* Dynamic Comparison Rows */}
              <div className="space-y-3 pt-2 text-xs border-t border-slate-900">
                {/* 1. Flavour Comparison */}
                <div className="flex justify-between items-center text-slate-400 py-1.5 border-b border-slate-900">
                  <span className="font-sans text-[11px] font-mono font-medium truncate max-w-[120px] text-slate-300">
                    {whiskeyA.flavour.toUpperCase()}
                  </span>
                  <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Смаковий профіль</span>
                  <span className="font-sans text-[11px] font-mono font-medium text-right truncate max-w-[120px] text-slate-300">
                    {whiskeyB.flavour.toUpperCase()}
                  </span>
                </div>

                {/* 2. My Rating Comparison */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className={`font-mono font-semibold flex items-center gap-1 ${betterRating === "A" ? "text-amber-400 font-bold" : "text-slate-300"}`}>
                      {whiskeyA.myRating} ★
                    </span>
                    <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Моя оцінка</span>
                    <span className={`font-mono font-semibold flex items-center gap-1 ${betterRating === "B" ? "text-amber-400 font-bold" : "text-slate-300"}`}>
                      {whiskeyB.myRating} ★
                    </span>
                  </div>
                  {/* Rating comparison sliders */}
                  <div className="flex justify-between items-center h-2 bg-slate-905 w-full rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-slate-800 flex justify-end"
                      style={{ width: "50%" }}
                    >
                      <div
                        className={`h-full rounded-l-full ${betterRating === "A" ? "bg-amber-500 shadow-sm shadow-amber-400/50" : "bg-slate-600"}`}
                        style={{ width: `${(whiskeyA.myRating / 5) * 100}%` }}
                      />
                    </div>
                    {/* divider */}
                    <div className="w-0.5 h-full bg-slate-950 z-10 absolute left-1/2 -ml-[1px]" />
                    <div
                      className="h-full bg-slate-800"
                      style={{ width: "50%" }}
                    >
                      <div
                        className={`h-full rounded-r-full ${betterRating === "B" ? "bg-amber-500 shadow-sm shadow-amber-400/50" : "bg-slate-600"}`}
                        style={{ width: `${(whiskeyB.myRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Average Rating Comparison */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="font-mono text-slate-300">{whiskeyA.avgRating} ★</span>
                    <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Середня Whizzky</span>
                    <span className="font-mono text-slate-300">{whiskeyB.avgRating} ★</span>
                  </div>
                  <div className="flex justify-between items-center h-2 bg-slate-905 w-full rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-slate-800 flex justify-end"
                      style={{ width: "50%" }}
                    >
                      <div
                        className="h-full rounded-l-full bg-emerald-500"
                        style={{ width: `${(whiskeyA.avgRating / 5) * 100}%` }}
                      />
                    </div>
                    <div className="w-0.5 h-full bg-slate-950 z-10 absolute left-1/2 -ml-[1px]" />
                    <div
                      className="h-full bg-slate-800"
                      style={{ width: "50%" }}
                    >
                      <div
                        className="h-full rounded-r-full bg-emerald-505 bg-emerald-500"
                        style={{ width: `${(whiskeyB.avgRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Price Paid Comparison */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className={`font-mono ${cheaperPrice === "A" ? "text-emerald-400 font-bold" : "text-slate-300"}`}>
                      {whiskeyA.pricePaid} ₴
                    </span>
                    <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Сплачена ціна</span>
                    <span className={`font-mono ${cheaperPrice === "B" ? "text-emerald-400 font-bold" : "text-slate-300"}`}>
                      {whiskeyB.pricePaid} ₴
                    </span>
                  </div>
                  {/* Comparative price indicators */}
                  <div className="flex justify-between items-center h-2 bg-slate-905 w-full rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-slate-800 flex justify-end"
                      style={{ width: "50%" }}
                    >
                      <div
                        className={`h-full rounded-l-full ${cheaperPrice === "A" ? "bg-emerald-500" : "bg-slate-600"}`}
                        style={{ width: `${Math.min((whiskeyA.pricePaid / 5000) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="w-0.5 h-full bg-slate-950 z-10 absolute left-1/2 -ml-[1px]" />
                    <div
                      className="h-full bg-slate-800"
                      style={{ width: "50%" }}
                    >
                      <div
                        className={`h-full rounded-r-full ${cheaperPrice === "B" ? "bg-emerald-500" : "bg-slate-600"}`}
                        style={{ width: `${Math.min((whiskeyB.pricePaid / 5000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Direct links for more information */}
                <div className="flex justify-between items-center pt-2 gap-4">
                  {whiskeyA.link ? (
                    <a
                      href={whiskeyA.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-1/2 text-[10px] text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1 font-mono transition-all truncate"
                    >
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                      Whizzky огляд (А)
                    </a>
                  ) : (
                    <span className="w-1/2 text-[10px] text-slate-600 font-mono text-center">—</span>
                  )}
                  {whiskeyB.link ? (
                    <a
                      href={whiskeyB.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-1/2 text-[10px] text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1 font-mono transition-all truncate"
                    >
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                      Whizzky огляд (Б)
                    </a>
                  ) : (
                    <span className="w-1/2 text-[10px] text-slate-600 font-mono text-center">—</span>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
