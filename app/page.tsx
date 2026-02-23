'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Zap, Github, Image as ImageIcon } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { ImagePreview } from '@/components/ImagePreview';
import { ResizeControls } from '@/components/ResizeControls';
import { OptimizationControls } from '@/components/OptimizationControls';
import { ProcessingProgress } from '@/components/ProcessingProgress';
import { DownloadManager } from '@/components/DownloadManager';
import { PrivacyBanner } from '@/components/PrivacyBanner';
import { ImageFile, ProcessedImage, WorkerMessage } from '@/types/image.types';
import { getImageDimensions } from '@/lib/image-utils';

export default function Home() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  // Settings State
  const [resizeWidth, setResizeWidth] = useState(1024);
  const [resizeHeight, setResizeHeight] = useState(1024);
  const [quality, setQuality] = useState(85);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp' | 'avif'>('jpeg');
  const [options, setOptions] = useState({
    removeEXIF: true,
    smartCompression: false
  });

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/image-processor.worker.ts', import.meta.url));
    workerRef.current.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const { type, imageId, data } = event.data;
      if (type === 'complete' && data?.blob) handleImageComplete(imageId, data.blob);
      else if (type === 'error') handleImageError(imageId, data?.error);
    };
    return () => { workerRef.current?.terminate(); };
  }, [files.length]);

  const handleUpload = async (uploadedFiles: File[]) => {
    const newFiles: ImageFile[] = [];
    for (const file of uploadedFiles) {
      if (files.some(f => f.file.name === file.name && f.file.size === file.size)) continue;
      const id = crypto.randomUUID();
      const preview = URL.createObjectURL(file);
      const { width, height } = await getImageDimensions(file);
      newFiles.push({ id, file, preview, originalSize: file.size, width, height, format: file.type });
    }
    setFiles(prev => [...prev, ...newFiles]);
    if (files.length === 0 && newFiles.length > 0) {
      setResizeWidth(newFiles[0].width);
      setResizeHeight(newFiles[0].height);
    }
  };

  const handleRemove = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.preview);
      return prev.filter(f => f.id !== id);
    });
    setProcessedImages(prev => prev.filter(p => p.id !== id));
  };

  const handleClear = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setProcessedImages([]);
    setProgress(0);
    setProcessedCount(0);
    setIsProcessing(false);
  };

  const processImages = async () => {
    setIsProcessing(true);
    setProcessedImages([]);
    setProgress(0);
    setProcessedCount(0);

    files.forEach(file => {
      setProcessedImages(prev => [...prev, {
        id: file.id,
        originalBlob: file.file,
        processedBlob: new Blob(),
        originalSize: file.originalSize,
        processedSize: 0,
        reductionPercent: 0,
        format: `image/${format}`,
        status: 'processing',
        name: file.file.name
      }]);

      workerRef.current?.postMessage({
        type: 'process',
        imageId: file.id,
        file: file.file,
        options: {
          resize: { width: resizeWidth, height: resizeHeight },
          quality,
          format,
          ...options
        }
      });
    });
  };

  const handleImageComplete = (id: string, blob: Blob) => {
    setProcessedImages(prev => prev.map(img => {
      if (img.id === id) {
        return {
          ...img,
          processedBlob: blob,
          processedSize: blob.size,
          reductionPercent: ((img.originalSize - blob.size) / img.originalSize) * 100,
          status: 'complete'
        };
      }
      return img;
    }));

    setProcessedCount(prev => {
      const newCount = prev + 1;
      setProgress((newCount / files.length) * 100);
      if (newCount === files.length) setIsProcessing(false);
      return newCount;
    });
  };

  const handleImageError = (id: string, error?: string) => {
    setProcessedImages(prev => prev.map(img => img.id === id ? { ...img, status: 'error', error } : img));
    setProcessedCount(prev => {
      const newCount = prev + 1;
      if (newCount === files.length) setIsProcessing(false);
      return newCount;
    });
  };

  return (
    <main className="min-h-screen p-6 md:p-12 pb-48">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                <ImageIcon className="text-white" size={24} />
              </div>
              ImageOptimo
            </h1>
            <p className="text-slate-500 font-medium max-w-lg">
              Compress, resize, and convert images locally.
            </p>
          </div>
          <PrivacyBanner />
        </div>

        {/* Upload Section */}
        <div className="space-y-6">
          <ImageUploader
            onUpload={handleUpload}
            isProcessing={isProcessing}
            className="shadow-xl shadow-slate-200/50"
          />

          {files.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  queue
                  <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs text-slate-600">{files.length}</span>
                </h3>
                <button onClick={handleClear} className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
                  Clear Queue
                </button>
              </div>
              <ImagePreview
                files={files}
                onRemove={handleRemove}
                processedImages={processedImages}
                isProcessing={isProcessing}
              />
            </div>
          )}
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          <ResizeControls
            width={resizeWidth}
            height={resizeHeight}
            onChange={(w, h) => { setResizeWidth(w); setResizeHeight(h); }}
            originalWidth={files[0]?.width || 1024}
            originalHeight={files[0]?.height || 1024}
            disabled={isProcessing}
          />

          <OptimizationControls
            quality={quality}
            setQuality={setQuality}
            format={format}
            setFormat={setFormat}
            options={options}
            setOptions={setOptions}
            disabled={isProcessing}
          />
        </div>

        {/* Results Area */}
        {processedImages.some(p => p.status === 'complete') && (
          <div className="animate-in zoom-in-95 duration-300">
            <DownloadManager
              results={processedImages}
              onClear={handleClear}
            />
          </div>
        )}

      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={processImages}
          disabled={files.length === 0 || isProcessing}
          className={
            "group relative bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-full shadow-2xl shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 font-bold tracking-wide overflow-hidden"
          }
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-20 group-hover:opacity-40 transition-opacity" />

          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Optimization in progress...</span>
            </>
          ) : (
            <>
              <Zap size={20} className="fill-current text-yellow-400 group-hover:scale-110 transition-transform" />
              <span>Start Optimization</span>
              {files.length > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                  {files.length}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      <ProcessingProgress
        status={isProcessing ? 'processing' : 'idle'}
        progress={progress}
        totalImages={files.length}
        processedCount={processedCount}
        results={processedImages}
      />
    </main>
  );
}
