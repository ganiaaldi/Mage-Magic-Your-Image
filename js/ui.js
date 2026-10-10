// ui.js - Handles all DOM manipulations (View Layer)

export class UI {
    constructor() {
        this.uploadView = document.getElementById('upload-view');
        this.loadingView = document.getElementById('loading-view');
        this.resultView = document.getElementById('result-view');
        
        this.dropZone = document.getElementById('drop-zone');
        this.originalPreview = document.getElementById('original-preview');
        this.loadingText = document.getElementById('loading-text');
        
        // Editor UI
        this.canvas = document.getElementById('editor-canvas');
        this.brushCursor = document.getElementById('brush-cursor');
        
        // New Magic Brush UI
        this.btnMagicBrush = document.getElementById('btn-magic-brush');
        this.magicBrushTools = document.getElementById('magic-brush-tools');
        this.btnModeErase = document.getElementById('btn-mode-erase');
        this.btnModeRestore = document.getElementById('btn-mode-restore');
        this.brushSizeSlider = document.getElementById('brush-size-slider');
    }

    showUpload() {
        this.uploadView.classList.remove('hidden');
        this.loadingView.classList.add('hidden');
        this.resultView.classList.add('hidden');
    }

    showLoading(message = 'Sedang memproses...') {
        this.uploadView.classList.add('hidden');
        this.resultView.classList.add('hidden');
        this.loadingView.classList.remove('hidden');
        this.loadingText.textContent = message;
    }

    showResult(originalSrc) {
        this.loadingView.classList.add('hidden');
        this.resultView.classList.remove('hidden');
        this.originalPreview.src = originalSrc;
    }

    updateBrushDisplay(size) {
        if (this.brushSizeSlider) {
            this.brushSizeSlider.value = size;
        }
    }

    setModeButton(mode) {
        if (mode === 'erase') {
            this.btnModeErase.classList.add('active');
            this.btnModeRestore.classList.remove('active');
        } else {
            this.btnModeRestore.classList.add('active');
            this.btnModeErase.classList.remove('active');
        }
    }

    toggleMagicBrush() {
        this.magicBrushTools.classList.toggle('hidden');
        return !this.magicBrushTools.classList.contains('hidden');
    }

    setDragState(isDragging) {
        if (isDragging) {
            this.dropZone.classList.add('dragover');
        } else {
            this.dropZone.classList.remove('dragover');
        }
    }
}
