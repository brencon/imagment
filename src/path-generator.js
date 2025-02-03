// src/path-generator.js
import { LogLevel, log } from './logger.js';

const MAX_PATH_LENGTH = 255;
const ALLOWED_PROTOCOLS = ['https:'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

export const generateOutputPath = (url, options = { logLevel: LogLevel.NONE }) => {
  if (!url) throw new Error('URL is required');

  const urlObj = new URL(url);
  
  if (!ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
    throw new Error('Only HTTPS URLs are allowed');
  }

  const { hostname, pathname } = urlObj;
  const decodedPath = decodeURIComponent(pathname);
  log(LogLevel.DEBUG, 'Decoded path:', decodedPath, options);

  const match = decodedPath.match(/\.([^/.]+)$/);
  if (!match) {
    throw new Error('File extension is required');
  }

  const ext = `.${match[1].toLowerCase()}`;
  log(LogLevel.DEBUG, 'Extracted extension:', ext, options);
  
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error('Only JPG and PNG files are supported');
  }

  const pathWithoutExt = decodedPath.slice(1, -ext.length);
  const sanitizedPath = pathWithoutExt.replace(/[<>:"/\\|?*]/g, '_');
  
  const outputPath = `${hostname}_${sanitizedPath}`;
  
  if (outputPath.length > MAX_PATH_LENGTH) {
    throw new Error(`Generated path exceeds maximum length of ${MAX_PATH_LENGTH} characters`);
  }

  return outputPath;
};