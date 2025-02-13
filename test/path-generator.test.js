// test/path-generator.test.js
import { expect } from 'chai';
import { generateOutputPath } from '../src/path-generator.js';
import { LogLevel } from '../src/logger.js';

describe('path-generator', () => {
  const options = { logLevel: LogLevel.DEBUG };

  it('should generate correct path from url with multiple segments', () => {
    const url = 'https://media.mycomicshop.com/n_ii/originalimage/7794643.jpg';
    const result = generateOutputPath(url, options);
    expect(result).to.equal('media.mycomicshop.com-n_ii-originalimage-7794643');
  });

  it('should handle url with single segment', () => {
    const url = 'https://example.com/image.jpg';
    const result = generateOutputPath(url, options);
    expect(result).to.equal('example.com-image');
  });

  it('should handle url with query parameters', () => {
    const url = 'https://example.com/image.jpg?width=100';
    const result = generateOutputPath(url, options);
    expect(result).to.equal('example.com-image');
  });

  it('should throw error for non-HTTPS url', () => {
    const url = 'http://example.com/image.jpg';
    expect(() => generateOutputPath(url, options)).to.throw('Only HTTPS URLs are allowed');
  });

  it('should throw error for unsupported file type', () => {
    const url = 'https://example.com/image.gif';
    expect(() => generateOutputPath(url, options)).to.throw('Only JPG and PNG files are supported');
  });

  it('should throw error for null url', () => {
    expect(() => generateOutputPath(null, options)).to.throw('URL is required');
  });

  it('should throw error for empty url', () => {
    expect(() => generateOutputPath('', options)).to.throw('URL is required');
  });

  it('should sanitize unsafe characters in path', () => {
    const url = 'https://example.com/test_image_name%3C%3E%3A%22%7C%3F%2A.jpg';
    const result = generateOutputPath(url, options);
    expect(result).to.equal('example.com-test_image_name_______');
  });

  it('should throw error for extremely long paths', () => {
    const longPath = 'a'.repeat(300);
    const url = `https://example.com/${longPath}.jpg`;
    expect(() => generateOutputPath(url, options)).to.throw('Generated path exceeds maximum length');
  });

  it('should handle PNG extension', () => {
    const url = 'https://example.com/image.png';
    const result = generateOutputPath(url, options);
    expect(result).to.equal('example.com-image');
  });

  it('should throw error for missing file extension', () => {
    const url = 'https://example.com/noextension';
    expect(() => generateOutputPath(url, options)).to.throw('File extension is required');
  });
});