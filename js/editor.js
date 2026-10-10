// editor.js - Handles canvas drawing for Add/Remove background brush

export class ImageEditor {
    constructor(canvas, cursor, displaySize) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cursor = cursor;
        this.displaySize = displaySize;
        this.mode = 'erase'; // 'erase' or 'restore'
        this.brushSize = 40;
        this.isActive = false;
        this.isDrawing = false;
        this.originalImage = null;
        this.pattern = null;
        
        // Setup events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.canvas.addEventListener('mouseenter', () => {
            if (this.isActive) this.cursor.style.display = 'block';
        });
        
        // Scrolling for brush size
        this.canvas.addEventListener('wheel', (e) => {
            if (!this.isActive) return;
            e.preventDefault(); // Prevent page scroll
            this.brushSize += e.deltaY > 0 ? -5 : 5; // Scroll up = bigger, down = smaller
            this.brushSize = Math.max(10, Math.min(this.brushSize, 200));
            this.updateCursorSize();
            if (this.onBrushSizeChange) this.onBrushSizeChange(this.brushSize);
        });
        
        this.updateCursorSize();
    }
    
    updateCursorSize() {
        this.cursor.style.width = `${this.brushSize}px`;
        this.cursor.style.height = `${this.brushSize}px`;
    }

    setMode(mode) {
        this.mode = mode;
        if (mode === 'erase') {
            this.cursor.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
            this.cursor.style.borderColor = 'red';
        } else {
            this.cursor.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
            this.cursor.style.borderColor = 'green';
        }
    }

    async initImages(originalUrl, resultUrl) {
        const [origImg, resImg] = await Promise.all([
            this.loadImage(originalUrl),
            this.loadImage(resultUrl)
        ]);
        
        this.originalImage = origImg;
        
        // Setup internal canvas size based on original image
        this.canvas.width = origImg.width;
        this.canvas.height = origImg.height;
        
        // Create pattern for restore mode
        this.pattern = this.ctx.createPattern(origImg, 'no-repeat');
        
        // Draw the AI result initially
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(resImg, 0, 0);
    }
    
    loadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
        });
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        // Calculate internal scale ratio
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
            rawX: e.clientX - rect.left,
            rawY: e.clientY - rect.top
        };
    }

    startDrawing(e) {
        if (!this.isActive) return;
        this.isDrawing = true;
        this.ctx.beginPath();
        const pos = this.getMousePos(e);
        this.ctx.moveTo(pos.x, pos.y);
        this.draw(e);
    }

    draw(e) {
        if (!this.isActive) return;
        const pos = this.getMousePos(e);
        
        // Update cursor position visually
        this.cursor.style.left = `${pos.rawX}px`;
        this.cursor.style.top = `${pos.rawY}px`;

        if (!this.isDrawing) return;
        
        this.ctx.lineTo(pos.x, pos.y);
        
        // Convert screen brush size to internal canvas scale
        const scaleX = this.canvas.width / this.canvas.getBoundingClientRect().width;
        this.ctx.lineWidth = this.brushSize * scaleX;
        
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        if (this.mode === 'erase') {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.strokeStyle = this.pattern;
        }
        
        this.ctx.stroke();
    }

    handleMouseLeave() {
        this.stopDrawing();
        this.cursor.style.display = 'none';
    }

    stopDrawing() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        this.ctx.closePath();
    }
    
    getBlob() {
        return new Promise(resolve => this.canvas.toBlob(resolve, 'image/png'));
    }
}
