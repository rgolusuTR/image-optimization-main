import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function PrivacyBanner() {
    return (
        <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl p-4 flex items-center justify-between shadow-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 via-transparent to-transparent opacity-50 block" />
            <div className="flex items-center gap-4 relative z-10">
                <div className="p-2.5 bg-emerald-100/80 rounded-xl text-emerald-600 shadow-sm ring-1 ring-inset ring-black/5">
                    <ShieldCheck size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        Secure Local Processing
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                        Files never leave your device. 100% private browser-based optimization.
                    </p>
                </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Secure</span>
            </div>
        </div>
    );
}
