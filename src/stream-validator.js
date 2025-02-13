// src/stream-validator.js

import { Readable } from 'stream';
import sharp from 'sharp';
import { LogLevel, log } from './logger.js';

export const validateImageStream = async (stream, options = {}) => {
  if (!stream) {
    log(LogLevel.ERROR, 'Stream is required', null, options);
    throw new Error('Stream is required');
  }

  if (!(stream instanceof Readable)) {
    log(LogLevel.ERROR, 'Invalid stream type', null, options);
    throw new Error('Invalid stream type');
  }

  try {
    // Collect stream chunks into a buffer
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Validate image data using sharp
    await sharp(buffer).metadata();
    
    return buffer;
  } catch (error) {
    log(LogLevel.ERROR, error.message, error, options);
    // Map any sharp image validation error to our standard message
    if (error.message.includes('Input buffer contains unsupported image format') ||
        error.message === 'Input Buffer is empty') {
      throw new Error('Invalid image data');
    }
    throw error;
  }
};