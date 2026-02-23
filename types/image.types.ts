export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  originalSize: number;
  width: number;
  height: number;
  format: string;
}

export type PresetType = 'none' | 'instagram-post' | 'instagram-story' | 'facebook-cover' | 'twitter-header' | 'web-thumbnail' | 'hd' | 'hero' | 'billboard';

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  preset?: PresetType;
}

export interface OptimizationOptions {
  quality: number; // 0-100
  format: 'jpeg' | 'png' | 'webp' | 'avif';
  removeEXIF: boolean;
  smartCompression: boolean;
}

export interface ProcessedImage {
  id: string;
  originalBlob: Blob;
  processedBlob: Blob;
  originalSize: number;
  processedSize: number;
  reductionPercent: number;
  format: string;
  status: 'queued' | 'processing' | 'complete' | 'error';
  error?: string;
  name: string;
}

export interface WorkerMessage {
  type: 'process' | 'progress' | 'complete' | 'error';
  imageId: string;
  data?: {
    blob?: Blob;
    progress?: number;
    error?: string;
  };
}
