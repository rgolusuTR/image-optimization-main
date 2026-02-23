import { compressImage } from '../lib/compression';
import { WorkerMessage } from '../types/image.types';

const ctx: Worker = self as any;

ctx.onmessage = async (event: MessageEvent) => {
    const { type, imageId, file, options } = event.data;

    if (type === 'process') {
        try {
            ctx.postMessage({ type: 'progress', imageId, data: { progress: 10 } });

            // 1. Resize & Compress
            // The compressImage function in lib/compression handles both resizing (if options.resize is present)
            // and compression using Pica (Lanczos3) and smart quality logic.
            // options matches OptimizationOptions interface correctly.

            const resultBlob = await compressImage(file, options);

            ctx.postMessage({ type: 'progress', imageId, data: { progress: 100 } });

            ctx.postMessage({
                type: 'complete',
                imageId,
                data: { blob: resultBlob }
            });

        } catch (error) {
            console.error('Worker processing error:', error);
            ctx.postMessage({
                type: 'error',
                imageId,
                data: { error: error instanceof Error ? error.message : 'Unknown error' }
            });
        }
    }
};
