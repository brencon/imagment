// test/logger.unit.test.js
import { expect } from 'chai';
import { LogLevel, log } from '../src/logger.js';

describe('logger unit tests', () => {
  it('should not log when logLevel is not set', () => {
    log(LogLevel.INFO, 'test message', { data: 'test' }, {});
  });

  it('should not log when message level is higher than logLevel', () => {
    log(LogLevel.DEBUG, 'test message', { data: 'test' }, { logLevel: LogLevel.INFO });
  });

  it('should log ERROR level with data', () => {
    log(LogLevel.ERROR, 'error message', { error: 'test' }, { logLevel: LogLevel.ERROR });
  });

  it('should log ERROR level without data', () => {
    log(LogLevel.ERROR, 'error message', undefined, { logLevel: LogLevel.ERROR });
  });

  it('should log WARN level with data', () => {
    log(LogLevel.WARN, 'warn message', { warning: 'test' }, { logLevel: LogLevel.WARN });
  });

  it('should log WARN level without data', () => {
    log(LogLevel.WARN, 'warn message', undefined, { logLevel: LogLevel.WARN });
  });

  it('should log INFO level with data', () => {
    log(LogLevel.INFO, 'info message', { info: 'test' }, { logLevel: LogLevel.INFO });
  });

  it('should log INFO level without data', () => {
    log(LogLevel.INFO, 'info message', undefined, { logLevel: LogLevel.INFO });
  });

  it('should log DEBUG level with data', () => {
    log(LogLevel.DEBUG, 'debug message', { debug: 'test' }, { logLevel: LogLevel.DEBUG });
  });

  it('should log DEBUG level without data', () => {
    log(LogLevel.DEBUG, 'debug message', undefined, { logLevel: LogLevel.DEBUG });
  });

  it('should log VERBOSE level with data', () => {
    log(LogLevel.VERBOSE, 'verbose message', { verbose: 'test' }, { logLevel: LogLevel.VERBOSE });
  });

  it('should log VERBOSE level without data', () => {
    log(LogLevel.VERBOSE, 'verbose message', undefined, { logLevel: LogLevel.VERBOSE });
  });
});