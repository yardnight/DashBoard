import React, { useState, useMemo } from "react";
import { Whiskey } from "../types";
import { Percent, Award, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

interface WhiskeyCategoryChartProps {
  data: Whiskey[];
  onSelectCategory?: (category: string | null) => void;
  selectedCategory: string | null;
}

export const WhiskeyCategoryChart: React.FC<WhiskeyCategoryChartProps> = ({
  data,
  onSelectCategory,
  selectedCategory,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const categoryData = useMemo(() => {
    if (data.length === 0) return [];
    
    const groups: { [key: string]: { count: number; totalRating: number; totalPrice: number } } = {};
    
    data.forEach((w) => {
      const cat = w.category.trim();
      if (!groups[cat]) {
        groups[cat] = { count: 0, totalRating: 0, totalPrice: 0 };
      }
      groups[cat].count += 1;
      groups[cat].totalRating += w.myRating;
      groups[cat].totalPrice += w.pricePaid;
    });

    const list = Object.keys(groups).map((name) => ({
      name,
      count: groups[name].count,
      avgRating: Number((groups[name].totalRating / groups[name].count).toFixed(2)),
      avgPrice: Math.round(groups[name].totalPrice / groups[name].count),
      percentage: Number(((groups[name].count / data.length) * 100).toFixed(1)),
    }));

    // Sort descending by count
    return list.sort((a, b) => b.count - a.count);
  }, [data]);

  // Color palette for segments
  const colors = [
    { fill: "#f59e0b", border: "#b45309", glow: "rgba(245, 158, 11, 0.4)" }, // Amber
    { fill: "#10b981", border: "#047857", glow: "rgba(16, 185, 129, 0.4)" }, // Emerald
    { fill: "#3b82f6", border: "#1d4ed8", glow: "rgba(59, 130, 246, 0.4)" }, // Blue
    { fill: "#ec4899", border: "#be185d", glow: "rgba(236, 72, 153, 0.4)" }, // Pink
    { fill: "#f97316", border: "#c2410c", glow: "rgba(249, 115, 22, 0.4)" }, // Orange
    { fill: "#8b5cf6", border: "#6d28d9", glow: "rgba(139, 92, 246, 0.4)" }, // Violet
    { fill: "#06b6d4", border: "#0e7490", glow: "rgba(6, 182, 212, 0.4)" }, // Cyan
    { fill: "#e11d48", border: "#9f1239", glow: "rgba(225, 29, 72, 0.4)" }, // Rose
  ];

  // Calculate coordinates for SVG donut slices
  const donutElements = useMemo(() => {
    let accumulatedAngle = 0;
    const radius = 80;
    const innerRadius = 55;
    const cx = 110;
    const cy = 110;

    return categoryData.map((item, index) => {
      const percentage = item.percentage;
      const angleInDegrees = (percentage / 100) * 360;

      // Start position
      const startAngleRad = (accumulatedAngle * Math.PI) / 180;
      const startOuterX = cx + radius * Math.cos(startAngleRad);
      const startOuterY = cy + radius * Math.sin(startAngleRad);
      const startInnerX = cx + innerRadius * Math.cos(startAngleRad);
      const startInnerY = cy + innerRadius * Math.sin(startAngleRad);

      // End position
      accumulatedAngle += angleInDegrees;
      const endAngleRad = (accumulatedAngle * Math.PI) / 180;
      const endOuterX = cx + radius * Math.cos(endAngleRad);
      const endOuterY = cy + radius * Math.sin(endAngleRad);
      const endInnerX = cx + innerRadius * Math.cos(endAngleRad);
      const endInnerY = cy + innerRadius * Math.sin(endAngleRad);

      // Large arc flag
      const largeArcFlag = angleInDegrees > 180 ? 1 : 0;

      // Create SVG path string
      const pathData = `
        M ${startOuterX} ${startOuterY}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endOuterX} ${endOuterY}
        L ${endInnerX} ${endInnerY}
        A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInnerX} ${startInnerY}
        Z
      `.trim();

      const colorData = colors[index % colors.length];

      return {
        ...item,
        pathData,
        color: colorData,
        index,
      };
    });
  }, [categoryData]);

  const activeSegmentIdx = hoveredIndex !== null ? hoveredIndex : 0;
  const activeSegment = categoryData[activeSegmentIdx];
  const activeColor = donutElements[activeSegmentIdx]?.color;

  return (
    <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-5 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col h-auto group">
      <div className="pb-4 mb-2 border-b border-white/10">
        <h4 className="font-sans font-medium text-white text-base flex items-center gap-1.5">
          <Percent className="w-4 h-4 text-emerald-400" />
          Співвідношення категорій віскі
        </h4>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Частка сингл-малтів, бурбонів, айріш тощо
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-xs py-10 text-center">
          Немає відповідних даних
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Donut graphic */}
          <div className="md:col-span-6 relative flex justify-center py-4">
            <svg viewBox="0 0 220 220" className="w-[180px] h-[180px] overflow-visible">
              {donutElements.map((seg) => {
                const isSelected = selectedCategory === seg.name;
                const isHovered = hoveredIndex === seg.index;
                const filterId = `glow-${seg.index}`;

                return (
                  <g key={`seg-${seg.index}`} className="focus:outline-none">
                    <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    
                    <path
                      d={seg.pathData}
                      fill={seg.color.fill}
                      stroke="#0f172a"
                      strokeWidth={isSelected ? 1.5 : 1}
                      className="cursor-pointer transition-all duration-300 origin-center"
                      style={{
                        transform: isHovered || isSelected ? "scale(1.05)" : "scale(1)",
                        transformOrigin: "110px 110px",
                        filter: isHovered || isSelected ? `url(#${filterId})` : "none",
                        opacity: hoveredIndex !== null && !isHovered ? 0.75 : 1,
                      }}
                      onMouseEnter={() => setHoveredIndex(seg.index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => {
                        if (onSelectCategory) {
                          onSelectCategory(isSelected ? null : seg.name);
                        }
                      }}
                    />
                  </g>
                );
              })}

              {/* Total indicator in the center */}
              <circle cx="110" cy="110" r="50" fill="#020617" className="opacity-90 shadow-inner" />
              <text x="110" y="105" textAnchor="middle" className="fill-slate-400 font-mono text-[9px] uppercase tracking-wider">
                Всього видів
              </text>
              <text x="110" y="125" textAnchor="middle" className="fill-white font-sans text-xl font-bold">
                {categoryData.length}
              </text>
            </svg>
          </div>

          {/* Quick specs about hovered segment */}
          <div className="md:col-span-6 space-y-3 p-4 bg-white/5 border border-white/10 rounded-2xl relative self-center shadow-lg backdrop-blur-lg">
            {activeSegment ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: activeColor?.fill }}
                  />
                  <h5 className="font-sans font-medium text-white text-sm truncate leading-none">
                    {activeSegment.name}
                  </h5>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase flex items-center gap-0.5">
                      Кількість
                    </span>
                    <span className="text-sm font-semibold text-white font-mono flex items-baseline gap-1">
                      {activeSegment.count}
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({activeSegment.percentage}%)
                      </span>
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Мій рейтинг (сер)</span>
                    <span className="text-sm font-semibold text-amber-500 font-mono flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {activeSegment.avgRating} ★
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/40">
                  <span className="text-[9px] font-mono text-slate-500 uppercase flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3 text-slate-400" />
                    Середня ціна:
                  </span>
                  <span className="text-xs font-semibold text-slate-300 font-mono mt-0.5 block">
                    {activeSegment.avgPrice} ₴
                  </span>
                </div>
              </>
            ) : (
              <div className="text-slate-500 font-mono text-xs text-center py-5">
                Наведіть на діаграму, щоб отримати статистику
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid listing */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
        {donutElements.map((seg) => {
          const isSelected = selectedCategory === seg.name;
          return (
            <button
              key={`legend-${seg.index}`}
              onClick={() => {
                if (onSelectCategory) {
                  onSelectCategory(isSelected ? null : seg.name);
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-mono border tracking-tight transition-all duration-250 cursor-pointer ${
                isSelected
                  ? "bg-white/15 text-white border-white/20 shadow-sm"
                  : "bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: seg.color.fill }}
              />
              <span className="truncate max-w-[80px]">{seg.name}</span>
              <span className="text-slate-500">[{seg.count}]</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
