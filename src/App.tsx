import { useState, useMemo } from "react";
import { parseCSV, DEFAULT_WHISKEY_CSV } from "./data";
import { Whiskey } from "./types";
import { MetricCard } from "./components/MetricCard";
import { WhiskeyScatterPlot } from "./components/WhiskeyScatterPlot";
import { WhiskeyCategoryChart } from "./components/WhiskeyCategoryChart";
import { WhiskeyFlavourChart } from "./components/WhiskeyFlavourChart";
import { WhiskeyComparison } from "./components/WhiskeyComparison";
import { CsvImporter } from "./components/CsvImporter";
import { 
  GlassWater, 
  Search, 
  MapPin, 
  DollarSign, 
  Star, 
  X, 
  ChevronUp, 
  ChevronDown, 
  ExternalLink, 
  Database, 
  Sparkles, 
  FilterX, 
  Flame,
  Award,
  CirclePlay,
  TrendingUp,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // 1. Core dataset states
  const [rawCsvStr, setRawCsvStr] = useState<string>(DEFAULT_WHISKEY_CSV);
  const [whiskeys, setWhiskeys] = useState<Whiskey[]>(() => parseCSV(DEFAULT_WHISKEY_CSV));

  // 2. Selectable detail state
  const [selectedWhiskeyId, setSelectedWhiskeyId] = useState<string | null>(null);

  // 3. Filters states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedFlavour, setSelectedFlavour] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Auto-calculated boundaries
  const boundaries = useMemo(() => {
    if (whiskeys.length === 0) return { maxPrice: 5000, minPrice: 0 };
    const prices = whiskeys.map((w) => w.pricePaid);
    return {
      maxPrice: Math.max(...prices, 1000),
      minPrice: Math.min(...prices, 0),
    };
  }, [whiskeys]);

  const [priceLimit, setPriceLimit] = useState<number | null>(null);
  const currentPriceLimit = priceLimit !== null ? priceLimit : boundaries.maxPrice;

  // Sorting states
  const [sortField, setSortField] = useState<keyof Whiskey>("myRating");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // 4. Handle incoming imported data
  const handleDataImport = (newData: Whiskey[], rawCsvContent: string) => {
    setWhiskeys(newData);
    setRawCsvStr(rawCsvContent);
    setSelectedWhiskeyId(null);
    setPriceLimit(null); // Reset price slider boundary helper
    // Clear filters to avoid confusing user
    setSearchTerm("");
    setSelectedCountry(null);
    setSelectedFlavour(null);
    setSelectedCategory(null);
    setSelectedRegion(null);
  };

  // 5. Unique values lists for filters
  const uniqueCountries = useMemo(() => {
    return Array.from(new Set(whiskeys.map((w) => w.country))).filter(Boolean).sort();
  }, [whiskeys]);

  const uniqueFlavours = useMemo(() => {
    return Array.from(new Set(whiskeys.map((w) => w.flavour))).filter(Boolean).sort();
  }, [whiskeys]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(whiskeys.map((w) => w.category))).filter(Boolean).sort();
  }, [whiskeys]);

  const uniqueRegions = useMemo(() => {
    return Array.from(new Set(whiskeys.map((w) => w.region))).filter(Boolean).sort();
  }, [whiskeys]);

  // 6. Apply filtering logic
  const filteredWhiskeys = useMemo(() => {
    return whiskeys.filter((item) => {
      // Name Search
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Country
      const matchesCountry = selectedCountry ? item.country === selectedCountry : true;

      // Flavour
      const matchesFlavour = selectedFlavour
        ? item.flavour.toLowerCase() === selectedFlavour.toLowerCase()
        : true;

      // Category
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;

      // Region
      const matchesRegion = selectedRegion ? item.region === selectedRegion : true;

      // Price limit
      const matchesPrice = item.pricePaid <= currentPriceLimit;

      return (
        matchesSearch &&
        matchesCountry &&
        matchesFlavour &&
        matchesCategory &&
        matchesRegion &&
        matchesPrice
      );
    });
  }, [whiskeys, searchTerm, selectedCountry, selectedFlavour, selectedCategory, selectedRegion, currentPriceLimit]);

  // 7. Sort the filtered array
  const sortedAndFilteredWhiskeys = useMemo(() => {
    const sorted = [...filteredWhiskeys];
    sorted.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      
      // String fallbacks
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return sortDirection === "asc" ? -1 : 1;
      if (strA > strB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredWhiskeys, sortField, sortDirection]);

  // 8. Derived dashboard stats
  const stats = useMemo(() => {
    const pool = filteredWhiskeys.length > 0 ? filteredWhiskeys : whiskeys;
    const hasFiltered = filteredWhiskeys.length > 0;

    const totalCount = pool.length;
    const totalPrices = pool.reduce((sum, w) => sum + w.pricePaid, 0);
    const avgPrice = totalCount > 0 ? Math.round(totalPrices / totalCount) : 0;

    const totalMyRating = pool.reduce((sum, w) => sum + w.myRating, 0);
    const avgMyRating = totalCount > 0 ? Number((totalMyRating / totalCount).toFixed(2)) : 0;

    // Highest rated whiskey
    let bestSelection: Whiskey | null = null;
    if (pool.length > 0) {
      bestSelection = [...pool].sort((a, b) => b.myRating - a.myRating)[0];
    }

    return {
      totalCount,
      avgPrice,
      avgMyRating,
      bestSelection,
      hasFiltered,
    };
  }, [whiskeys, filteredWhiskeys]);

  // Details card of single selected item
  const selectedWhiskey = useMemo(() => {
    return whiskeys.find((w) => w.id === selectedWhiskeyId) || null;
  }, [whiskeys, selectedWhiskeyId]);

  // Toggle heading sort
  const handleSort = (field: keyof Whiskey) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to desc upon selecting new field
    }
  };

  // Clear all filter overrides
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCountry(null);
    setSelectedFlavour(null);
    setSelectedCategory(null);
    setSelectedRegion(null);
    setPriceLimit(null);
  };

  // Export filtered rows back to standard CSV
  const handleExportCSV = () => {
    if (sortedAndFilteredWhiskeys.length === 0) return;
    const headers = "Title;Region;Category;Whizzky Link;Flavour;Price Paid;My Rates;Avg.Rating;Price £;Country\n";
    const body = sortedAndFilteredWhiskeys
      .map((w) => 
        `"${w.title}";"${w.region}";"${w.category}";"${w.link}";"${w.flavour}";${w.pricePaid};${w.myRating};${w.avgRating};${w.priceGbp};"${w.country}"`
      )
      .join("\n");
    
    const blob = new Blob([headers + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `whiskey_dashboard_filter_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#070913] bg-gradient-to-b from-[#0a0f24] to-[#050711] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white pb-16 relative overflow-x-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[5%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-600/5 blur-[120px] pointer-events-none animate-float" />
      <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-blue-500/5 to-emerald-500/5 blur-[150px] pointer-events-none" style={{ animation: "float 6s ease-in-out infinite" }} />

      {/* Main Luxury Header */}
      <header className="relative border-b border-white/10 bg-[#070913]/70 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
              <GlassWater className="w-6 h-6 text-slate-950 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                  Інтерактивна Інформаційна Панель
                </h1>
                <span className="text-[10px] uppercase font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/15">
                  Pro v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Професійний аналіз, візуалізація та збалансоване порівняння брендів
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              База: <strong className="text-slate-300">{whiskeys.length} записів</strong>
            </span>
            <span className="h-4 w-[1px] bg-slate-800" />
            <span className="text-slate-500">
              Стан: <span className="text-emerald-400 font-semibold flex items-center gap-1 inline-flex"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />Активний</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* CSV importer */}
        <CsvImporter onImport={handleDataImport} currentRawCsv={rawCsvStr} />

        {/* Global interactive search & filter strip */}
        <section className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 backdrop-blur-xl shadow-xl">
          <div className="flex justify-between items-center mb-2.5">
            <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              Параметри фільтрації та аналізу
            </h3>
            {stats.hasFiltered && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-all cursor-pointer"
              >
                <FilterX className="w-3.5 h-3.5" />
                Скинути фільтри
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
            {/* Search */}
            <div className="lg:col-span-3 relative">
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 leading-none">Пошук назви / сорту</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Шукати Laphroaig, Speyside..."
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-xs rounded-lg pl-9.5 pr-3 py-1.5 focus:border-white/30 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Country Dropdown */}
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 leading-none">Країна походження</label>
              <select
                value={selectedCountry || ""}
                onChange={(e) => setSelectedCountry(e.target.value || null)}
                className="w-full mt-1 bg-[#090d22] border border-white/10 text-white text-xs rounded-lg px-2.5 py-1.5 focus:border-white/30 focus:outline-none transition-all cursor-pointer font-sans [&>option]:bg-slate-950 [&>option]:text-white"
              >
                <option value="">Усі країни</option>
                {uniqueCountries.map((country) => (
                  <option key={`c-${country}`} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Dropdown */}
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 leading-none">Тип (Категорія)</label>
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full mt-1 bg-[#090d22] border border-white/10 text-white text-xs rounded-lg px-2.5 py-1.5 focus:border-white/30 focus:outline-none transition-all cursor-pointer font-sans [&>option]:bg-slate-950 [&>option]:text-white"
              >
                <option value="">Усі категорії</option>
                {uniqueCategories.map((category) => (
                  <option key={`cat-${category}`} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Flavour Dropdown */}
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 leading-none">Смаковий профіль</label>
              <select
                value={selectedFlavour || ""}
                onChange={(e) => setSelectedFlavour(e.target.value || null)}
                className="w-full mt-1 bg-[#090d22] border border-white/10 text-white text-xs rounded-lg px-2.5 py-1.5 focus:border-white/30 focus:outline-none transition-all cursor-pointer font-sans [&>option]:bg-slate-950 [&>option]:text-white"
              >
                <option value="">Усі смаки</option>
                {uniqueFlavours.map((flavour) => (
                  <option key={`fl-${flavour}`} value={flavour}>
                    {flavour.charAt(0).toUpperCase() + flavour.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Limit Slider */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-1 leading-none">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Макс. ціна покупки</label>
                <span className="text-xs font-mono font-bold text-indigo-400">
                  {currentPriceLimit} ₴
                </span>
              </div>
              <input
                type="range"
                min={boundaries.minPrice}
                max={boundaries.maxPrice}
                step={50}
                value={currentPriceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
                className="w-full h-1.5 mt-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5 leading-none">
                <span>{boundaries.minPrice} ₴</span>
                <span>{boundaries.maxPrice} ₴</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bento stats row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Завантажено сортів"
            value={stats.totalCount}
            subtext={stats.hasFiltered ? `з ${whiskeys.length} в базі` : "загалом по базі"}
            icon={GlassWater}
            iconColorClass="text-amber-500"
            trend={
              stats.hasFiltered
                ? {
                    value: `${Math.round((stats.totalCount / whiskeys.length) * 100)}% є присутніми`,
                    isPositive: true,
                  }
                : undefined
            }
          />
          <MetricCard
            title="Сер. Сплачена ціна"
            value={`${stats.avgPrice} ₴`}
            subtext="серед всіх пляшок"
            icon={DollarSign}
            iconColorClass="text-emerald-400"
          />
          <MetricCard
            title="Мій середній бал"
            value={`${stats.avgMyRating} / 5`}
            subtext="власна дегустація"
            icon={Star}
            iconColorClass="text-amber-400 animate-float"
          />
          {stats.bestSelection ? (
            <MetricCard
              title="Найкращий за балом"
              value={stats.bestSelection.title.substring(0, 18) + (stats.bestSelection.title.length > 18 ? "..." : "")}
              subtext={`${stats.bestSelection.myRating} зірок / ${stats.bestSelection.flavour}`}
              icon={Award}
              iconColorClass="text-amber-500"
            />
          ) : (
            <MetricCard
              title="Найкращий за балом"
              value="Не знайдено"
              subtext="змініть фільтри"
              icon={Award}
              iconColorClass="text-slate-600"
            />
          )}
        </section>

        {/* Grid level with interactive layout panels */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column level 1 */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Scatter Plot */}
            <WhiskeyScatterPlot
              data={filteredWhiskeys}
              onSelectWhiskey={(w) => setSelectedWhiskeyId(w.id)}
            />

            {/* Custom Horizontal Flavour EQ Stats */}
            <WhiskeyFlavourChart
              data={filteredWhiskeys}
              selectedFlavour={selectedFlavour}
              onSelectFlavour={setSelectedFlavour}
            />

          </div>

          {/* Column level 2 */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Category Donut graph */}
            <WhiskeyCategoryChart
              data={filteredWhiskeys}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Interactive Compare Engine */}
            <WhiskeyComparison whiskeys={whiskeys} />

          </div>
        </section>

        {/* Detailed items database explorer. Includes CSV exporter */}
        <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-4 border-b border-white/10 gap-3">
            <div>
              <h3 className="font-sans font-medium text-white text-base">
                Реєстр записів бази даних та Фільтрована вибірка
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Повний детальний перелік. Натискайте заголовки колонок, щоб сортувати результати.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                disabled={sortedAndFilteredWhiskeys.length === 0}
                className="text-xs bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-sans transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                Експорт у CSV
              </button>
            </div>
          </div>

          {/* Quick interactive search tags showing applied states */}
          {(searchTerm || selectedCountry || selectedCategory || selectedFlavour || selectedRegion) && (
            <div className="flex flex-wrap gap-1.5 mb-4 items-center">
              <span className="text-[10px] text-slate-500 font-mono uppercase mr-1">Активні фільтри:</span>
              {searchTerm && (
                <span className="bg-white/10 border border-white/10 text-xs px-2.5 py-1 rounded-xl text-slate-200 flex items-center gap-1.5 backdrop-blur-sm">
                  Пошук: "{searchTerm}"
                  <X className="w-3 h-3 text-slate-400 hover:text-white cursor-pointer" onClick={() => setSearchTerm("")} />
                </span>
              )}
              {selectedCountry && (
                <span className="bg-white/10 border border-white/10 text-xs px-2.5 py-1 rounded-xl text-slate-200 flex items-center gap-1.5 backdrop-blur-sm">
                  Країна: {selectedCountry}
                  <X className="w-3 h-3 text-slate-400 hover:text-white cursor-pointer" onClick={() => setSelectedCountry(null)} />
                </span>
              )}
              {selectedCategory && (
                <span className="bg-white/10 border border-white/10 text-xs px-2.5 py-1 rounded-xl text-slate-200 flex items-center gap-1.5 backdrop-blur-sm">
                  Сорт: {selectedCategory}
                  <X className="w-3 h-3 text-slate-400 hover:text-white cursor-pointer" onClick={() => setSelectedCategory(null)} />
                </span>
              )}
              {selectedFlavour && (
                <span className="bg-white/10 border border-white/10 text-xs px-2.5 py-1 rounded-xl text-slate-200 flex items-center gap-1.5 backdrop-blur-sm">
                  Смак: {selectedFlavour}
                  <X className="w-3 h-3 text-slate-400 hover:text-white cursor-pointer" onClick={() => setSelectedFlavour(null)} />
                </span>
              )}
              {selectedRegion && (
                <span className="bg-white/10 border border-white/10 text-xs px-2.5 py-1 rounded-xl text-slate-200 flex items-center gap-1.5 backdrop-blur-sm">
                  Регіон: {selectedRegion}
                  <X className="w-3 h-3 text-slate-400 hover:text-white cursor-pointer" onClick={() => setSelectedRegion(null)} />
                </span>
              )}
            </div>
          )}

          {/* Robust Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] shadow-inner">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[11px] font-mono uppercase text-slate-300/80 tracking-wider">
                  <th className="py-3 px-4 font-medium">#</th>
                  <th className="py-3 px-4 font-medium cursor-pointer hover:text-amber-500 transition-colors" onClick={() => handleSort("title")}>
                    Бренд / Назва {sortField === "title" && (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="py-3 px-4 font-medium cursor-pointer hover:text-amber-500 transition-colors" onClick={() => handleSort("country")}>
                    Країна / Регіон {sortField === "country" && (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="py-3 px-4 font-medium cursor-pointer hover:text-amber-500 transition-colors" onClick={() => handleSort("category")}>
                    Категорія {sortField === "category" && (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="py-3 px-4 font-medium cursor-pointer hover:text-amber-500 transition-colors" onClick={() => handleSort("flavour")}>
                    Смак {sortField === "flavour" && (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="py-3 px-4 font-medium text-right cursor-pointer hover:text-amber-500 transition-colors" onClick={() => handleSort("pricePaid")}>
                    Вартість {sortField === "pricePaid" && (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="py-3 px-4 font-medium text-right cursor-pointer hover:text-amber-500 transition-colors" onClick={() => handleSort("myRating")}>
                    Мій бал {sortField === "myRating" && (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="py-3 px-4 font-medium text-right cursor-pointer hover:text-amber-500 transition-colors" onClick={() => handleSort("avgRating")}>
                    Whizzky {sortField === "avgRating" && (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="py-3 px-4 font-medium text-center">Огляди</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {sortedAndFilteredWhiskeys.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center font-mono text-slate-500">
                      Не знайдено жодного зразка за вказаними фільтрами. Будь ласка, спростіть фільтраційні запити.
                    </td>
                  </tr>
                ) : (
                  sortedAndFilteredWhiskeys.map((item, index) => {
                    const isSelected = selectedWhiskeyId === item.id;
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors cursor-pointer group/tr ${
                          isSelected 
                            ? "bg-white/10 hover:bg-white/15" 
                            : "hover:bg-white/[0.03]"
                        }`}
                        onClick={() => setSelectedWhiskeyId(isSelected ? null : item.id)}
                      >
                        <td className="py-3 px-4 font-mono text-slate-500 text-[10px]/tight">{index + 1}</td>
                        <td className="py-3 px-4">
                          <span className="font-sans font-medium text-white group-hover/tr:text-amber-400 transition-colors duration-250 block">
                            {item.title}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-300 font-sans block">{item.country}</span>
                          <span className="text-[10px] text-slate-500 leading-none block font-mono">{item.region}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {item.category}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-tight ${
                            item.flavour.toLowerCase().includes("smoke") 
                              ? "bg-slate-500/10 text-slate-300 border border-slate-500/20"
                              : item.flavour.toLowerCase().includes("sweet") || item.flavour.toLowerCase().includes("flow")
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                              : item.flavour.toLowerCase().includes("fruit")
                              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/15"
                              : item.flavour.toLowerCase().includes("spice")
                              ? "bg-red-500/10 text-red-400 border border-red-500/15"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}>
                            {item.flavour}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-200">
                          <strong>{item.pricePaid}</strong> <span className="text-[10px] text-slate-500">₴</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1 font-mono">
                            <span className="text-amber-400 font-bold">{item.myRating}</span>
                            <span className="text-slate-500">★</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1 font-mono text-slate-400">
                            <span>{item.avgRating}</span>
                            <span className="text-slate-600">★</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-7 w-7 rounded-lg border border-slate-800 hover:border-amber-500/40 items-center justify-center text-slate-500 hover:text-amber-400 bg-slate-900/30 hover:bg-slate-950 transition-all"
                              title="Відвідати Whizzky сторінку"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-slate-600 font-mono text-[10px]">&mdash;</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Floating details banner logic */}
        <AnimatePresence>
          {selectedWhiskey && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 left-6 md:right-8 md:left-auto md:w-96 rounded-3xl bg-[#090b16]/90 border border-white/20 p-5 shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
            >
              {/* Design line accent */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-650" />
              
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-200 bg-white/10 px-2.5 py-1 rounded-xl border border-white/10">
                    {selectedWhiskey.flavour}
                  </span>
                  <h4 className="font-sans font-semibold text-sm text-white mt-2.5 leading-tight">
                    {selectedWhiskey.title}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">
                    {selectedWhiskey.category}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedWhiskeyId(null)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase">Країна / Регіон</span>
                  <span className="text-slate-200 mt-0.5 block truncate">
                    {selectedWhiskey.country} ({selectedWhiskey.region})
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase">Сума покупки</span>
                  <span className="text-emerald-400 mt-0.5 block font-bold">
                    {selectedWhiskey.pricePaid} ₴
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase">Моя оцінка</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {selectedWhiskey.myRating} / 5
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase">Середня Whizzky</span>
                  <span className="text-slate-300 font-bold flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-slate-300 stroke-slate-400" />
                    {selectedWhiskey.avgRating} / 5
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between gap-2">
                {selectedWhiskey.link && (
                  <a
                    href={selectedWhiskey.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-xs text-center bg-white/5 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 py-2.5 rounded-xl flex items-center justify-center gap-1 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Сайтовий огляд
                  </a>
                )}
                <button
                  onClick={() => setSelectedWhiskeyId(null)}
                  className="flex-1 text-xs text-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white py-2.5 rounded-xl font-medium transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
                >
                  Закрити деталі
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
