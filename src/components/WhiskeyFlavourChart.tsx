import React, { useMemo } from "react";
import { Whiskey } from "../types";
import { Flame, Star, Trophy } from "lucide-react";
import { motion } from "motion/react";

interface WhiskeyFlavourChartProps {
  data: Whiskey[];
  selectedFlavour: string | null;
  onSelectFlavour: (flavour: string | null) => void;
}

export const WhiskeyFlavourChart: React.FC<WhiskeyFlavourChartProps> = ({
  data,
  selectedFlavour,
  onSelectFlavour,
}) => {
  const flavourData = useMemo(() => {
    if (data.length === 0) return [];

    const stats: { [key: string]: { count: number; ratingSum: number; maxRating: number } } = {};

    data.forEach((w) => {
      const fl = w.flavour.trim().toLowerCase();
      // capitalize
      const label = fl.charAt(0).toUpperCase() + fl.slice(1);
      
      if (!stats[label]) {
        stats[label] = { count: 0, ratingSum: 0, maxRating: 0 };
      }
      stats[label].count += 1;
      stats[label].ratingSum += w.myRating;
      if (w.myRating > stats[label].maxRating) {
        stats[label].maxRating = w.myRating;
      }
    });

    const maxCount = Math.max(...Object.values(stats).map((s) => s.count), 1);

    return Object.keys(stats).map((name) => {
      const info = stats[name];
      return {
        name,
        count: info.count,
        avgRating: Number((info.ratingSum / info.count).toFixed(2)),
        maxRating: info.maxRating,
        widthPercent: (info.count / maxCount) * 100,
      };
    }).sort((a, b) => b.count - a.count); // desc by count
  }, [data]);

  return (
    <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-5 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col h-auto group">
      <div className="pb-4 mb-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <h4 className="font-sans font-medium text-white text-base flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            Профілі смаків (Flavour map)
          </h4>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Кількість зразків за домінуючим смаком та їх якість
          </p>
        </div>
        {selectedFlavour && (
          <button
            onClick={() => onSelectFlavour(null)}
            className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded hover:bg-amber-500/20 transition-all font-mono"
          >
            Скинути Фільтр
          </button>
        )}
      </div>

      {flavourData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-xs py-10 text-center">
          Немає відповідних даних
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {flavourData.map((item, index) => {
            const isSelected = selectedFlavour?.toLowerCase() === item.name.toLowerCase();
            
            // Define colors for each flavour dynamically based on selection and type
            let activeColor = "from-amber-500 to-yellow-400";
            let hoverColor = "group-hover/bar:bg-amber-600/60";
            
            const lowerName = item.name.toLowerCase();
            if (lowerName.includes("smoke")) {
              activeColor = "from-slate-400 to-slate-500";
              hoverColor = "group-hover/bar:bg-slate-500/20";
            } else if (lowerName.includes("fruit")) {
              activeColor = "from-cyan-400 to-cyan-500";
              hoverColor = "group-hover/bar:bg-cyan-500/20";
            } else if (lowerName.includes("sweet") || lowerName.includes("flow")) {
              activeColor = "from-amber-400 to-yellow-400";
              hoverColor = "group-hover/bar:bg-amber-500/20";
            } else if (lowerName.includes("spice")) {
              activeColor = "from-red-500 to-red-600";
              hoverColor = "group-hover/bar:bg-red-500/20";
            }

            const barColorClass = isSelected 
              ? `bg-gradient-to-r ${activeColor}` 
              : `bg-white/10 ${hoverColor} transition-colors duration-300`;

            return (
              <div
                key={`flav-${index}`}
                onClick={() => onSelectFlavour(isSelected ? null : item.name)}
                className={`group/bar flex flex-col space-y-1.5 p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-white/10 border-white/25 shadow-xl backdrop-blur-md"
                    : "bg-white/[0.01] border-transparent hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-white font-medium flex items-center gap-1.5">
                    {item.name.toLowerCase().includes("smoke") && <Flame className="w-3.5 h-3.5 text-slate-400" />}
                    {item.name.toLowerCase() === "sweet" && <span className="text-amber-400 font-semibold">饴</span>}
                    {item.name.toLowerCase() === "fruit" && <span className="text-cyan-400 font-semibold">🍑</span>}
                    {item.name.toLowerCase() === "fruit dried" && <span className="text-cyan-400 font-semibold">🍇</span>}
                    {item.name.toLowerCase() === "sweet flowers" && <span className="text-amber-300 font-semibold">🌸</span>}
                    {item.name.toLowerCase().includes("spice") && <span className="text-red-500 font-semibold">🌶️</span>}
                    {item.name}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-300">
                      {item.count} пляшок
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {item.avgRating}
                    </span>
                  </span>
                </div>

                <div className="relative h-2 w-full bg-slate-950/80 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.widthPercent}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`h-full rounded-full ${barColorClass}`}
                  />
                </div>

                {/* Additional metadata on hover/active */}
                {(isSelected || isSelected === false) && (
                  <div className="flex items-center justify-between text-[9px] text-slate-500 uppercase font-mono pt-0.5 px-0.5">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-2.5 h-2.5 text-yellow-500" />
                      макс. бал: {item.maxRating} ★
                    </span>
                    <span>клікніть для фільтрування</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
