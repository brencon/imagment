// ./test/stream-validator.test.js

import { strict as assert } from 'assert';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { validateImageStream } from '../src/stream-validator.js';

describe('Stream Validator', () => {
  const TEST_IMAGE_PATH = path.join('test', 'fixtures', 'test-image-stream.jpg');

  it('should throw error if stream is not provided', async () => {
    let thrownError = null;
    try {
      await validateImageStream(null);
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).to.not.be.null;
    expect(thrownError.message).to.equal('Stream is required');
  });

  it('should throw error if input is not a Readable stream', async () => {
    let thrownError = null;
    try {
      await validateImageStream({ fake: 'stream' });
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).to.not.be.null;
    expect(thrownError.message).to.equal('Invalid stream type');
  });

  it('should throw error if stream is invalid', async () => {
    const invalidStream = new Readable();
    invalidStream.push('not an image');
    invalidStream.push(null);

    let thrownError = null;
    try {
      await validateImageStream(invalidStream);
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).to.not.be.null;
    expect(thrownError.message).to.equal('Invalid image data');
  });

  it('should throw error if stream errors', async () => {
    const errorStream = new Readable({
      read() {
        this.destroy(new Error('Stream error'));
      }
    });

    let thrownError = null;
    try {
      await validateImageStream(errorStream);
    } catch (error) {
      thrownError = error;
    }
    expect(thrownError).to.not.be.null;
    expect(thrownError.message).to.equal('Stream error');
  });

  it('should return buffer for valid image streams', async () => {
    const imageStream = fs.createReadStream(TEST_IMAGE_PATH);
    const result = await validateImageStream(imageStream);
    expect(Buffer.isBuffer(result)).to.be.true;
    expect(result.length).to.be.greaterThan(0);
  });

  it('should not log when logLevel is NONE', async () => {
    const imageStream = fs.createReadStream(TEST_IMAGE_PATH);
    const result = await validateImageStream(imageStream, { logLevel: 'NONE' });
    expect(Buffer.isBuffer(result)).to.be.true;
    expect(result.length).to.be.greaterThan(0);
  });
});