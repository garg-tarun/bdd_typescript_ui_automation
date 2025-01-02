import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import logger from '../logger/Logger';
export async function getImageResolution(filePath: string) {
    const metadata = await sharp(filePath).metadata();
    return {
        width: metadata.width,
        height: metadata.height,
    };
}

export function deleteImage(imagePath: string) {
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        logger.info('File deleted successfully:', imagePath);
    }
}

export function createDirectory(directoryName:string) {
    logger.info(`Creating directory with name: ${directoryName}`);
    const dirPath: string = path.join(process.cwd(), directoryName);
    // Make sure the 'downloads' folder exists, create it if necessary
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    logger.info(`Directory created with path: ${dirPath}`);
    return dirPath;
}