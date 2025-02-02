// test/url-validator.test.js
import { expect } from 'chai';
import { validateImageUrl } from '../src/url-validator.js';
import { LogLevel } from '../src/logger.js';

describe('URL Validator', () => {
  let consoleOutputs;
  let mockConsole;
  let originalConsole;

  beforeEach(() => {
    consoleOutputs = [];
    mockConsole = {
      error: (...args) => consoleOutputs.push({ level: 'error', message: args }),
    };
    originalConsole = { ...console };
    Object.assign(console, mockConsole);
  });

  afterEach(() => {
    Object.assign(console, originalConsole);
  });

  it('should throw error if URL is not provided', () => {
    try {
      validateImageUrl(null, { logLevel: LogLevel.ERROR });
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).to.equal('Image URL is required');
      expect(consoleOutputs).to.have.lengthOf(1);
      expect(consoleOutputs[0].level).to.equal('error');
    }
  });

  it('should throw error if URL is invalid', () => {
    try {
      validateImageUrl('not-a-url', { logLevel: LogLevel.ERROR });
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).to.equal('Invalid URL format');
      expect(consoleOutputs).to.have.lengthOf(1);
      expect(consoleOutputs[0].level).to.equal('error');
    }
  });

  it('should return true for valid image URLs', () => {
    const result = validateImageUrl('https://example.com/image.jpg');
    expect(result).to.be.true;
  });

  it('should not log when logLevel is NONE', () => {
    try {
      validateImageUrl(null, { logLevel: LogLevel.NONE });
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).to.equal('Image URL is required');
      expect(consoleOutputs).to.have.lengthOf(0);
    }
  });
});