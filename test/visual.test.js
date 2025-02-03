// test/visual.test.js
import { expect } from 'chai';
import fs from 'fs/promises';
import path from 'path';
import { slice } from '../src/index.js';
import sharp from 'sharp';
import { generateOutputPath } from '../src/path-generator.js';

describe('Visual Segment Tests', () => {
  const imageUrl = 'https://media.mycomicshop.com/n_ii/originalimage/7794643.jpg';

  const options = {
    logLevel: 'NONE',
    enhance: {
      sharpen: true,
      zoom: 1.2
    }
  };

  it('should create visible segments', async () => {
    const outputDir = path.join('./test/output/segments', generateOutputPath(imageUrl));
    await fs.mkdir(outputDir, { recursive: true });
    
    const { segments } = await slice(imageUrl, options);

    for (let index = 0; index < segments.length; index++) {
      const row = Math.floor(index / 3);
      const col = index % 3;
      await sharp(segments[index])
        .jpeg({ quality: 100 })
        .toFile(path.join(outputDir, `segment_${row}_${col}.jpg`));
    }

    const files = await fs.readdir(outputDir);
    expect(files).to.have.length(9);
  });
});