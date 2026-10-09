// remover.js - Encapsulates imgly background removal logic (Model Layer)
import { removeBackground } from 'https://cdn.jsdelivr.net/npm/@imgly/background-removal/+esm';

export class BackgroundRemover {
    async processImage(imageFile, progressCallback) {
        try {
            // Configuration for the library
            const config = {
                progress: (key, current, total) => {
                    if (progressCallback) {
                        const percent = Math.round((current / total) * 100);
                        // Translate the downloading message to Indonesian for the user
                        const label = key.includes('fetch') ? 'Mengunduh model' : 'Memproses';
                        progressCallback(`${label}... ${percent}%`);
                    }
                }
            };
            
            // Remove background
            const blob = await removeBackground(imageFile, config);
            return blob;
        } catch (error) {
            console.error('Error removing background:', error);
            throw new Error('Gagal memproses gambar. Pastikan gambar valid.');
        }
    }
}
