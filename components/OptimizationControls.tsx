import React from 'react';
import { Info, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimizationControlsProps {
    quality: number;
    setQuality: (q: number) => void;
    format: 'jpeg' | 'png' | 'webp' | 'avif';
    setFormat: (f: 'jpeg' | 'png' | 'webp' | 'avif') => void;
    options: {
        removeEXIF: boolean;
        smartCompression: boolean;
    };
    setOptions: (o: any) => void;
    disabled?: boolean;
}

export function OptimizationControls({
    quality,
    setQuality,
    format,
    setFormat,
    options,
    setOptions,
    disabled
}: OptimizationControlsProps) {

    const getQualityLabel = (q: number) => {
        if (q >= 90) return 'High Quality';
        if (q >= 80) return 'Balanced';
        if (q >= 60) return 'Medium';
        return 'Low';
    };

    return (
        <div className="settings-card p-6 space-y-8 h-full bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Optimization Settings</h3>
            </div>

            {/* Quality Slider */}
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-base font-semibold text-slate-700">Quality</label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-blue-600">{quality}%</span>
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                            {getQualityLabel(quality)}
                        </span>
                    </div>
                </div>

                <div className="relative h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full">
                    <input
                        type="range"
                        min="10"
                        max="100"
                        step="1"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        disabled={disabled}
                        className="absolute w-full h-full opacity-100 cursor-pointer z-10"
                        style={{ background: 'transparent' }}
                    />
                    <div
                        className="absolute h-4 w-4 bg-teal-600 border-2 border-white rounded-full shadow pointer-events-none top-1/2 -translate-y-1/2 ml-[-8px]"
                        style={{ left: `${(quality - 10) / 0.9}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Lower Quality</span>
                    <span>Higher Quality</span>
                </div>
                <p className="text-xs text-slate-500">Lower quality = smaller file size. Recommended: 80-90% for web use.</p>
            </div>

            {/* Format Selection */}
            <div className="space-y-2">
                <label className="text-base font-semibold text-slate-700">Output Format</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <FormatButton
                        label="JPEG"
                        sub="Best for photos, no transparency"
                        badge="Medium"
                        badgeColor="bg-yellow-100 text-yellow-700"
                        isSelected={format === 'jpeg'}
                        onClick={() => setFormat('jpeg')}
                    />
                    <FormatButton
                        label="PNG"
                        sub="Lossless, supports transparency"
                        badge="Large"
                        badgeColor="bg-red-100 text-red-700"
                        isSelected={format === 'png'}
                        onClick={() => setFormat('png')}
                    />
                    <FormatButton
                        label="WebP"
                        sub="Modern format, smaller size"
                        badge="Small"
                        badgeColor="bg-blue-100 text-blue-700"
                        isSelected={format === 'webp'}
                        onClick={() => setFormat('webp')}
                    />
                    <FormatButton
                        label="AVIF"
                        sub="Best compression, slower"
                        badge="Smallest"
                        badgeColor="bg-green-100 text-green-700"
                        isSelected={format === 'avif'}
                        onClick={() => setFormat('avif')}
                    />
                </div>

                {format === 'webp' && (
                    <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-xs leading-relaxed mt-2">
                        <Info size={16} className="mt-0.5 flex-shrink-0" />
                        <span><span className="font-bold">WebP</span> is recommended for web use - it offers the best balance of quality and file size with wide browser support.</span>
                    </div>
                )}
            </div>

            {/* Additional Options */}
            <div className="space-y-4 pt-2">
                <label className="text-base font-semibold text-slate-700">Additional Options</label>

                <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={options.removeEXIF}
                                onChange={(e) => setOptions({ ...options, removeEXIF: e.target.checked })}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow-sm transition-all checked:border-teal-600 checked:bg-teal-600 hover:border-teal-500"
                            />
                            <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Remove EXIF Metadata</p>
                            <p className="text-xs text-slate-500 mt-0.5">Strip location, camera, and other metadata for privacy (recommended)</p>
                        </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={options.smartCompression}
                                onChange={(e) => setOptions({ ...options, smartCompression: e.target.checked })}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow-sm transition-all checked:border-teal-600 checked:bg-teal-600 hover:border-teal-500"
                            />
                            <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                Smart Compression
                                <span className="text-[10px] font-bold bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">Experimental</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">Automatically find optimal quality for best size/quality ratio (slower)</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Current Settings Summary */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-4">
                <p className="text-sm font-bold text-slate-800 mb-3">Current Settings</p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-xs">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Format:</span>
                        <span className="font-semibold text-slate-700">{format === 'jpeg' ? 'JPEG' : format === 'png' ? 'PNG' : format.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Quality:</span>
                        <span className="font-semibold text-slate-700">{quality}% ({getQualityLabel(quality).split(' ')[0]})</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">EXIF:</span>
                        <span className="font-semibold text-slate-700">{options.removeEXIF ? 'Removed' : 'Kept'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Compression:</span>
                        <span className="font-semibold text-slate-700">{options.smartCompression ? 'Smart' : 'Standard'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormatButton({ label, sub, badge, badgeColor, isSelected, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative p-3 rounded-xl border text-left transition-all h-full flex flex-col justify-between min-h-[90px]",
                isSelected
                    ? "bg-white border-blue-500 ring-1 ring-blue-500 shadow-md shadow-blue-500/10"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            )}
        >
            <div className="flex justify-between items-start w-full mb-1">
                <span className="text-sm font-bold text-slate-900">{label}</span>
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", badgeColor)}>{badge}</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">{sub}</p>
        </button>
    )
}
