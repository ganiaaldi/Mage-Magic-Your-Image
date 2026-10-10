// remover.js - Encapsulates imgly background removal logic (Model Layer)
import { removeBackground } from 'https://cdn.jsdelivr.net/npm/@imgly/background-removal/+esm';

export class BackgroundRemover {
    async processImage(imageFile, progressCallback) {
        try {
            // Configuration for the library
            const config = {
                progress: (key, current, total) => {
                    if (progressCallback) {
                        // Tahap download memiliki persentase yang akurat
                        if (key.includes('fetch')) {
                            const percent = Math.round((current / total) * 100);
                            progressCallback(`Mengunduh model AI... ${percent}%`);
                        } else {
                            // Tahap komputasi AI angkanya melompat (0 -> 75 -> 100)
                            // Menyembunyikan angkanya agar user tidak merasa nge-bug/stuck
                            progressCallback(`Menganalisis gambar menggunakan AI (tahan ya, ini butuh beberapa detik)...`);
                        }
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
