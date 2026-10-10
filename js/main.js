// main.js - Coordinates between UI and Logic (Presenter Layer)
import { UI } from './ui.js';
import { BackgroundRemover } from './remover.js';
import { ImageEditor } from './editor.js';

class App {
    constructor() {
        this.ui = new UI();
        this.remover = new BackgroundRemover();
        
        // Initialize Editor
        this.editor = new ImageEditor(this.ui.canvas, this.ui.brushCursor);
        this.editor.onBrushSizeChange = (size) => this.ui.updateBrushDisplay(size);
        
        this.currentFile = null;
        this.originalUrl = null;
        this.resultBlob = null;
        this.resultUrl = null;

        this.initEventListeners();
    }

    initEventListeners() {
        const fileInput = document.getElementById('file-input');
        const dropZone = document.getElementById('drop-zone');
        const btnReset = document.getElementById('btn-reset');
        const btnDownload = document.getElementById('btn-download');

        // Editor Tools Toggle
        this.ui.btnMagicBrush.addEventListener('click', () => {
            const isActive = this.ui.toggleMagicBrush();
            this.editor.isActive = isActive;
            
            // Toggle active style for the magic brush button itself
            if (isActive) {
                this.ui.btnMagicBrush.style.backgroundColor = 'var(--charcoal)';
                this.ui.btnMagicBrush.style.color = 'var(--pure-white)';
            } else {
                this.ui.btnMagicBrush.style.backgroundColor = '#fca311';
                this.ui.btnMagicBrush.style.color = 'var(--charcoal)';
                this.ui.brushCursor.style.display = 'none'; // hide cursor when deactivated
            }
        });

        // Editor Tool Modes
        this.ui.btnModeErase.addEventListener('click', () => {
            this.editor.setMode('erase');
            this.ui.setModeButton('erase');
        });
        
        this.ui.btnModeRestore.addEventListener('click', () => {
            this.editor.setMode('restore');
            this.ui.setModeButton('restore');
        });

        // Brush Size Slider
        this.ui.brushSizeSlider.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            this.editor.brushSize = size;
            this.editor.updateCursorSize();
        });

        // Keyboard accessibility for dropzone
        dropZone.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                fileInput.click();
            }
        });

        // File selection
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });

        // Drag and Drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.ui.setDragState(true);
        });

        dropZone.addEventListener('dragleave', () => {
            this.ui.setDragState(false);
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.ui.setDragState(false);
            if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith('image/')) {
                    this.handleFile(file);
                } else {
                    alert('Harap unggah file berupa gambar!');
                }
            }
        });

        // Reset
        btnReset.addEventListener('click', () => {
            this.cleanupUrls();
            this.ui.showUpload();
            fileInput.value = ''; // Reset input
        });

        // Download
        btnDownload.addEventListener('click', async () => {
            await this.downloadResult();
        });
    }

    async handleFile(file) {
        this.currentFile = file;
        this.originalUrl = URL.createObjectURL(file);
        
        this.ui.showLoading('Memulai proses (mengunduh model AI mungkin memakan waktu pertama kali)...');

        try {
            this.resultBlob = await this.remover.processImage(file, (msg) => {
                this.ui.showLoading(msg);
            });
            
            this.resultUrl = URL.createObjectURL(this.resultBlob);
            
            // Setup editor
            await this.editor.initImages(this.originalUrl, this.resultUrl);
            
            this.ui.showResult(this.originalUrl);
            
            // Set default mode
            this.editor.setMode('erase');
            this.ui.setModeButton('erase');
            
        } catch (error) {
            alert(error.message);
            this.ui.showUpload();
        }
    }

    async downloadResult() {
        // Get the final blob from the canvas
        const editedBlob = await this.editor.getBlob();
        const blobUrl = URL.createObjectURL(editedBlob);
        
        // Required format: Mage_[Original File Name]
        const originalName = this.currentFile.name;
        // Strip the extension to replace it with .png
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        const newFileName = `Mage_${nameWithoutExt}.png`;

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = newFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(blobUrl);
    }

    cleanupUrls() {
        if (this.originalUrl) URL.revokeObjectURL(this.originalUrl);
        if (this.resultUrl) URL.revokeObjectURL(this.resultUrl);
        this.originalUrl = null;
        this.resultUrl = null;
        this.resultBlob = null;
        this.currentFile = null;
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
