import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  iconColorClass?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  iconColorClass = "text-amber-500",
  trend,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-white/[0.04] border border-white/10 p-4 shadow-xl backdrop-blur-xl group hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300"
    >
      {/* Background radial gradient glow on group hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] sm:text-xs font-mono tracking-wider text-slate-300/60 uppercase">
            {title}
          </p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white font-sans">
            {value}
          </h3>
          {subtext && (
            <p className="mt-0.5 text-[10px] sm:text-xs text-slate-400 font-mono">
              {subtext}
            </p>
          )}
        </div>
        <div className={`rounded-xl bg-white/10 border border-white/10 p-2.5 shrink-0 ${iconColorClass}`}>
          <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center space-x-1">
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {trend.value}
          </span>
          <span className="text-xs text-slate-500 font-mono">порівняно з сер.</span>
        </div>
      )}
    </motion.div>
  );
};
