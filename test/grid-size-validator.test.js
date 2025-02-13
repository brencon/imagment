// ./test/grid-size-validator.test.js

import { expect } from 'chai';
import { validateGridSize } from '../src/validators/grid-size.js';

describe('Grid Size Validator', () => {
  it('should throw error for size 0', () => {
    expect(() => validateGridSize(0)).to.throw('Grid size must be at least 2');
  });

  it('should throw error for size 11', () => {
    expect(() => validateGridSize(11)).to.throw('Grid size must not exceed 10');
  });

  it('should throw error for size -1', () => {
    expect(() => validateGridSize(-1)).to.throw('Grid size must be at least 2');
  });

  it('should throw error for size 2.5', () => {
    expect(() => validateGridSize(2.5)).to.throw('Grid size must be an integer');
  });

  it('should not throw for valid sizes', () => {
    expect(() => validateGridSize(2)).to.not.throw();
    expect(() => validateGridSize(3)).to.not.throw();
    expect(() => validateGridSize(4)).to.not.throw();
  });
});