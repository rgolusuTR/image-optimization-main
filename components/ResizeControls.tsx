import React, { useState } from 'react';
import { Lock, Unlock, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PRESETS } from '@/lib/image-utils';
import { PresetType } from '@/types/image.types';

interface ResizeControlsProps {
    width: number;
    height: number;
    onChange: (width: number, height: number) => void;
    originalWidth: number;
    originalHeight: number;
    disabled?: boolean;
}

export function ResizeControls({
    width,
    height,
    onChange,
    originalWidth,
    originalHeight,
    disabled
}: ResizeControlsProps) {
    const [locked, setLocked] = useState(true);
    const [scale, setScale] = useState(100);

    const handleReset = () => {
        onChange(originalWidth, originalHeight);
        setScale(100);
    };

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = parseInt(e.target.value) || 0;
        if (locked) {
            const ratio = originalHeight / originalWidth;
            onChange(newWidth, Math.round(newWidth * ratio));
        } else {
            onChange(newWidth, height);
        }
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = parseInt(e.target.value) || 0;
        if (locked) {
            const ratio = originalWidth / originalHeight;
            onChange(Math.round(newHeight * ratio), newHeight);
        } else {
            onChange(width, newHeight);
        }
    };

    const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newScale = parseInt(e.target.value);
        setScale(newScale);
        const ratio = newScale / 100;
        onChange(Math.round(originalWidth * ratio), Math.round(originalHeight * ratio));
    };

    const applyPreset = (preset: PresetType) => {
        if (preset === 'none' || !PRESETS[preset]) return;
        const { width: pWidth, height: pHeight } = PRESETS[preset];
        onChange(pWidth, pHeight);
    };

    return (
        <div className="settings-card p-6 space-y-7 h-full flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Dimensions</h3>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-full transition-colors"
                >
                    <RotateCcw size={12} />
                    Reset
                </button>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Width</label>
                    <div className="relative group">
                        <input
                            type="number"
                            value={width}
                            onChange={handleWidthChange}
                            disabled={disabled}
                            className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                        />
                        <span className="absolute right-3 top-3.5 text-xs font-medium text-slate-400 group-hover:text-slate-500 transition-colors">px</span>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Height</label>
                    <div className="relative group">
                        <input
                            type="number"
                            value={height}
                            onChange={handleHeightChange}
                            disabled={disabled}
                            className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-slate-800 font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                        />
                        <span className="absolute right-3 top-3.5 text-xs font-medium text-slate-400 group-hover:text-slate-500 transition-colors">px</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
                <button
                    onClick={() => setLocked(!locked)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all shadow-sm",
                        locked
                            ? "bg-white border-slate-200 text-indigo-600 shadow-indigo-500/5"
                            : "bg-slate-100 border-transparent text-slate-500 hover:bg-white hover:border-slate-200"
                    )}
                >
                    {locked ? <Lock size={12} strokeWidth={2.5} /> : <Unlock size={12} strokeWidth={2.5} />}
                    {locked ? 'Locked' : 'Unlocked'}
                </button>
                <span className="text-xs font-medium text-slate-400">Original: {originalWidth} x {originalHeight}</span>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <label className="text-xs font-semibold text-slate-500">Scaling</label>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{scale}%</span>
                </div>
                <div className="relative h-1.5 bg-slate-100 rounded-full">
                    <input
                        type="range"
                        min="10"
                        max="200"
                        value={scale}
                        onChange={handleScaleChange}
                        disabled={disabled}
                        className="absolute w-full h-full opacity-100 cursor-pointer z-10"
                        style={{ background: 'transparent' }}
                    />
                    <div
                        className="absolute h-full bg-indigo-500 rounded-full pointer-events-none"
                        style={{ width: `${Math.min(100, (scale - 10) / 1.9)}%` }}
                    />
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">Quick Presets</label>
                <div className="grid grid-cols-2 gap-2">
                    <PresetButton label="Instagram Post" sub="1080x1080" onClick={() => applyPreset('instagram-post')} />
                    <PresetButton label="Instagram Story" sub="1080x1920" onClick={() => applyPreset('instagram-story')} />
                    <PresetButton label="Twitter Header" sub="1500x500" onClick={() => applyPreset('twitter-header')} />
                    <PresetButton label="Web Thumbnail" sub="400x300" onClick={() => applyPreset('web-thumbnail')} />
                    <PresetButton label="Hero Image" sub="2778x1100" onClick={() => applyPreset('hero')} />
                    <PresetButton label="Billboard" sub="1100x700" onClick={() => applyPreset('billboard')} />
                </div>
            </div>
        </div>
    );
}

function PresetButton({ label, sub, onClick }: { label: string, sub: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-start p-3 bg-white hover:bg-slate-50 border border-slate-100 hover:border-indigo-200 rounded-xl transition-all text-left shadow-sm hover:shadow active:scale-[0.98]"
        >
            <span className="text-xs font-bold text-slate-700">{label}</span>
            <span className="text-[10px] font-medium text-slate-400">{sub}</span>
        </button>
    );
}
