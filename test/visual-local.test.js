// test/visual-local.test.js
import { expect } from 'chai';
import fs from 'fs/promises';
import path from 'path';
import { slice } from '../src/index.js';
import sharp from 'sharp';

describe('Visual Local File Segment Tests', () => {
  const TEST_IMAGE_PATH = path.join('test', 'fixtures', 'test-image.jpg');

  const options = {
    logLevel: 'NONE',
    enhance: {
      sharpen: true,
      zoom: 1.2
    }
  };

  const gridSizes = [2, 3, 4, 5];

  for (const gridSize of gridSizes) {
    it(`should create visible ${gridSize}x${gridSize} segments from local file`, async () => {
      const outputDir = path.join('./test/output/segments/local', `${gridSize}x${gridSize}`);
      await fs.mkdir(outputDir, { recursive: true });
      
      const { segments } = await slice(TEST_IMAGE_PATH, { ...options, gridSize });

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