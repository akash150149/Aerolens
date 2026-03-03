import React from 'react';
import { Plane, AlertTriangle, CheckCircle2, Info, Wind, Database } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const AviationCard = ({ data, isLoading, type = 'chart' }) => {
    if (isLoading) {
        return (
            <div className="hud-card animate-pulse flex flex-col gap-6">
                <div className="h-4 bg-[#2ee59d]/10 w-3/4" />
                <div className="h-32 bg-[#2ee59d]/5 w-full border border-[#2ee59d]/10" />
                <div className="h-4 bg-[#2ee59d]/10 w-1/2" />
            </div>
        );
    }

    if (!data) return null;

    const isInsufficient = data.translated_meaning === 'VISUAL DATA INSUFFICIENT';

    return (
        <div className={cn(
            "hud-card relative group",
            isInsufficient && "border-red-500/50 shadow-red-500/20"
        )}>
            <div className="flex justify-between items-start mb-6 border-b border-[#2ee59d]/10 pb-3">
                <div className="flex items-center gap-3">
                    {isInsufficient ? (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    ) : (
                        <Plane className="w-5 h-5 text-[#50fa7b]" />
                    )}
                    <h3 className={cn("text-sm font-bold tracking-widest m-0", isInsufficient ? "text-red-500" : "text-[#50fa7b]")}>
                        {type === 'chart' ? 'RADAR ANALYSIS' : 'FLIGHT DATA'}
                    </h3>
                </div>
                <span className="text-[10px] opacity-40 font-robotic">
                    ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                </span>
            </div>

            <div className="space-y-6">
                <section>
                    <label className="text-[9px] uppercase tracking-widest opacity-40 mb-2 block">Identified Source</label>
                    <div className="bg-black/60 p-4 border-l-2 border-[#2ee59d]/30 text-xs leading-relaxed break-words whitespace-pre-wrap">
                        {data.raw_text || 'WAITING FOR DATA...'}
                    </div>
                </section>

                <section>
                    <label className="text-[9px] uppercase tracking-widest opacity-40 mb-2 block">System Interpretation</label>
                    <p className={cn(
                        "text-sm font-bold leading-relaxed",
                        isInsufficient ? "text-red-400" : "text-[#50fa7b]"
                    )}>
                        {data.translated_meaning}
                    </p>
                </section>

                {!isInsufficient && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2ee59d]/5">
                        <div className="bg-[#2ee59d]/5 p-3 border border-[#2ee59d]/10">
                            <label className="text-[8px] uppercase opacity-40 flex items-center gap-1.5 mb-1">
                                <Info className="w-3 h-3" /> AIRPORT ICAO
                            </label>
                            <div className="text-base font-bold text-[#50fa7b]">{data.identified_airport || '---'}</div>
                        </div>
                        <div className="bg-[#2ee59d]/5 p-3 border border-[#2ee59d]/10">
                            <label className="text-[8px] uppercase opacity-40 flex items-center gap-1.5 mb-1">
                                <Database className="w-3 h-3" /> FLT CATEGORY
                            </label>
                            <div className="text-base font-bold text-[#50fa7b]">{data.flight_category || '---'}</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 flex items-center gap-2 text-[9px] opacity-20 uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#50fa7b] animate-pulse" />
                Feed Verified // Gemini-Core 7.2
            </div>
        </div>
    );
};

export default AviationCard;
