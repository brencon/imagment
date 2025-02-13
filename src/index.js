// src/index.js

import sharp from 'sharp';
import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import { Readable } from 'stream';
import { validateImageUrl } from './url-validator.js';
import { validateImageStream } from './stream-validator.js';
import { validateGridSize } from './validators/grid-size.js';
import { LogLevel, log } from './logger.js';

const validateLocalFile = async (filePath, options = {}) => {
  log(LogLevel.DEBUG, 'Validating local file...', null, options);
  try {
    await fs.access(filePath);
  } catch (error) {
    log(LogLevel.ERROR, `File not found: ${filePath}`, error, options);
    throw new Error('File not found');
  }

  const extension = filePath.toLowerCase().split('.').pop();
  if (!['jpg', 'jpeg', 'png'].includes(extension)) {
    log(LogLevel.ERROR, `Invalid file type: ${extension}`, null, options);
    throw new Error('Invalid file type');
  }
};

const processImage = async (imageBuffer, options = {}) => {
  log(LogLevel.DEBUG, 'Processing image buffer...', null, options);

  // Validate gridSize first if provided
  if (typeof options.gridSize !== 'undefined') {
    log(LogLevel.DEBUG, `Validating provided grid size: ${options.gridSize}`, null, options);
    validateGridSize(options.gridSize);
  }

  // Then set default if needed
  const gridSize = options.gridSize || 3;
  log(LogLevel.INFO, `Using ${gridSize}x${gridSize} grid`, null, options);

  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  log(LogLevel.VERBOSE, 'Image metadata:', metadata, options);

  log(LogLevel.DEBUG, 'Calculating segment dimensions', null, options);
  const segmentWidth = Math.floor(metadata.width / gridSize);
  const segmentHeight = Math.floor(metadata.height / gridSize);
  
  const segments = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
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

  metadata.gridSize = gridSize;
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

export const slice = async (input, options = {}) => {
  let imageBuffer;

  if (input instanceof Readable) {
    log(LogLevel.INFO, 'Processing stream input', null, options);
    imageBuffer = await validateImageStream(input, options);
    log(LogLevel.VERBOSE, 'Image buffer size:', imageBuffer.length, options);
  } else if (input.startsWith('http')) {
    validateImageUrl(input, options);
    log(LogLevel.INFO, 'Processing URL:', input, options);

    log(LogLevel.DEBUG, 'Loading image from URL...', null, options);
    const response = await fetch(input);
    const arrayBuffer = await response.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuffer);
    log(LogLevel.VERBOSE, 'Image buffer size:', imageBuffer.length, options);
  } else {
    await validateLocalFile(input, options);
    log(LogLevel.INFO, 'Processing local file:', input, options);

    log(LogLevel.DEBUG, 'Loading local file...', null, options);
    imageBuffer = await fs.readFile(input);
    log(LogLevel.VERBOSE, 'Image buffer size:', imageBuffer.length, options);
  }

  return processImage(imageBuffer, options);
};