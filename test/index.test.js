// test/index.test.js

import { expect } from 'chai'
import { slice } from '../src/index.js'

describe('imagment', () => {
  describe('input validation', () => {
    it('should throw error if image path is not provided', () => {
      expect(() => slice()).to.throw('Image path is required')
    })
  })
})