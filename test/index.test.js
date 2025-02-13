// ./test/index.test.js

import { strict as assert } from 'assert';
import { expect } from 'chai';
import fs from 'fs/promises';
import path from 'path';
import { slice } from '../src/index.js';

describe('Image Slicing with Flexible Grid Size', () => {
  const TEST_IMAGE_URL = 'https://s3.amazonaws.com/comicgeeks/comics/covers/large-8388327.jpg?1732638927';
  
  it('should segment image into default 3x3 grid when no gridSize specified', async () => {
    const result = await slice(TEST_IMAGE_URL);
    expect(result.segments).to.have.lengthOf(9);
    expect(result.metadata.gridSize).to.equal(3);
  });

  it('should segment image into 2x2 grid', async () => {
    const result = await slice(TEST_IMAGE_URL, { gridSize: 2 });
    expect(result.segments).to.have.lengthOf(4);
    expect(result.metadata.gridSize).to.equal(2);
  });

  it('should segment image into 4x4 grid', async () => {
    const result = await slice(TEST_IMAGE_URL, { gridSize: 4 });
    expect(result.segments).to.have.lengthOf(16);
    expect(result.metadata.gridSize).to.equal(4);
  });

  it('should maintain enhancement options with custom grid size', async () => {
    const result = await slice(TEST_IMAGE_URL, {
      gridSize: 2,
      enhance: {
        sharpen: true,
        zoom: 1.5
      }
    });
    expect(result.segments).to.have.lengthOf(4);
    expect(result.metadata.enhancement.sharpen).to.be.true;
    expect(result.metadata.enhancement.zoom).to.equal(1.5);
  });

  it('should reset negative zoom values to 1', async () => {
    const result = await slice(TEST_IMAGE_URL, {
      enhance: {
        zoom: -0.5
      }
    });
    expect(result.segments).to.have.lengthOf(9); // Default 3x3 grid
    expect(result.metadata.enhancement.zoom).to.equal(1);
  });

  describe('invalid grid sizes', () => {
    it('should reject grid size 0', async () => {
      let thrownError = null;
      try {
        await slice(TEST_IMAGE_URL, { gridSize: 0 });
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError).to.not.be.null;
      expect(thrownError.message).to.equal('Grid size must be at least 2');
    });

    it('should reject grid size 11', async () => {
      let thrownError = null;
      try {
        await slice(TEST_IMAGE_URL, { gridSize: 11 });
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError).to.not.be.null;
      expect(thrownError.message).to.equal('Grid size must not exceed 10');
    });

    it('should reject grid size -1', async () => {
      let thrownError = null;
      try {
        await slice(TEST_IMAGE_URL, { gridSize: -1 });
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError).to.not.be.null;
      expect(thrownError.message).to.equal('Grid size must be at least 2');
    });

    it('should reject grid size 2.5', async () => {
      let thrownError = null;
      try {
        await slice(TEST_IMAGE_URL, { gridSize: 2.5 });
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError).to.not.be.null;
      expect(thrownError.message).to.equal('Grid size must be an integer');
    });
  });
});