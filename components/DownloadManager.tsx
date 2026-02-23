import React, { useState } from 'react';
import { Download, RefreshCcw, FileArchive, Check } from 'lucide-react';
import { ProcessedImage } from '@/types/image.types';
import { formatBytes } from '@/lib/image-utils';
import { createZip } from '@/lib/zip-utils';

interface DownloadManagerProps {
    results: ProcessedImage[];
    onClear: () => void;
}

export function DownloadManager({ results, onClear }: DownloadManagerProps) {
    const [isZipping, setIsZipping] = useState(false);
    const completedImages = results.filter(r => r.status === 'complete');

    const totalOriginalSize = completedImages.reduce((acc, curr) => acc + curr.originalSize, 0);
    const totalOptimizedSize = completedImages.reduce((acc, curr) => acc + curr.processedSize, 0);
    const totalSaved = totalOriginalSize - totalOptimizedSize;
    const totalReduction = totalOriginalSize > 0 ? (totalSaved / totalOriginalSize) * 100 : 0;

    const handleDownloadSingle = (img: ProcessedImage) => {
        const url = URL.createObjectURL(img.processedBlob);
        const a = document.createElement('a');
        a.href = url;
        // Fix extension if needed
        let ext = img.format.split('/')[1];
        if (ext === 'jpeg') ext = 'jpg';
        a.download = img.name ?
            (img.name.lastIndexOf('.') > -1 ? img.name.substring(0, img.name.lastIndexOf('.')) + `_optimized.${ext}` : `${img.name}_optimized.${ext}`)
            : `optimized_${img.id}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadAll = async () => {
        setIsZipping(true);
        try {
            // Lazy load zip utils to save initial bundle size? 
            // We already imported specialized zip-utils in lib, assuming it's efficient
            // But we need to use the one we created in lib/zip-utils.ts
            const { createZip } = await import('@/lib/zip-utils');
            const zipBlob = await createZip(completedImages);

            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `optimized_images_batch.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Zip failed", e);
        } finally {
            setIsZipping(false);
        }
    };

    if (completedImages.length === 0) return null;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Results</h3>
                    <p className="text-sm text-slate-500">
                        Saved <span className="text-green-600 font-bold">{formatBytes(totalSaved)}</span> ({totalReduction.toFixed(0)}%)
                    </p>
                </div>
                <button
                    onClick={onClear}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-red-500"
                    title="Clear All"
                >
                    <RefreshCcw size={18} />
                </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar mb-6">
                {completedImages.map((img) => (
                    <div key={img.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                                {img.format.split('/')[1].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px]" title={img.name}>{img.name}</p>
                                <p className="text-xs text-slate-500 font-medium">
                                    {formatBytes(img.originalSize)} <span className="text-slate-300">→</span> <span className="text-green-600 font-bold">{formatBytes(img.processedSize)}</span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDownloadSingle(img)}
                            className="p-2 hover:bg-white text-slate-400 hover:text-blue-600 hover:shadow-sm rounded-lg transition-all"
                            title="Download"
                        >
                            <Download size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={handleDownloadAll}
                    disabled={isZipping}
                    className="flex-1 bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/10 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isZipping ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <FileArchive size={18} />
                    )}
                    {isZipping ? 'Zipping...' : 'Download All as ZIP'}
                </button>
            </div>
        </div>
    );
}
