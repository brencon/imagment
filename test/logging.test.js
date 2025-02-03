// test/logging.test.js
import { expect } from 'chai';
import { slice } from '../src/index.js';
import { LogLevel } from '../src/logger.js';

describe('logging', () => {
  const imageUrl = 'https://media.mycomicshop.com/n_ii/originalimage/7794643.jpg';

  it('should log error when url is invalid with ERROR level', async () => {
    try {
      await slice('invalid-url', { logLevel: LogLevel.ERROR });
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error.message).to.include('Invalid URL');
    }
  });

  it('should not log error when logLevel is NONE', async () => {
    try {
      await slice('invalid-url', { logLevel: LogLevel.NONE });
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error.message).to.include('Invalid URL');
    }
  });

  it('should log info messages when logLevel is INFO', async () => {
    const result = await slice(imageUrl, { logLevel: LogLevel.INFO });
    expect(result.segments).to.have.lengthOf(9);
  });

  it('should log debug messages when logLevel is DEBUG', async () => {
    const result = await slice(imageUrl, { logLevel: LogLevel.DEBUG });
    expect(result.segments).to.have.lengthOf(9);
  });

  it('should log verbose messages when logLevel is VERBOSE', async () => {
    const result = await slice(imageUrl, { logLevel: LogLevel.VERBOSE });
    expect(result.segments).to.have.lengthOf(9);
  });

  it('should log warn messages when enhancement options are invalid', async () => {
    const result = await slice(imageUrl, { 
      logLevel: LogLevel.WARN,
      enhance: { zoom: -1 }
    });
    expect(result.segments).to.have.lengthOf(9);
  });
});