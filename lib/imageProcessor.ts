
import sharp from 'sharp';

export async function enhanceProductImage(fileBuffer: Buffer): Promise<Buffer> {
    const image = sharp(fileBuffer);

    const TARGET_SIZE = 1000;

    const processedBuffer = await image
        .rotate() 
        .resize({
            width: TARGET_SIZE, 
            height: TARGET_SIZE,
            fit: 'contain',
            background: { r: 251, g: 251, b: 251, alpha: 1 } 
        })
        .flatten({ background: { r: 251, g: 251, b: 251 } }) 
        .toFormat('jpeg', { quality: 90, mozjpeg: true }) 
        .toBuffer();

    return processedBuffer;
}
