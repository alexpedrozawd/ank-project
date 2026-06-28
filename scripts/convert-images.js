import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pagesDir = path.join(__dirname, '../public/pages');

async function convertImages() {
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.png'));
  for (const file of files) {
    const pngPath = path.join(pagesDir, file);
    const webpName = file.replace('.png', '.webp');
    const webpPath = path.join(pagesDir, webpName);
    
    console.log(`Converting ${file} to ${webpName}...`);
    await sharp(pngPath).webp({ quality: 85 }).toFile(webpPath);
    
    // delete png
    fs.unlinkSync(pngPath);
  }
  console.log('Conversion complete!');
}

convertImages().catch(console.error);
