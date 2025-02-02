// src/logger.js
export const LogLevel = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  VERBOSE: 5
};

export const log = (level, message, data, options) => {
  if (!options?.logLevel || level > options.logLevel) return;
  
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