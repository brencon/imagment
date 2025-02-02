// test/index.test.js
import { expect } from 'chai';
import nock from 'nock';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { slice } from '../src/index.js';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEST_IMAGE_URL = 'https://media.mycomicshop.com/n_ii/originalimage/7794643.jpg';

describe('imagment', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('input validation', () => {
    it('should throw error if image url is not provided', async () => {
      try {
        await slice();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Image URL is required');
      }
    });
    
    it('should throw error if url is invalid', async () => {
      try {
        await slice('not-a-url');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Invalid URL format');
      }
    });
  });

  describe('image retrieval', () => {
    it('should retrieve comic cover image buffer', async () => {
      const mockImageBuffer = await sharp({
        create: {
          width: 100,
          height: 100,
          channels: 3,
          background: { r: 255, g: 0, b: 0 }
        }
      }).jpeg().toBuffer();
  
      nock('https://media.mycomicshop.com')
        .get('/n_ii/originalimage/7794643.jpg')
        .reply(200, mockImageBuffer);
  
      const result = await slice('https://media.mycomicshop.com/n_ii/originalimage/7794643.jpg');
      expect(result).to.have.property('original').that.is.instanceOf(Buffer);
    });
  });

  it('should retrieve image metadata', async () => {
    const mockImageBuffer = await sharp({
      create: {
        width: 300,
        height: 300,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    }).jpeg().toBuffer();
   
    nock('https://media.mycomicshop.com')
      .get('/n_ii/originalimage/7794643.jpg')
      .reply(200, mockImageBuffer);
   
    const result = await slice('https://media.mycomicshop.com/n_ii/originalimage/7794643.jpg');
    expect(result).to.have.property('metadata');
    expect(result.metadata).to.have.property('width', 300);
    expect(result.metadata).to.have.property('height', 300);
   });

   it('should segment image into 3x3 grid', async () => {
    const mockImageBuffer = await sharp({
      create: {
        width: 300,
        height: 300,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    }).jpeg().toBuffer();
  
    nock('https://media.mycomicshop.com')
      .get('/n_ii/originalimage/7794643.jpg')
      .reply(200, mockImageBuffer);
  
    const result = await slice('https://media.mycomicshop.com/n_ii/originalimage/7794643.jpg', { debug: true });
    expect(result).to.have.property('segments').that.is.an('array').with.lengthOf(9);
  });

  it('should sharpen image segments', async () => {
    const mockImageBuffer = await sharp({
      create: {
        width: 300,
        height: 300,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    }).jpeg().toBuffer();
   
    nock('https://media.mycomicshop.com')
      .get('/n_ii/originalimage/7794643.jpg')
      .reply(200, mockImageBuffer);
   
    const result = await slice('https://media.mycomicshop.com/n_ii/originalimage/7794643.jpg', {
      enhance: { sharpen: true }
    });
    
    expect(result.metadata.enhancement).to.have.property('sharpen', true);
    expect(result).to.have.property('segments').with.lengthOf(9);
   });

   it('should zoom image segments when specified', async () => {
    const mockImageBuffer = await sharp({
      create: {
        width: 300,
        height: 300,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    }).jpeg().toBuffer();
   
    nock('https://media.mycomicshop.com')
      .get('/n_ii/originalimage/7794643.jpg')
      .reply(200, mockImageBuffer);
   
    const result = await slice('https://media.mycomicshop.com/n_ii/originalimage/7794643.jpg', {
      enhance: { zoom: 1.5 }
    });
    
    expect(result.metadata.enhancement).to.have.property('zoom', 1.5);
    expect(result).to.have.property('segments').with.lengthOf(9);
    expect(result.metadata.segmentDimensions.width).to.equal(150);
    expect(result.metadata.segmentDimensions.height).to.equal(150);
   });

   it('should process real comic cover with zoom and sharpen', async () => {
    const result = await slice('https://media.mycomicshop.com/n_ii/originalimage/7794643.jpg', {
      enhance: { 
        zoom: 1.5,
        sharpen: true
      }
    });
    
    expect(result).to.have.property('original').that.is.instanceOf(Buffer);
    expect(result.metadata.enhancement).to.include({ zoom: 1.5, sharpen: true });
    expect(result).to.have.property('segments').with.lengthOf(9);
   });

});