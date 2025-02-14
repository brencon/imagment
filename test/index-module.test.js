import { strict as assert } from 'assert';
import { expect } from 'chai';

describe('Module System Compatibility', () => {
  it('should import `slice` using ES modules', async () => {
    const { slice } = await import('../src/index.js'); // Ensure ESM import works
    expect(slice).to.be.a('function');
  });
});
