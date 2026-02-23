import { OptimizationOptions } from '@/types/image.types';

let picaInstance: any;
let UPNG: any;

interface CompressionConfig extends OptimizationOptions {
    resize?: { width: number; height: number };
    maxWidthOrHeight?: number;
}

function getSmartQuality(width: number, height: number, format: string, baseQuality: number): number {
    const megapixels = (width * height) / 1000000;
    let smartQuality = baseQuality;

    if (megapixels >= 8) {
        smartQuality = Math.min(baseQuality, 60);
    } else if (megapixels >= 4) {
        smartQuality = Math.min(baseQuality, 70);
    } else if (megapixels >= 2) {
        smartQuality = Math.min(baseQuality, 80);
    } else {
        smartQuality = baseQuality;
    }

    if (format.includes('webp') || format.includes('avif')) {
        smartQuality = Math.max(smartQuality - 5, 50);
    }

    return smartQuality / 100;
}

export async function compressImage(file: File, options: CompressionConfig): Promise<Blob> {
    try {
        // Safe Pica Import
        if (!picaInstance) {
            try {
                const picaModule = await import('pica');
                const picaConstructor = (picaModule as any).default || picaModule;
                picaInstance = new picaConstructor();
            } catch (err) {
                console.warn('Pica failed load', err);
            }
        }

        // Safe UPNG Import
        if (!UPNG) {
            try {
                const upngModule = await import('upng-js');
                UPNG = (upngModule as any).default || upngModule;
            } catch (err) {
                console.warn('UPNG failed to load', err);
            }
        }

        const bitmap = await createImageBitmap(file);

        let targetWidth = bitmap.width;
        let targetHeight = bitmap.height;

        if (options.resize) {
            targetWidth = options.resize.width;
            targetHeight = options.resize.height;
        }

        // @ts-ignore
        const canvas = new OffscreenCanvas(targetWidth, targetHeight);

        // Formatting
        const formatMap: Record<string, string> = {
            'jpeg': 'image/jpeg',
            'jpg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp',
            'avif': 'image/avif'
        };
        const mimeType = formatMap[options.format] || file.type;
        const isPNG = mimeType === 'image/png';

        // Quality normalization
        let quality = options.quality ? options.quality : 85;
        if (options.smartCompression) {
            quality = getSmartQuality(targetWidth, targetHeight, mimeType, quality) * 100;
        }
        const finalQuality = quality > 1 ? quality / 100 : quality;


        // Try Pica Resize
        if (picaInstance) {
            try {
                await picaInstance.resize(bitmap, canvas, {
                    unsharpAmount: 80,
                    unsharpRadius: 0.6,
                    unsharpThreshold: 2
                });

                // TINYPNG SIMULATION (Quantization) for PNGs
                if (isPNG && UPNG) {
                    try {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            // Get raw RGBA data
                            const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
                            // Quantize to 256 colors (8-bit) - tinyPNG style
                            // UPNG.encode(buffer, w, h, cnum)
                            const pngBuffer = UPNG.encode(imageData.data.buffer, targetWidth, targetHeight, 256);
                            bitmap.close();
                            return new Blob([pngBuffer], { type: 'image/png' });
                        }
                    } catch (e) {
                        console.warn('UPNG Encoding failed, falling back to Pica/Canvas', e);
                    }
                }

                const blob = await picaInstance.toBlob(canvas, mimeType, finalQuality);

                bitmap.close();
                return blob;
            } catch (picaError) {
                console.warn('Pica resize/toBlob failed:', picaError);
                // Fallthrough to standard canvas
            }
        }

        console.log('Using Standard Canvas Fallback');
        // FALLBACK: Standard Canvas API
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

        // Convert to blob
        const blob = await canvas.convertToBlob({ type: mimeType, quality: finalQuality });

        bitmap.close();
        return blob;

    } catch (error) {
        console.error('Compression failed:', error);
        throw error;
    }
}
