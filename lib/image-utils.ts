

export async function createImageBitmapFromBlob(blob: Blob): Promise<ImageBitmap> {
    return createImageBitmap(blob);
}

export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(img.src);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

export async function resizeImage(
    file: File,
    width: number,
    height: number,
    format: string = 'image/jpeg',
    quality: number = 0.85
): Promise<Blob> {
    // Create an offscreen canvas or regular canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas context not available');

    const img = await createImageBitmap(file);

    canvas.width = width;
    canvas.height = height;

    // Use high quality interpolation
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, width, height);

    // Convert to blob
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Canvas to Blob failed'));
            },
            format,
            quality
        );
    });
}

export function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const PRESETS = {
    'instagram-post': { width: 1080, height: 1080 },
    'instagram-story': { width: 1080, height: 1920 },
    'facebook-cover': { width: 820, height: 312 },
    'twitter-header': { width: 1500, height: 500 },
    'web-thumbnail': { width: 400, height: 300 },
    'hd': { width: 1920, height: 1080 },
    'hero': { width: 2778, height: 1100 },
    'billboard': { width: 1100, height: 700 },
};
