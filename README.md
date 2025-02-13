# imagment

Configurable image segmentation module that retrieves, processes, and returns segments of an image. Built with sharp for high-performance image processing.

## Installation

```bash
npm install imagment
```

## Features

- Flexible grid-based image segmentation (2x2 to 10x10)
- Supports HTTPS image URLs
- Image enhancement options (sharpen, zoom)
- Detailed metadata for each operation
- Configurable logging levels
- Pure ESM package

## Usage

### Basic Usage

```javascript
import { slice } from 'imagment';

const result = await slice('https://example.com/image.jpg');
// Returns 3x3 grid segments by default
```

### Custom Grid Size

```javascript
const result = await slice('https://example.com/image.jpg', {
  gridSize: 4 // Creates 4x4 grid (16 segments)
});
```

### Enhancement Options

```javascript
const result = await slice('https://example.com/image.jpg', {
  gridSize: 2,
  enhance: {
    sharpen: true,  // Apply sharpening to segments
    zoom: 1.5       // Zoom segments by 150%
  }
});
```

### Configuring Log Level

```javascript
const result = await slice('https://example.com/image.jpg', {
  logLevel: 'DEBUG' // NONE, ERROR, WARN, INFO, DEBUG, VERBOSE
});
```

## API Reference

### slice(imageUrl, options)

#### Parameters

- `imageUrl` (string): HTTPS URL of the image to process
- `options` (object, optional): Configuration options
  - `gridSize` (number): Size of grid (2-10, default: 3)
  - `enhance` (object): Enhancement options
    - `sharpen` (boolean): Apply sharpening
    - `zoom` (number): Zoom factor (> 0)
  - `logLevel` (string): Logging level

#### Returns

Returns a Promise that resolves to an object containing:

```javascript
{
  original: Buffer,       // Original image buffer
  segments: Buffer[],     // Array of segment buffers
  metadata: {
    width: number,       // Original image width
    height: number,      // Original image height
    format: string,      // Image format
    gridSize: number,    // Grid size used
    enhancement: {       // Enhancement settings used
      sharpen: boolean,
      zoom: number
    },
    segmentDimensions: { // Dimensions of each segment
      width: number,
      height: number
    }
  }
}
```

## Validation

The module performs several validations:

- Image URL must use HTTPS protocol
- Grid size must be between 2 and 10
- Grid size must be an integer
- Zoom value must be greater than 0

## Examples

### Creating Different Grid Sizes

```javascript
// 2x2 grid
const smallGrid = await slice(imageUrl, { gridSize: 2 });
// 4 segments

// 3x3 grid (default)
const mediumGrid = await slice(imageUrl);
// 9 segments

// 4x4 grid
const largeGrid = await slice(imageUrl, { gridSize: 4 });
// 16 segments
```

### Applying Enhancements

```javascript
// Sharpen segments
const sharpened = await slice(imageUrl, {
  enhance: { sharpen: true }
});

// Zoom segments
const zoomed = await slice(imageUrl, {
  enhance: { zoom: 1.5 }
});

// Both sharpen and zoom
const enhanced = await slice(imageUrl, {
  enhance: {
    sharpen: true,
    zoom: 1.5
  }
});
```

## Debug Logging

The module supports multiple log levels:

- NONE: No logging
- ERROR: Error messages only
- WARN: Warnings and errors
- INFO: Basic operation info
- DEBUG: Detailed operation info
- VERBOSE: All available information

```javascript
// Enable debug logging
const result = await slice(imageUrl, { logLevel: 'DEBUG' });
```

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.