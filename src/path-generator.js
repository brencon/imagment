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

  // First split path into segments
  const pathSegments = decodedPath.slice(1).split('/');
  
  // Then sanitize each segment and join with hyphens
  const processedPath = pathSegments
    .map(segment => segment.replace(/[<>:"/\\|?*]/g, '_'))
    .join('-')
    .replace(/\.[^/.]+$/, '');
  
  const outputPath = `${hostname}-${processedPath}`;
  
  if (outputPath.length > MAX_PATH_LENGTH) {
    throw new Error(`Generated path exceeds maximum length of ${MAX_PATH_LENGTH} characters`);
  }

  return outputPath;
};