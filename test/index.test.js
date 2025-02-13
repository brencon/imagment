// ./test/index.test.js

import { strict as assert } from 'assert';
import { expect } from 'chai';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { slice } from '../src/index.js';

describe('Image Slicing', () => {
  const TEST_IMAGE_URL = 'https://s3.amazonaws.com/comicgeeks/comics/covers/large-8388327.jpg?1732638927';
  const TEST_IMAGE_PATH = path.join('test', 'fixtures', 'test-image.jpg');
  const TEST_IMAGE_STREAM = path.join('test', 'fixtures', 'test-image-stream.jpg');
  const TEST_INVALID_PATH = path.join('test', 'fixtures', 'non-existent.jpg');
  const TEST_INVALID_TYPE = path.join('test', 'fixtures', 'test.txt');

  before(async () => {
    await fs.mkdir(path.join('test', 'fixtures'), { recursive: true });
    await fs.writeFile(TEST_INVALID_TYPE, 'Not an image file');
  });

  after(async () => {
    try {
      await fs.unlink(TEST_INVALID_TYPE);
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Stream Input', () => {
    it('should reject invalid stream data', async () => {
      const invalidStream = new Readable();
      invalidStream.push('not an image');
      invalidStream.push(null);

      let thrownError = null;
      try {
        await slice(invalidStream);
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError).to.not.be.null;
      expect(thrownError.message).to.equal('Invalid image data');
    });

    describe('Grid Sizes', () => {
      it('should segment into default 3x3 grid', async () => {
        const imageStream = createReadStream(TEST_IMAGE_STREAM);
        const result = await slice(imageStream);
        expect(result.segments).to.have.lengthOf(9);
        expect(result.metadata.gridSize).to.equal(3);
      });

      it('should segment into 2x2 grid', async () => {
        const imageStream = createReadStream(TEST_IMAGE_STREAM);
        const result = await slice(imageStream, { gridSize: 2 });
        expect(result.segments).to.have.lengthOf(4);
        expect(result.metadata.gridSize).to.equal(2);
      });

      it('should segment into 4x4 grid', async () => {
        const imageStream = createReadStream(TEST_IMAGE_STREAM);
        const result = await slice(imageStream, { gridSize: 4 });
        expect(result.segments).to.have.lengthOf(16);
        expect(result.metadata.gridSize).to.equal(4);
      });

      it('should maintain enhancement options', async () => {
        const imageStream = createReadStream(TEST_IMAGE_STREAM);
        const result = await slice(imageStream, {
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
        const imageStream = createReadStream(TEST_IMAGE_STREAM);
        const result = await slice(imageStream, {
          enhance: {
            zoom: -0.5
          }
        });
        expect(result.segments).to.have.lengthOf(9);
        expect(result.metadata.enhancement.zoom).to.equal(1);
      });
    });
  });

  describe('Local File Input', () => {
    it('should reject non-existent files', async () => {
      let thrownError = null;
      try {
        await slice(TEST_INVALID_PATH);
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError).to.not.be.null;
      expect(thrownError.message).to.equal('File not found');
    });

    it('should reject invalid file types', async () => {
      let thrownError = null;
      try {
        await slice(TEST_INVALID_TYPE);
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError).to.not.be.null;
      expect(thrownError.message).to.equal('Invalid file type');
    });

    describe('Grid Sizes', () => {
      it('should segment into default 3x3 grid', async () => {
        const result = await slice(TEST_IMAGE_PATH);
        expect(result.segments).to.have.lengthOf(9);
        expect(result.metadata.gridSize).to.equal(3);
      });

      it('should segment into 2x2 grid', async () => {
        const result = await slice(TEST_IMAGE_PATH, { gridSize: 2 });
        expect(result.segments).to.have.lengthOf(4);
        expect(result.metadata.gridSize).to.equal(2);
      });

      it('should segment into 4x4 grid', async () => {
        const result = await slice(TEST_IMAGE_PATH, { gridSize: 4 });
        expect(result.segments).to.have.lengthOf(16);
        expect(result.metadata.gridSize).to.equal(4);
      });

      it('should maintain enhancement options', async () => {
        const result = await slice(TEST_IMAGE_PATH, {
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
        const result = await slice(TEST_IMAGE_PATH, {
          enhance: {
            zoom: -0.5
          }
        });
        expect(result.segments).to.have.lengthOf(9);
        expect(result.metadata.enhancement.zoom).to.equal(1);
      });
    });
  });

  describe('URL Input', () => {
    describe('Grid Sizes', () => {
      it('should segment into default 3x3 grid', async () => {
        const result = await slice(TEST_IMAGE_URL);
        expect(result.segments).to.have.lengthOf(9);
        expect(result.metadata.gridSize).to.equal(3);
      });

      it('should segment into 2x2 grid', async () => {
        const result = await slice(TEST_IMAGE_URL, { gridSize: 2 });
        expect(result.segments).to.have.lengthOf(4);
        expect(result.metadata.gridSize).to.equal(2);
      });

      it('should segment into 4x4 grid', async () => {
        const result = await slice(TEST_IMAGE_URL, { gridSize: 4 });
        expect(result.segments).to.have.lengthOf(16);
        expect(result.metadata.gridSize).to.equal(4);
      });

      it('should maintain enhancement options', async () => {
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
        expect(result.segments).to.have.lengthOf(9);
        expect(result.metadata.enhancement.zoom).to.equal(1);
      });
    });
  });

  describe('Invalid Grid Sizes', () => {
    const inputs = [
      { type: 'URL', path: TEST_IMAGE_URL },
      { type: 'Local File', path: TEST_IMAGE_PATH },
      { type: 'Stream', getInput: () => createReadStream(TEST_IMAGE_STREAM) }
    ];

    inputs.forEach(({ type, path, getInput }) => {
      describe(type, () => {
        it('should reject grid size 0', async () => {
          let thrownError = null;
          try {
            const input = getInput ? getInput() : path;
            await slice(input, { gridSize: 0 });
          } catch (error) {
            thrownError = error;
          }
          expect(thrownError).to.not.be.null;
          expect(thrownError.message).to.equal('Grid size must be at least 2');
        });

        it('should reject grid size 11', async () => {
          let thrownError = null;
          try {
            const input = getInput ? getInput() : path;
            await slice(input, { gridSize: 11 });
          } catch (error) {
            thrownError = error;
          }
          expect(thrownError).to.not.be.null;
          expect(thrownError.message).to.equal('Grid size must not exceed 10');
        });

        it('should reject grid size -1', async () => {
          let thrownError = null;
          try {
            const input = getInput ? getInput() : path;
            await slice(input, { gridSize: -1 });
          } catch (error) {
            thrownError = error;
          }
          expect(thrownError).to.not.be.null;
          expect(thrownError.message).to.equal('Grid size must be at least 2');
        });

        it('should reject grid size 2.5', async () => {
          let thrownError = null;
          try {
            const input = getInput ? getInput() : path;
            await slice(input, { gridSize: 2.5 });
          } catch (error) {
            thrownError = error;
          }
          expect(thrownError).to.not.be.null;
          expect(thrownError.message).to.equal('Grid size must be an integer');
        });
      });
    });
  });
});