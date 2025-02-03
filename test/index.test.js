// test/index.test.js
import { expect } from 'chai';
import { slice } from '../src/index.js';

describe('imagment', () => {
  const imageUrl = 'https://media.mycomicshop.com/n_ii/originalimage/7794643.jpg';

  it('should process real comic cover with zoom and sharpen', async () => {
    const options = {
      enhance: { sharpen: true, zoom: 1.2 }
    };
    const result = await slice(imageUrl, options);
    expect(result.segments).to.have.lengthOf(9);
    expect(result.metadata.enhancement.sharpen).to.be.true;
    expect(result.metadata.enhancement.zoom).to.equal(1.2);
  });

  it('should process image with enhance object but no options', async () => {
    const options = { enhance: {} };
    const result = await slice(imageUrl, options);
    expect(result.segments).to.have.lengthOf(9);
    expect(result.metadata.enhancement.sharpen).to.be.false;
    expect(result.metadata.enhancement.zoom).to.equal(1);
  });

  it('should process image with invalid zoom value', async () => {
    const options = { enhance: { zoom: -1 } };
    const result = await slice(imageUrl, options);
    expect(result.segments).to.have.lengthOf(9);
    expect(result.metadata.enhancement.zoom).to.equal(1);
  });

  describe('input validation', () => {
    it('should throw error if image url is not provided', async () => {
      try {
        await slice();
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('URL is required');
      }
    });

    it('should throw error if url is invalid', async () => {
      try {
        await slice('not-a-url');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Invalid URL');
      }
    });
  });
});