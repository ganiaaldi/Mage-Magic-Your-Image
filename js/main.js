// main.js - Coordinates between UI and Logic (Presenter Layer)
import { UI } from './ui.js';
import { BackgroundRemover } from './remover.js';

class App {
    constructor() {
        this.ui = new UI();
        this.remover = new BackgroundRemover();
        
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
        btnDownload.addEventListener('click', () => {
            if (this.resultUrl) {
                this.downloadResult();
            }
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
            this.ui.showResult(this.originalUrl, this.resultUrl);
            
        } catch (error) {
            alert(error.message);
            this.ui.showUpload();
        }
    }

    downloadResult() {
        // Required format: Mage_[Original File Name]
        const originalName = this.currentFile.name;
        // Strip the extension to replace it with .png
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        const newFileName = `Mage_${nameWithoutExt}.png`;

        const a = document.createElement('a');
        a.href = this.resultUrl;
        a.download = newFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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
