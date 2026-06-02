import React, { useState, useMemo, useRef, useEffect } from "react";
import { Whiskey } from "../types";
import { DollarSign, Star, Info, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WhiskeyScatterPlotProps {
  data: Whiskey[];
  onSelectWhiskey?: (whiskey: Whiskey) => void;
}

export const WhiskeyScatterPlot: React.FC<WhiskeyScatterPlotProps> = ({
  data,
  onSelectWhiskey,
}) => {
  const [xAxisType, setXAxisType] = useState<"myRating" | "avgRating">("myRating");
  const [hoveredNode, setHoveredNode] = useState<Whiskey | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Layout parameters
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const width = 600;
  const height = 350;

  // Filter out data points with missing pricing or ratings
  const plotData = useMemo(() => {
    return data.filter((w) => w.pricePaid > 0 && (xAxisType === "myRating" ? w.myRating > 0 : w.avgRating > 0));
  }, [data, xAxisType]);

  // Determine limits for scaling
  const limits = useMemo(() => {
    if (plotData.length === 0) return { minX: 1, maxX: 5, minY: 0, maxY: 5000 };
    const prices = plotData.map((d) => d.pricePaid);
    const maxPrice = Math.max(...prices, 4000);
    const minPrice = 0; // standard base

    // Ratings are strictly bounded internally between 1 and 5
    return {
      minX: 1,
      maxX: 5,
      minY: minPrice,
      maxY: Math.ceil(maxPrice / 500) * 500, // round to next 500
    };
  }, [plotData]);

  // Convert real values to SVG coordinates
  const getCoords = (xValue: number, yValue: number) => {
    const xRange = limits.maxX - limits.minX;
    const yRange = limits.maxY - limits.minY;

    // Map X to padding.left -> width - padding.right
    const xCoord = padding.left + ((xValue - limits.minX) / xRange) * (width - padding.left - padding.right);
    // Map Y to height - padding.bottom -> padding.top (inverted SVG Y-axis)
    const yCoord = height - padding.bottom - ((yValue - limits.minY) / yRange) * (height - padding.top - padding.bottom);

    return { x: xCoord, y: yCoord };
  };

  // Generate gridlines & axes tick points
  const yTicks = useMemo(() => {
    const ticksCount = 5;
    const array = [];
    const step = (limits.maxY - limits.minY) / ticksCount;
    for (let i = 0; i <= ticksCount; i++) {
      array.push(Math.round(limits.minY + i * step));
    }
    return array;
  }, [limits]);

  const xTicks = [1, 2, 3, 4, 5];

  // Quad boundary definitions: Average rating middle ~3.5. Average price middle around 2000.
  const middleX = 3.5;
  const middleY = 2000;
  
  const midCoords = getCoords(middleX, middleY);

  const handleNodeLeave = () => {
    setHoveredNode(null);
  };

  const handleNodeHover = (e: React.MouseEvent, item: Whiskey) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 10,
    });
    setHoveredNode(item);
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-3xl bg-white/[0.04] border border-white/10 p-5 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col h-auto group"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-2 border-b border-white/10 gap-2">
        <div>
          <h4 className="font-sans font-medium text-white text-base flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-amber-500" />
            Кореляція: Ціна vs Оцінка
          </h4>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Аналіз вартості (₴) відносно смакових вражень
          </p>
        </div>
        
        {/* Toggle switches info */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setXAxisType("myRating")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium tracking-tight transition-all duration-250 cursor-pointer ${
              xAxisType === "myRating"
                ? "bg-white/10 text-white border border-white/10 shadow-md backdrop-blur-sm"
                : "text-slate-400 hover:text-white border border-transparent"
            }`}
          >
            Моя оцінка
          </button>
          <button
            onClick={() => setXAxisType("avgRating")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium tracking-tight transition-all duration-250 cursor-pointer ${
              xAxisType === "avgRating"
                ? "bg-white/10 text-white border border-white/10 shadow-md backdrop-blur-sm"
                : "text-slate-400 hover:text-white border border-transparent"
            }`}
          >
            Середня Whizzky
          </button>
        </div>
      </div>

      <div className="relative flex-1 min-h-[250px] w-full mt-2">
        {plotData.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-sm font-mono p-4 text-center">
            <HelpCircle className="w-8 h-8 mb-2 text-slate-600 animate-pulse" />
            Немає даних у заданому ціновому або оціночному діапазоні для побудови графіка
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto text-slate-600 select-none overflow-visible"
          >
            {/* Background quadrant highlights */}
            {/* Top Left: Expensive, Low rating */}
            <rect
              x={padding.left}
              y={padding.top}
              width={midCoords.x - padding.left}
              height={midCoords.y - padding.top}
              fill="rgba(239, 68, 68, 0.01)" // very subtle red
            />
            {/* Top Right: Expensive, High rating */}
            <rect
              x={midCoords.x}
              y={padding.top}
              width={width - padding.right - midCoords.x}
              height={midCoords.y - padding.top}
              fill="rgba(59, 130, 246, 0.01)" // very subtle blue (Premium zone)
            />
            {/* Bottom Right: Smart Choice (Low price, high rating) */}
            <rect
              x={midCoords.x}
              y={midCoords.y}
              width={width - padding.right - midCoords.x}
              height={height - padding.bottom - midCoords.y}
              fill="rgba(16, 185, 129, 0.02)" // emerald (Good Deal)
            />
            {/* Quadrant labels / annotations */}
            <text
              x={width - padding.right - 10}
              y={height - padding.bottom - 10}
              className="font-sans font-medium text-[9px] fill-emerald-500 opacity-60 text-right"
              textAnchor="end"
            >
              СМАРТ ПОКУПКА (ДОСТУПНО + ЯКІСНО)
            </text>
            <text
              x={width - padding.right - 10}
              y={padding.top + 15}
              className="font-sans font-semibold text-[9px] fill-amber-500 opacity-60 text-right"
              textAnchor="end"
            >
              ЛЮКС / ПРЕМІУМ ЗОНА
            </text>

            {/* Grid Lines Y-axis */}
            {yTicks.map((tick, index) => {
              const coords = getCoords(limits.minX, tick);
              return (
                <g key={`y-grid-${index}`} className="opacity-20">
                  <line
                    x1={padding.left}
                    y1={coords.y}
                    x2={width - padding.right}
                    y2={coords.y}
                    stroke="#475569"
                    strokeWidth={1}
                    strokeDasharray="3,3"
                  />
                  <text
                    x={padding.left - 10}
                    y={coords.y + 3}
                    className="font-mono text-[9px] fill-slate-400 text-right"
                    textAnchor="end"
                  >
                    {tick} ₴
                  </text>
                </g>
              );
            })}

            {/* Grid Lines X-axis */}
            {xTicks.map((tick, index) => {
              const coords = getCoords(tick, limits.minY);
              return (
                <g key={`x-grid-${index}`} className="opacity-20">
                  <line
                    x1={coords.x}
                    y1={padding.top}
                    x2={coords.x}
                    y2={height - padding.bottom}
                    stroke="#475569"
                    strokeWidth={1}
                    strokeDasharray="3,3"
                  />
                  <text
                    x={coords.x}
                    y={height - padding.bottom + 16}
                    className="font-mono text-[10px] fill-slate-400"
                    textAnchor="middle"
                  >
                    {tick} ★
                  </text>
                </g>
              );
            })}

            {/* Average Axes Lines (Crosshairs) */}
            <line
              x1={midCoords.x}
              y1={padding.top}
              x2={midCoords.x}
              y2={height - padding.bottom}
              stroke="#ca8a04"
              strokeWidth={1}
              strokeDasharray="1,4"
              className="opacity-40"
            />
            <line
              x1={padding.left}
              y1={midCoords.y}
              x2={width - padding.right}
              y2={midCoords.y}
              stroke="#ca8a04"
              strokeWidth={1}
              strokeDasharray="1,4"
              className="opacity-40"
            />

            {/* Scatter dots */}
            {plotData.map((item) => {
              const xValue = xAxisType === "myRating" ? item.myRating : item.avgRating;
              const { x, y } = getCoords(xValue, item.pricePaid);
              const isHovered = hoveredNode?.id === item.id;

              // Color coordinate depending on flavor or custom categories
              let dotColor = "fill-amber-500 stroke-amber-300";
              if (item.flavour.toLowerCase().includes("smoke")) {
                dotColor = "fill-slate-400 stroke-slate-200 shadow-sm";
              } else if (item.flavour.toLowerCase().includes("fruit")) {
                dotColor = "fill-cyan-400 stroke-cyan-250";
              } else if (item.flavour.toLowerCase().includes("sweet") || item.flavour.toLowerCase().includes("flow")) {
                dotColor = "fill-amber-400 stroke-amber-250";
              } else if (item.flavour.toLowerCase().includes("spice")) {
                dotColor = "fill-red-500 stroke-red-300";
              }

              return (
                <circle
                  key={item.id}
                  cx={x}
                  cy={y}
                  r={isHovered ? 10 : 6}
                  className={`${dotColor} cursor-pointer transition-[r,opacity,filter] duration-200 hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]`}
                  opacity={isHovered ? 1 : hoveredNode ? 0.3 : 0.85}
                  onMouseEnter={(e) => handleNodeHover(e, item)}
                  onMouseLeave={handleNodeLeave}
                  onClick={() => onSelectWhiskey?.(item)}
                />
              );
            })}

            {/* Axes Lines */}
            <line
              x1={padding.left}
              y1={height - padding.bottom}
              x2={width - padding.right}
              y2={height - padding.bottom}
              stroke="#475569"
              strokeWidth={1.5}
            />
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={height - padding.bottom}
              stroke="#475569"
              strokeWidth={1.5}
            />

            {/* Axes Labels */}
            <text
              x={padding.left + (width - padding.left - padding.right) / 2}
              y={height - 12}
              textAnchor="middle"
              className="fill-slate-400 font-sans text-[11px] font-medium tracking-wide uppercase"
            >
              {xAxisType === "myRating" ? "Моя оцінка виробу (Зірки ★)" : "Середня Whizzky оцінка для пляшки (Зірки ★)"}
            </text>
          </svg>
        )}

        {/* Floating Tooltip inside container boundary */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                left: `${Math.min(tooltipPos.x + 12, containerRef.current?.clientWidth ? containerRef.current.clientWidth - 220 : width - 220)}px`,
                top: `${Math.min(tooltipPos.y - 75, containerRef.current?.clientHeight ? containerRef.current.clientHeight - 130 : height - 130)}px`,
              }}
              className="w-52 pointer-events-none rounded-2xl bg-slate-950/90 border border-white/20 p-3.5 shadow-2xl backdrop-blur-xl z-30"
            >
              <div className="flex justify-between items-start gap-1">
                <span className="text-[10px] font-mono tracking-tight uppercase text-amber-500 font-semibold truncate max-w-[120px]">
                  {hoveredNode.flavour}
                </span>
                <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                  {hoveredNode.country}
                </span>
              </div>
              <h5 className="font-sans font-medium text-xs text-white leading-tight mt-1 mb-1.5 truncate">
                {hoveredNode.title}
              </h5>
              
              <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-800/80">
                <div>
                  <span className="block text-[8px] font-mono text-slate-500 uppercase">Ціна</span>
                  <span className="text-xs font-semibold text-white font-mono">
                    {hoveredNode.pricePaid} ₴
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] font-mono text-slate-500 uppercase">Регіон</span>
                  <span className="text-[10px] text-slate-300 block truncate leading-tight mt-0.5">
                    {hoveredNode.region}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-1.5 mt-2 bg-slate-900/40 p-1.5 rounded-lg">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-semibold text-white font-mono">{hoveredNode.myRating}</span>
                  <span className="text-[8px] text-slate-500 font-mono">мій</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                  <span className="text-xs font-semibold text-slate-300 font-mono">{hoveredNode.avgRating}</span>
                  <span className="text-[8px] text-slate-500 font-mono">сер.</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-4 mt-1 pt-2 border-t border-slate-800/30 text-[10px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Димний (Smokey)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Солодкий (Sweet)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Фруктовий (Fruit/Dried)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Спеції (Spice)
        </span>
      </div>
    </div>
  );
};
