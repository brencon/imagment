// src/index.js

import sharp from 'sharp';
import fetch from 'node-fetch';

export const LogLevel = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5
};

const log = (level, message, data, options) => {
  if (!options?.logLevel || level > options.logLevel) return;
  
  // Log level check was backwards - fix the condition
  if (options.logLevel >= level) {
    switch (level) {
      case LogLevel.ERROR:
        console.error(message, data || '');
        break;
      case LogLevel.WARN:
        console.warn(message, data || '');
        break;
      case LogLevel.INFO:
        console.log(message, data || '');
        break;
      case LogLevel.DEBUG:
      case LogLevel.VERBOSE:
        console.debug(message, data || '');
        break;
    }
  }
};

// Rest of slice implementation remains the same
export const slice = async (imageUrl, options = {}) => {
  if (!imageUrl) {
    log(LogLevel.ERROR, 'Image URL is required', null, options);
    throw new Error('Image URL is required');
  }

  log(LogLevel.INFO, 'Processing URL:', imageUrl, options);

  try {
    new URL(imageUrl);
  } catch {
    log(LogLevel.ERROR, 'Invalid URL format', null, options);
    throw new Error('Invalid URL format');
  }

  log(LogLevel.DEBUG, 'Loading image...', null, options);
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);
  log(LogLevel.VERBOSE, 'Image buffer size:', imageBuffer.length, options);

  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  log(LogLevel.VERBOSE, 'Image metadata:', metadata, options);

  log(LogLevel.DEBUG, 'Calculating segment dimensions', null, options);
  const segmentWidth = Math.floor(metadata.width / 3);
  const segmentHeight = Math.floor(metadata.height / 3);
  
  const segments = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const extractArea = {
        left: col * segmentWidth,
        top: row * segmentHeight,
        width: segmentWidth,
        height: segmentHeight
      };
      log(LogLevel.VERBOSE, `Extracting segment [${row},${col}]:`, extractArea, options);
      const cloneImage = sharp(imageBuffer).clone();
      let segment = cloneImage.extract(extractArea);
      
      if (options.enhance?.sharpen) {
        segment = segment.sharpen();
      }

      if (options.enhance?.zoom) {
        if (options.enhance.zoom <= 0) {
          log(LogLevel.WARN, 'Invalid zoom value, must be greater than 0. Using default value of 1.', null, options);
          options.enhance.zoom = 1;
        }
        const newWidth = Math.round(segmentWidth * options.enhance.zoom);
        const newHeight = Math.round(segmentHeight * options.enhance.zoom);
        segment = segment.resize(newWidth, newHeight);
      }
      
      segments.push(await segment.toBuffer());
    }
  }

  metadata.enhancement = {
    sharpen: options.enhance?.sharpen || false,
    zoom: options.enhance?.zoom || 1
  };

  metadata.segmentDimensions = {
    width: options.enhance?.zoom ? Math.round(segmentWidth * options.enhance.zoom) : segmentWidth,
    height: options.enhance?.zoom ? Math.round(segmentHeight * options.enhance.zoom) : segmentHeight
  };

  return {
    original: imageBuffer,
    metadata,
    segments
  };
};