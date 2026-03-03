import React, { useState } from 'react';
import { Upload, Search, CloudRain, PlaneTakeoff, Terminal, ShieldAlert, Database, Info } from 'lucide-react';
import AviationCard from './components/AviationCard';

function App() {
  const [activeTab, setActiveTab] = useState('mission');
  const [callsign, setCallsign] = useState('');
  const [chartResponse, setChartResponse] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock handlers
  const handleFileUpload = (e) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setChartResponse({
        raw_text: "METAR KLAX 081953Z 25012KT 10SM FEW015 SCT200 18/12 A2992",
        translated_meaning: "VFR condition at Los Angeles International. Surface winds from 250 magnetic at 12 knots. Excellent visibility.",
        identified_airport: "KLAX",
        flight_category: "VFR"
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020403] text-[#2ee59d] font-robotic relative overflow-hidden selection:bg-[#2ee59d] selection:text-black">
      {/* HUD Effects */}
      <div className="scanline fixed inset-0 pointer-events-none z-50 opacity-20" />
      <div className="hud-scanner fixed top-0 left-0 w-full h-[2px] bg-[#2ee59d]/20 shadow-[0_0_10px_#2ee59d] z-50 pointer-events-none" />

      {/* Header */}
      <nav className="border-b border-[#2ee59d]/10 bg-black/80 backdrop-blur-xl p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-2 border border-[#2ee59d]/30 bg-[#2ee59d]/5 animate-pulse">
              <PlaneTakeoff className="w-6 h-6 text-[#50fa7b]" />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-bold tracking-[0.25em] text-[#50fa7b] leading-tight m-0">SKYLENS</h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] opacity-40 uppercase">INTELLIGENCE UNIT // 7TH FLD</span>
                <span className="w-1 h-1 rounded-full bg-[#2ee59d]/40" />
                <span className="text-[9px] text-[#2ee59d]/60 px-1 border border-[#2ee59d]/20">ALPHA-BETA</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-12">
            {['MISSION CONTROL', 'WEATHER OPLINK', 'RADAR FEED'].map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item.split(' ')[0].toLowerCase())}
                className={`text-[11px] font-bold tracking-[0.3em] transition-all hover:text-[#50fa7b] hover:translate-y-[-1px] cursor-pointer bg-transparent border-none ${item.toLowerCase().includes(activeTab) ? 'text-[#50fa7b] border-b-2 border-[#2ee59d]' : 'text-[#2ee59d]/40'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="text-[9px] text-right space-y-0.5 hidden sm:block opacity-60">
              <div className="flex justify-between gap-4"><span>LAT:</span> <span className="text-[#50fa7b] font-bold">34.0522° N</span></div>
              <div className="flex justify-between gap-4"><span>LON:</span> <span className="text-[#50fa7b] font-bold">118.2437° W</span></div>
            </div>
            <div className="w-[1px] h-10 bg-[#2ee59d]/10" />
            <Terminal className="w-5 h-5 opacity-40" />
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 lg:p-10 space-y-10 relative z-10">

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="hud-card">
              <h2 className="flex items-center gap-3 mb-6 text-sm text-[#50fa7b]">
                <Search className="w-4 h-4" /> <span>CALLSIGN DECODER</span>
              </h2>
              <div className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="DL402..."
                    className="bg-black/60 border border-[#2ee59d]/20 w-full p-4 pl-12 text-[#2ee59d] focus:border-[#2ee59d]/60 focus:outline-none transition-all placeholder:opacity-20 uppercase"
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                  />
                  <Search className="absolute left-4 top-4.5 w-4 h-4 opacity-40" />
                </div>
                <button className="hud-button w-full flex items-center justify-center gap-3">
                  <Database className="w-4 h-4" /> <span>INTERROGATE</span>
                </button>
              </div>
            </div>

            <div className="hud-card group">
              <h2 className="flex items-center gap-3 mb-6 text-sm text-[#50fa7b]">
                <Upload className="w-4 h-4" /> <span>CHART ANALYSIS</span>
              </h2>
              <div className="border border-dashed border-[#2ee59d]/20 p-10 text-center hover:bg-[#2ee59d]/5 transition-all cursor-pointer relative overflow-hidden">
                <input type="file" className="hidden" id="file-upload" onChange={handleFileUpload} />
                <label htmlFor="file-upload" className="cursor-pointer space-y-5">
                  <div className="p-3 border border-[#2ee59d]/20 w-fit mx-auto bg-[#2ee59d]/5 group-hover:border-[#2ee59d]/40 transition-all">
                    <Upload className="w-8 h-8 opacity-40 group-hover:opacity-100" />
                  </div>
                  <div className="text-[10px] tracking-[0.2em] opacity-40 uppercase">
                    UPLOAD METAR / JEPPESEN
                    <span className="block mt-1 text-[8px]">LIMIT: 10MB</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs tracking-[0.4em] opacity-60">SYSTEM_MOD_OUTPUT</h3>
              <div className="h-[1px] flex-1 mx-6 bg-[#2ee59d]/10" />
              <div className="flex gap-2">
                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#2ee59d]/30" />)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AviationCard data={chartResponse} isLoading={isAnalyzing} />

              <div className="hud-card flex items-center justify-center opacity-30 border-dashed border-[#2ee59d]/10">
                <div className="text-center space-y-4">
                  <ShieldAlert className="w-10 h-10 mx-auto opacity-20" />
                  <p className="text-[10px] tracking-widest uppercase">STANDBY FOR UPLINK</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Diagnostic Footer Log */}
        <div className="hud-card bg-black/40 border-l-4 border-[#2ee59d]/60 py-4 px-6 font-robotic text-[10px]">
          <div className="flex items-center gap-4 text-[#2ee59d]/100">
            <span className="bg-[#2ee59d]/10 px-2 py-0.5 font-bold">LOG</span>
            <span className="opacity-60">[23:28:58] INITIALIZING FLIGHT DATA PERSISTENCE...</span>
          </div>
          <div className="flex items-center gap-4 text-[#50fa7b] mt-2 font-bold">
            <span className="bg-[#50fa7b]/20 px-2 py-0.5">SEC</span>
            <span>ENCRYPTED LINK ESTABLISHED WITH GEMINI-CORE-BETA-1.5</span>
          </div>
        </div>

      </main>

      {/* Extreme Footer */}
      <footer className="mt-auto p-4 border-t border-[#2ee59d]/5 text-center">
        <p className="text-[9px] tracking-[0.6em] opacity-20 uppercase m-0">
          PROPRIETARY INTEL SYSTEM // CLASSIFIED CONTENT // DO NOT DISTRIBUTE
        </p>
      </footer>
    </div>
  );
}

export default App;
