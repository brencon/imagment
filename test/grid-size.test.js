// ./test/grid-size.test.js

import { strict as assert } from 'assert';
import { expect } from 'chai';
import { validateGridSize } from '../src/validators/grid-size.js';

describe('Grid Size Validation', () => {
  it('should accept valid grid sizes', () => {
    expect(() => validateGridSize(2)).to.not.throw();
    expect(() => validateGridSize(3)).to.not.throw();
    expect(() => validateGridSize(4)).to.not.throw();
    expect(() => validateGridSize(5)).to.not.throw();
  });

  it('should reject non-numeric grid sizes', () => {
    expect(() => validateGridSize('3')).to.throw('Grid size must be a number');
    expect(() => validateGridSize(null)).to.throw('Grid size must be a number');
    expect(() => validateGridSize(undefined)).to.throw('Grid size must be a number');
    expect(() => validateGridSize({})).to.throw('Grid size must be a number');
  });

  it('should reject grid sizes less than 2', () => {
    expect(() => validateGridSize(0)).to.throw('Grid size must be at least 2');
    expect(() => validateGridSize(1)).to.throw('Grid size must be at least 2');
    expect(() => validateGridSize(-1)).to.throw('Grid size must be at least 2');
  });

  it('should reject decimal grid sizes', () => {
    expect(() => validateGridSize(2.5)).to.throw('Grid size must be an integer');
    expect(() => validateGridSize(3.1)).to.throw('Grid size must be an integer');
  });

  it('should reject grid sizes larger than 10', () => {
    expect(() => validateGridSize(11)).to.throw('Grid size must not exceed 10');
    expect(() => validateGridSize(20)).to.throw('Grid size must not exceed 10');
  });
});