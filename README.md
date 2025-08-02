# CubeMaster Pro

CubeMaster Pro is an advanced in-browser Rubik's cube simulator with an included LBL (Layer-by-Layer) solver and professional-grade features.

## Features

- **3D Interactive Cube**: Smooth animations and realistic cube physics using Three.js
- **Advanced LBL Solver**: Comprehensive Layer-by-Layer solving algorithm with step-by-step guidance
- **High-Performance Runtime**: Core solving algorithms implemented in C and compiled to WebAssembly for optimal performance
- **Professional Interface**: Modern blue-themed UI with intuitive controls and real-time 3D visualization
- **Algorithm Optimization**: Built-in optimization routines to minimize move count and improve solving efficiency
- **Multiple Cube Operations**: Support for face rotations, slice moves, and cube reorientations
- **Production Optimizations**: Pre-generated lookup tables for faster solving in production builds

<img width="1920" height="1080" alt="Screenshot 2025-08-02 103540" src="https://github.com/user-attachments/assets/c9f54d98-7738-4187-a1c8-84cd96e50d39" />

## Architecture

The application consists of two main components:

- **Core Runtime**: High-performance Rubik's cube operations and LBL solving algorithms implemented in C ([src/runtime/](./src/runtime/))
- **3D Interface**: Interactive cube visualization and controls built with Three.js ([src/app/](./src/app/))

The C runtime is compiled to WebAssembly using Emscripten, providing native-level performance for cube operations and solving algorithms directly in the browser.

## Key Components

- **rubiks.c**: Complete LBL solver implementation with first layer cross, corners, second layer, and last layer algorithms
- **cubemaster.js**: Three.js-based 3D cube visualization with smooth animations
- **runtimeProxy.js**: WebAssembly interface and worker thread management
- **controls.js**: User interface controls for cube manipulation and solving

## Development

Build process requires Docker to compile C code to WebAssembly.

### Local Development

Install dependencies:
```bash
yarn --silent
```

Compile WebAssembly (development mode):
```bash
yarn wasm:dev
```

Start development server:
```bash
yarn dev
```

The application will be available at: http://localhost:8080

Run tests (requires compiled WebAssembly):
```bash
yarn test
```

### Production Build

For production builds with optimizations:
```bash
yarn wasm:production
yarn build
```

Production builds include pre-generated optimization lookup tables that are baked into the WebAssembly for faster startup times.

### Available Scripts

- `yarn wasm:dev` - Compile C code to WebAssembly (development)
- `yarn wasm:production` - Compile with optimizations for production
- `yarn codegen` - Generate optimization lookup tables
- `yarn dev` - Start development server
- `yarn build` - Create production build
- `yarn test` - Run test suite
- `yarn lint` - Lint JavaScript code
- `yarn fmt` - Format JavaScript code
- `yarn fmt:c` - Format C code
