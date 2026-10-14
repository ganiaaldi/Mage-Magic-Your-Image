# Mage

An in-browser image background removal tool running entirely on the client side using WebAssembly and ONNX Runtime. No server uploads, no accounts, and no data leaves your machine.

## Overview

Mage processes image segmentation locally inside the web browser using `@imgly/background-removal`. Because computation runs via client-side WebAssembly, your original images and processed outputs are never sent to an external server or cloud service.

In addition to automatic background removal, Mage includes a built-in canvas editor ("Magic Brush") for manual touch-ups, allowing you to restore mistakenly erased areas or clean up residual background artifacts.

## Features

- Client-Side AI Segmentation: Automatic background removal powered by WebAssembly and ONNX Runtime.
- Complete Data Privacy: Processing occurs locally in memory; no images are uploaded to any server.
- Interactive Magic Brush Editor:
  - Restore Mode: Paint over areas to recover parts of the original image.
  - Erase Mode: Remove leftover edges or stray background pixels.
  - Dynamic Brush Sizing: Adjust brush radius in real-time.
- Side-by-Side Comparison: Compare the original image and the processed canvas side by side.
- Transparent PNG Export: Download the processed image in full original resolution with alpha channel transparency.
- Zero Frontend Framework Overhead: Built with vanilla HTML5, CSS3, and ES Modules.

## How It Works

1. Image Loading: The user selects or drops an image into the drop zone.
2. Local Inference: The image is passed to `@imgly/background-removal` running in a Web Worker, which executes the segmentation model using WebAssembly.
3. Canvas Rendering: The resulting segmentation mask and RGBA image are drawn onto an HTML5 canvas.
4. Manual Refinement: Users can toggle the Magic Brush to restore or erase specific pixel regions directly on the canvas.
5. Export: The final canvas state is exported as a PNG blob and downloaded locally.

## Getting Started

### Prerequisites

- A modern web browser supporting WebAssembly and ES Modules (Chrome, Edge, Firefox, or Safari).
- Node.js (v18+) or Python 3 (required only to serve static files locally, as browsers restrict ES Modules and WebAssembly on the `file:///` protocol).

### Installation and Running

1. Clone the repository:
   ```bash
   git clone https://github.com/ganiaaldi/Mage-Magic-Your-Image.git
   cd Mage-Magic-Your-Image
   ```

2. Start the local server:

   **On Windows (One-Click):**
   Double-click `buka_mage.bat` in the project root. This starts the bundled zero-dependency Node.js server and automatically opens the application in your default browser.

   **On macOS / Linux / Windows (Terminal):**
   ```bash
   node server.js
   ```

   *Alternative (using Python):*
   ```bash
   python3 -m http.server 3000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
Mage-Magic-Your-Image/
├── assets/             # Project branding and mascot assets
├── css/
│   └── style.css       # Interface styling (neo-brutalist design system)
├── js/
│   ├── editor.js       # Canvas manipulation and brush engine
│   ├── main.js         # Application state and event coordination
│   ├── remover.js      # Background removal engine integration
│   └── ui.js           # DOM manipulation and interface view management
├── .gitignore          # Git exclusion rules
├── buka_mage.bat       # Windows launcher script
├── index.html          # Main HTML entry point
├── README.md           # Project documentation
└── server.js           # Lightweight zero-dependency static server
```

## Technical Details

- Frontend Architecture: Model-View-Presenter (MVP) pattern using native ES Modules.
- Model Inference: `@imgly/background-removal` via ESM CDN, leveraging multi-threaded WebAssembly where supported.
- Styling: Custom Neo-Brutalist design language with bold borders, hard offset drop shadows, and high-contrast typography.
- Server Component: `server.js` uses only Node.js standard libraries (`http`, `fs`, `path`, `child_process`). It does not require `npm install` or third-party packages.

## Browser Compatibility

- Google Chrome (recommended for optimal WebAssembly multi-threading performance)
- Microsoft Edge
- Mozilla Firefox
- Safari (v16.4+)

## License

This project is open-source. Feel free to use, modify, and distribute.
