import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileWarning, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
    onUpload: (files: File[]) => void;
    isProcessing?: boolean;
    className?: string;
    maxFiles?: number;
    maxSizeMB?: number;
}

export function ImageUploader({
    onUpload,
    isProcessing,
    className,
    maxFiles = 20,
    maxSizeMB = 50
}: ImageUploaderProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            if (acceptedFiles.length > maxFiles) {
                alert(`You can only upload up to ${maxFiles} images at once.`);
                onUpload(acceptedFiles.slice(0, maxFiles));
            } else {
                onUpload(acceptedFiles);
            }
        }
    }, [onUpload, maxFiles]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': [],
            'image/avif': [],
            'image/gif': [],
        },
        disabled: isProcessing,
        multiple: true,
        maxSize: maxSizeMB * 1024 * 1024
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out relative overflow-hidden group",
                "h-72 flex flex-col items-center justify-center p-8 text-center bg-white/50 backdrop-blur-sm",
                isDragActive
                    ? "border-indigo-500 bg-indigo-50/50 scale-[1.01]"
                    : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50 hover:shadow-lg hover:shadow-indigo-500/5",
                isDragReject && "border-red-500 bg-red-50/50",
                isProcessing && "opacity-50 cursor-not-allowed pointer-events-none grayscale",
                className
            )}
        >
            <input {...getInputProps()} />

            {/* Background Decor */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

            <div className="flex flex-col items-center gap-6 relative z-10">
                <div className={cn(
                    "p-5 rounded-2xl transition-all duration-300 shadow-sm ring-1 ring-inset ring-black/5",
                    isDragActive
                        ? "bg-indigo-500 text-white shadow-indigo-500/25 scale-110"
                        : "bg-white text-indigo-500 group-hover:scale-110 group-hover:text-indigo-600 group-hover:shadow-md"
                )}>
                    {isDragReject ? (
                        <FileWarning className="w-8 h-8" />
                    ) : (
                        isDragActive ? <Upload className="w-8 h-8 animate-bounce" /> : <ImagePlus className="w-8 h-8" />
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-700 tracking-tight group-hover:text-indigo-900 transition-colors">
                        {isDragActive ? 'Drop files instantly' : 'Upload your images'}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 group-hover:text-slate-600">
                        Drag & drop or click to browse
                    </p>
                    <div className="flex items-center gap-2 justify-center text-xs text-slate-400 mt-2">
                        <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200">JPG</span>
                        <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200">PNG</span>
                        <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200">WebP</span>
                        <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200">AVIF</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
