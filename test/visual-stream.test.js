// test/visual-stream.test.js
import { expect } from 'chai';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';
import { slice } from '../src/index.js';
import sharp from 'sharp';

describe('Visual Stream Segment Tests', () => {
  const TEST_IMAGE_PATH = path.join('test', 'fixtures', 'test-image-stream.jpg');

  const options = {
    logLevel: 'NONE',
    enhance: {
      sharpen: true,
      zoom: 1.2
    }
  };

  const gridSizes = [2, 3, 4, 5];

  for (const gridSize of gridSizes) {
    it(`should create visible ${gridSize}x${gridSize} segments from stream`, async () => {
      const outputDir = path.join('./test/output/segments/stream', `${gridSize}x${gridSize}`);
      await fs.mkdir(outputDir, { recursive: true });
      
      const imageStream = createReadStream(TEST_IMAGE_PATH);
      const { segments } = await slice(imageStream, { ...options, gridSize });

      for (let index = 0; index < segments.length; index++) {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        await sharp(segments[index])
          .jpeg({ quality: 100 })
          .toFile(path.join(outputDir, `segment_${row}_${col}.jpg`));
      }

      const files = await fs.readdir(outputDir);
      expect(files).to.have.length(gridSize * gridSize);
    });
  }
});