// src/url-validator.js

import { LogLevel, log } from './logger.js';

export const validateImageUrl = (url, options = {}) => {
  if (!url) {
    const error = new Error('Image URL is required');
    log(LogLevel.ERROR, error.message, null, options);
    throw error;
  }

  try {
    new URL(url);
  } catch {
    const error = new Error('Invalid URL format');
    log(LogLevel.ERROR, error.message, null, options);
    throw error;
  }

  return true;
};