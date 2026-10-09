// ui.js - Handles all DOM manipulations (View Layer)

export class UI {
    constructor() {
        this.uploadView = document.getElementById('upload-view');
        this.loadingView = document.getElementById('loading-view');
        this.resultView = document.getElementById('result-view');
        
        this.dropZone = document.getElementById('drop-zone');
        this.originalPreview = document.getElementById('original-preview');
        this.resultPreview = document.getElementById('result-preview');
        this.loadingText = document.getElementById('loading-text');
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

    showResult(originalSrc, resultSrc) {
        this.loadingView.classList.add('hidden');
        this.resultView.classList.remove('hidden');
        this.originalPreview.src = originalSrc;
        this.resultPreview.src = resultSrc;
    }

    setDragState(isDragging) {
        if (isDragging) {
            this.dropZone.classList.add('dragover');
        } else {
            this.dropZone.classList.remove('dragover');
        }
    }
}
