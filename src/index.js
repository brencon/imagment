// src/index.js

import sharp from 'sharp';
import fetch from 'node-fetch';
import { validateImageUrl } from './url-validator.js';
import { LogLevel, log } from './logger.js';

export const slice = async (imageUrl, options = {}) => {
  validateImageUrl(imageUrl, options);
  log(LogLevel.INFO, 'Processing URL:', imageUrl, options);

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