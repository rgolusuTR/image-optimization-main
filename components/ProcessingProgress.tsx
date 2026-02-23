import React from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProcessedImage } from '@/types/image.types';

interface ProcessingProgressProps {
    status: 'idle' | 'processing' | 'completed';
    progress: number;
    totalImages: number;
    processedCount: number;
    results: ProcessedImage[];
}

export function ProcessingProgress({
    status,
    progress,
    totalImages,
    processedCount,
    results
}: ProcessingProgressProps) {
    if (status === 'idle') return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4">
            <div className="glass-panel p-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl bg-black/80">
                <div className="flex items-center gap-4 mb-3">
                    <div className="relative">
                        {status === 'processing' ? (
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        ) : (
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-white">
                                {status === 'processing'
                                    ? `Optimizing ${processedCount + 1} of ${totalImages} images...`
                                    : 'Optimization Complete!'}
                            </span>
                            <span className="text-sm text-blue-400">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Mini stats */}
                {results.length > 0 && (
                    <div className="flex gap-4 text-xs text-gray-400 pl-12 border-t border-white/5 pt-2">
                        <div>
                            Processed: <span className="text-white">{processedCount}</span>
                        </div>
                        <div>
                            Success: <span className="text-green-400">{results.filter(r => r.status === 'complete').length}</span>
                        </div>
                        {results.some(r => r.status === 'error') && (
                            <div>
                                Failed: <span className="text-red-400">{results.filter(r => r.status === 'error').length}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
