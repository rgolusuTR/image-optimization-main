import JSZip from 'jszip';
import { ProcessedImage } from '@/types/image.types';

export async function createZip(images: ProcessedImage[]): Promise<Blob> {
    const zip = new JSZip();

    images.forEach((img) => {
        // Ensure we have a valid extension
        let extension = img.format.split('/')[1];
        if (extension === 'jpeg') extension = 'jpg';

        // Create filename if it doesn't have one
        const filename = img.name ?
            (img.name.lastIndexOf('.') > -1 ?
                img.name.substring(0, img.name.lastIndexOf('.')) + `_optimized.${extension}` :
                `${img.name}_optimized.${extension}`)
            : `image_${img.id}.${extension}`;

        zip.file(filename, img.processedBlob);
    });

    return await zip.generateAsync({ type: 'blob' });
}
