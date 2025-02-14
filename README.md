[![Sponsor](https://img.shields.io/badge/Sponsor-💖-ff69b4)](https://github.com/sponsors/brencon)

# imagment

Configurable image segmentation module that retrieves, processes, and returns segments of an image. Built with sharp for high-performance image processing.

## Installation

```bash
npm install imagment
```

## Module Compatibility
Supports both CommonJS (`require()`) and ES Modules (`import`).

For ES Modules (import): Works natively with "type": "module".
For CommonJS (require()): Uses a dynamic wrapper for compatibility.

## Features

- Flexible grid-based image segmentation (2x2 to 10x10)
- Multiple input sources:
  - HTTPS image URLs
  - Local files
  - Readable streams
- Image enhancement options (sharpen, zoom)
- Detailed metadata for each operation
- Configurable logging levels
- Pure ESM package

## Usage

### Basic Usage

```javascript
import { slice } from 'imagment';

// From URL
const urlResult = await slice('https://example.com/image.jpg');

// From local file
const localResult = await slice('./path/to/image.jpg');

// From stream
import { createReadStream } from 'fs';
const stream = createReadStream('./path/to/image.jpg');
const streamResult = await slice(stream);

// All methods return 3x3 grid segments by default
```

### Custom Grid Size

```javascript
// Works the same for all input types
const result = await slice(input, {
  gridSize: 4 // Creates 4x4 grid (16 segments)
});
```

### Enhancement Options

```javascript
const result = await slice(input, {
  gridSize: 2,
  enhance: {
    sharpen: true,  // Apply sharpening to segments
    zoom: 1.5       // Zoom segments by 150%
  }
});
```

### Configuring Log Level

```javascript
const result = await slice(input, {
  logLevel: 'DEBUG' // NONE, ERROR, WARN, INFO, DEBUG, VERBOSE
});
```

## API Reference

### slice(input, options)

#### Parameters

- `input`: One of:
  - `string`: HTTPS URL or local file path
  - `Readable`: Node.js readable stream
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

The module performs several validations based on input type:

### URL Input
- Must use HTTPS protocol
- Must be accessible
- Must be a valid image format

### Local File Input
- File must exist
- Must be .jpg, .jpeg, or .png format

### Stream Input
- Must be a Readable stream
- Must contain valid image data

### Common Validations
- Grid size must be between 2 and 10
- Grid size must be an integer
- Zoom value must be greater than 0

## Examples

### Using Different Input Types

```javascript
import { slice } from 'imagment';
import { createReadStream } from 'fs';

// URL input
const urlResult = await slice('https://example.com/image.jpg');

// Local file input
const localResult = await slice('./images/photo.jpg');

// Stream input
const stream = createReadStream('./images/photo.jpg');
const streamResult = await slice(stream);
```

### Creating Different Grid Sizes

```javascript
// 2x2 grid (works with any input type)
const smallGrid = await slice(input, { gridSize: 2 });
// 4 segments

// 3x3 grid (default)
const mediumGrid = await slice(input);
// 9 segments

// 4x4 grid
const largeGrid = await slice(input, { gridSize: 4 });
// 16 segments
```

### Applying Enhancements

```javascript
// Sharpen segments
const sharpened = await slice(input, {
  enhance: { sharpen: true }
});

// Zoom segments
const zoomed = await slice(input, {
  enhance: { zoom: 1.5 }
});

// Both sharpen and zoom
const enhanced = await slice(input, {
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
const result = await slice(input, { logLevel: 'DEBUG' });
```

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.