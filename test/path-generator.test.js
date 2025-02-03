// test/path-generator.test.js
import { expect } from 'chai';
import { generateOutputPath } from '../src/path-generator.js';

describe('path-generator', () => {
  it('should generate correct path from url with multiple segments', () => {
    const url = 'https://media.mycomicshop.com/n_ii/originalimage/7794643.jpg';
    const result = generateOutputPath(url);
    expect(result).to.equal('media.mycomicshop.com-n_ii-originalimage-7794643');
  });

  it('should handle url with single segment', () => {
    const url = 'https://example.com/image.jpg';
    const result = generateOutputPath(url);
    expect(result).to.equal('example.com-image');
  });

  it('should handle url with no file extension', () => {
    const url = 'https://example.com/image';
    const result = generateOutputPath(url);
    expect(result).to.equal('example.com-image');
  });

  it('should handle url with query parameters', () => {
    const url = 'https://example.com/image.jpg?width=100';
    const result = generateOutputPath(url);
    expect(result).to.equal('example.com-image');
  });
});