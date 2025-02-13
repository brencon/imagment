// ./src/validators/grid-size.js

/**
 * Validates grid size for image segmentation
 * @param {number} size - The grid size to validate
 * @throws {Error} If the grid size is invalid
 */
export const validateGridSize = (size) => {
  if (typeof size !== 'number' || Number.isNaN(size)) {
    throw new Error('Grid size must be a number');
  }

  if (!Number.isInteger(size)) {
    throw new Error('Grid size must be an integer');
  }

  if (size < 2) {
    throw new Error('Grid size must be at least 2');
  }

  if (size > 10) {
    throw new Error('Grid size must not exceed 10');
  }
};