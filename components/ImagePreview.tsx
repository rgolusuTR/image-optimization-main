import React from 'react';
import { X, Check } from 'lucide-react';
import { ImageFile, ProcessedImage } from '@/types/image.types';
import { formatBytes } from '@/lib/image-utils';
import { cn } from '@/lib/utils';

interface ImagePreviewProps {
    files: ImageFile[];
    onRemove: (id: string) => void;
    processedImages: ProcessedImage[];
    isProcessing?: boolean;
}

export function ImagePreview({ files, onRemove, processedImages, isProcessing }: ImagePreviewProps) {
    if (files.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file) => {
                    const processed = processedImages.find(p => p.id === file.id);
                    const status = processed?.status || 'idle';

                    return (
                        <div
                            key={file.id}
                            className="group relative bg-white border border-gray-200 rounded-xl p-2 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                                <img
                                    src={file.preview}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                                {!isProcessing && (
                                    <button
                                        onClick={() => onRemove(file.id)}
                                        className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X size={14} />
                                    </button>
                                )}

                                {status === 'complete' && (
                                    <div className="absolute top-1 left-1 p-1 bg-green-500 text-white rounded-full shadow-sm">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                )}

                                {status === 'processing' && (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1 px-1">
                                <p className="text-xs font-medium text-gray-900 truncate" title={file.file.name}>
                                    {file.file.name}
                                </p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-gray-500">{file.width} x {file.height}</p>
                                        <span className="text-[10px] text-gray-400 uppercase">{file.format.split('/')[1]}</span>
                                    </div>
                                    <div className="text-right">
                                        {status === 'complete' && processed ? (
                                            <>
                                                <p className="text-xs font-bold text-green-600">{formatBytes(processed.processedSize)}</p>
                                                <p className="text-[9px] text-gray-400 line-through">{formatBytes(file.originalSize)}</p>
                                            </>
                                        ) : (
                                            <p className="text-[10px] text-gray-500">{formatBytes(file.originalSize)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
