// test/url-validator.test.js
import { expect } from 'chai';
import { validateImageUrl } from '../src/url-validator.js';
import { LogLevel } from '../src/logger.js';

describe('URL Validator', () => {
  it('should throw error if URL is not provided', () => {
    expect(() => validateImageUrl()).to.throw('URL is required');
  });

  it('should throw error if URL is invalid', () => {
    expect(() => validateImageUrl('not-a-url')).to.throw('Invalid URL');
  });

  it('should return true for valid image URLs', () => {
    const result = validateImageUrl('https://media.mycomicshop.com/n_ii/originalimage/7794643.jpg');
    expect(result).to.be.true;
  });

  it('should not log when logLevel is NONE', () => {
    const options = { logLevel: LogLevel.NONE };
    expect(() => validateImageUrl('not-a-url', options)).to.throw('Invalid URL');
  });
});