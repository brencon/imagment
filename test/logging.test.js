// test/logging.test.js

import { expect } from 'chai';
import { slice, LogLevel } from '../src/index.js';
import sharp from 'sharp';
import nock from 'nock';

describe.only('logging', () => {
  it('should log error when url is invalid with ERROR level', async () => {
    const consoleOutputs = [];
    const mockConsole = {
      error: (...args) => consoleOutputs.push({ level: 'error', message: args }),
    };
    
    const originalConsole = { ...console };
    Object.assign(console, mockConsole);
    
    try {
      await slice('not-a-url', { logLevel: LogLevel.ERROR });
    } catch (error) {
      expect(consoleOutputs).to.have.lengthOf(1);
      expect(consoleOutputs[0].level).to.equal('error');
      expect(consoleOutputs[0].message[0]).to.equal('Invalid URL format');
    }
    
    Object.assign(console, originalConsole);
  });

  it('should not log error when logLevel is NONE', async () => {
    const consoleOutputs = [];
    const mockConsole = {
      error: (...args) => consoleOutputs.push({ level: 'error', message: args }),
    };
    
    const originalConsole = { ...console };
    Object.assign(console, mockConsole);
    
    try {
      await slice('not-a-url', { logLevel: LogLevel.NONE });
    } catch (error) {
      expect(consoleOutputs).to.have.lengthOf(0);
    }
    
    Object.assign(console, originalConsole);
  });

  it('should log info messages when logLevel is INFO', async () => {
    const consoleOutputs = [];
    const mockConsole = {
      error: (...args) => consoleOutputs.push({ level: 'error', message: args }),
      log: (...args) => consoleOutputs.push({ level: 'info', message: args }),
    };
    
    const originalConsole = { ...console };
    Object.assign(console, mockConsole);
    
    try {
      await slice('not-a-url', { logLevel: LogLevel.INFO });
    } catch (error) {
      expect(consoleOutputs).to.have.lengthOf(2);
      expect(consoleOutputs[0].level).to.equal('info');
      expect(consoleOutputs[0].message[0]).to.equal('Processing URL:');
      expect(consoleOutputs[1].level).to.equal('error');
    }
    
    Object.assign(console, originalConsole);
  });

  it('should log debug messages when logLevel is DEBUG', async () => {
    const consoleOutputs = [];
    const mockConsole = {
      error: (...args) => consoleOutputs.push({ level: 'error', message: args }),
      log: (...args) => consoleOutputs.push({ level: 'info', message: args }),
      debug: (...args) => consoleOutputs.push({ level: 'debug', message: args })
    };
    
    const originalConsole = { ...console };
    Object.assign(console, mockConsole);

    const mockImageBuffer = await sharp({
      create: {
        width: 300,
        height: 300,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    }).jpeg().toBuffer();

    nock('https://example.com')
      .get('/test.jpg')
      .reply(200, mockImageBuffer);
    
    await slice('https://example.com/test.jpg', { logLevel: LogLevel.DEBUG });
    
    expect(consoleOutputs.some(log => log.level === 'debug' && log.message[0] === 'Loading image...')).to.be.true;
    expect(consoleOutputs.some(log => log.level === 'debug' && log.message[0] === 'Calculating segment dimensions')).to.be.true;
    
    Object.assign(console, originalConsole);
  });

  it('should log verbose messages when logLevel is VERBOSE', async () => {
    const consoleOutputs = [];
    const mockConsole = {
      error: (...args) => consoleOutputs.push({ level: 'error', message: args }),
      log: (...args) => consoleOutputs.push({ level: 'info', message: args }),
      debug: (...args) => consoleOutputs.push({ level: 'debug', message: args })
    };
    
    const originalConsole = { ...console };
    Object.assign(console, mockConsole);

    const mockImageBuffer = await sharp({
      create: {
        width: 300,
        height: 300,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    }).jpeg().toBuffer();

    nock('https://example.com')
      .get('/test.jpg')
      .reply(200, mockImageBuffer);
    
    await slice('https://example.com/test.jpg', { logLevel: LogLevel.VERBOSE });
    
    expect(consoleOutputs.some(log => log.level === 'debug' && log.message[0].includes('Image buffer size:'))).to.be.true;
    expect(consoleOutputs.some(log => log.level === 'debug' && log.message[0].includes('Extracting segment [0,0]'))).to.be.true;
    expect(consoleOutputs.some(log => log.level === 'debug' && log.message[0].includes('Image metadata:'))).to.be.true;
    
    Object.assign(console, originalConsole);
  });

  it('should log warn messages when enhancement options are invalid', async () => {
    const consoleOutputs = [];
    const mockConsole = {
      error: (...args) => consoleOutputs.push({ level: 'error', message: args }),
      log: (...args) => consoleOutputs.push({ level: 'info', message: args }),
      debug: (...args) => consoleOutputs.push({ level: 'debug', message: args }),
      warn: (...args) => consoleOutputs.push({ level: 'warn', message: args })
    };
    
    const originalConsole = { ...console };
    Object.assign(console, mockConsole);

    const mockImageBuffer = await sharp({
      create: {
        width: 300,
        height: 300,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    }).jpeg().toBuffer();

    nock('https://example.com')
      .get('/test.jpg')
      .reply(200, mockImageBuffer);
    
    try {
      await slice('https://example.com/test.jpg', { 
        logLevel: LogLevel.WARN,
        enhance: { zoom: -1 }  // Invalid zoom value
      });
      
      console.log('Captured outputs:', JSON.stringify(consoleOutputs, null, 2));
      
      expect(consoleOutputs.some(log => 
        log.level === 'warn' && 
        log.message[0].includes('Invalid zoom value')
      )).to.be.true;
    } finally {
      Object.assign(console, originalConsole);
    }
  });
});