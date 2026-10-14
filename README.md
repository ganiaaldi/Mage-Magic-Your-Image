# Mage

Aplikasi penghapus latar belakang (background) gambar langsung di browser, berjalan sepenuhnya di sisi klien menggunakan WebAssembly dan ONNX Runtime. Tanpa unggah ke server, tanpa perlu akun, dan data tidak pernah keluar dari perangkat Anda.

## Gambaran Umum

Mage memproses segmentasi gambar secara lokal di dalam browser menggunakan `@imgly/background-removal`. Karena komputasi berjalan melalui WebAssembly di sisi klien, gambar asli dan hasil olahan tidak pernah dikirim ke server eksternal maupun layanan cloud.

Selain penghapusan background otomatis, Mage dilengkapi editor kanvas bawaan ("Magic Brush") untuk perbaikan manual. Anda dapat mengembalikan area gambar yang terhapus secara tidak sengaja atau merapikan sisa-sisa background yang masih tertinggal.

## Fitur Utama

- Segmentasi AI di Sisi Klien: Penghapusan background otomatis ditenagai oleh WebAssembly dan ONNX Runtime.
- Privasi Data Terjaga Penuh: Pemrosesan berlangsung lokal di memori perangkat, tidak ada gambar yang diunggah ke server mana pun.
- Editor Magic Brush Interaktif:
  - Mode Restore: Mengembalikan bagian gambar asli dengan kuas.
  - Mode Hapus (Erase): Menghapus sisa tepian atau piksel latar belakang yang masih tersisa.
  - Ukuran Kuas Fleksibel: Mengatur ukuran kuas secara langsung saat mengedit.
- Perbandingan Berdampingan (Side-by-Side): Membandingkan gambar asli dan hasil olahan secara langsung.
- Ekspor PNG Transparan: Mengunduh hasil gambar dengan resolusi asli dan latar belakang transparan (alpha channel).
- Tanpa Framework Tambahan: Dibangun menggunakan HTML5 murni, CSS3, dan modul JavaScript standar (ES Modules).

## Cara Kerja

1. Memuat Gambar: Pengguna memilih atau menyeret gambar ke area drop zone.
2. Inferensi Lokal: Gambar diteruskan ke pustaka `@imgly/background-removal` yang berjalan di Web Worker, lalu model segmentasi dieksekusi menggunakan WebAssembly.
3. Render ke Kanvas: Mask segmentasi dan gambar RGBA digambar ke elemen canvas HTML5.
4. Penyempurnaan Manual: Pengguna dapat mengaktifkan Magic Brush untuk mengembalikan atau menghapus piksel tertentu langsung di atas kanvas.
5. Ekspor: Hasil akhir kanvas diekspor menjadi format PNG dan langsung diunduh ke komputer pengguna.

## Memulai

### Prasyarat

- Browser modern yang mendukung WebAssembly dan ES Modules (Chrome, Edge, Firefox, atau Safari).
- Node.js (v18+) atau Python 3 (hanya dibutuhkan untuk menjalankan server statis lokal, karena browser membatasi ES Modules dan WebAssembly jika dibuka langsung lewat protokol `file:///`).

### Pemasangan dan Menjalankan Aplikasi

1. Clone repositori:
   ```bash
   git clone https://github.com/ganiaaldi/Mage-Magic-Your-Image.git
   cd Mage-Magic-Your-Image
   ```

2. Jalankan server lokal:

   **Di Windows (Satu Klik):**
   Klik dua kali file `buka_mage.bat` di folder utama proyek. File ini akan menjalankan server Node.js bawaan tanpa dependensi eksternal dan langsung membuka aplikasi di browser default Anda.

   **Di macOS / Linux / Windows (Melalui Terminal):**
   ```bash
   node server.js
   ```

   *Opsi lain (menggunakan Python):*
   ```bash
   python3 -m http.server 3000
   ```

3. Buka browser dan kunjungi:
   ```
   http://localhost:3000
   ```

## Struktur Proyek

```
Mage-Magic-Your-Image/
├── assets/             # Aset maskot dan branding proyek
├── css/
│   └── style.css       # Gaya tampilan antarmuka (desain neo-brutalisme)
├── js/
│   ├── editor.js       # Manipulasi kanvas dan logika kuas Magic Brush
│   ├── main.js         # Pengelolaan status aplikasi dan koordinasi event
│   ├── remover.js      # Integrasi pustaka penghapus background
│   └── ui.js           # Manipulasi DOM dan pengelolaan tampilan antarmuka
├── .gitignore          # Aturan pengabaian file Git
├── buka_mage.bat       # Skrip peluncur otomatis untuk Windows
├── index.html          # Halaman utama aplikasi
├── README.md           # Dokumentasi proyek
└── server.js           # Server file statis ringan tanpa dependensi pihak ketiga
```

## Detail Teknis

- Arsitektur Frontend: Pola Model-View-Presenter (MVP) menggunakan ES Modules murni.
- Inferensi Model: `@imgly/background-removal` melalui CDN ESM, memanfaatkan multi-threading WebAssembly jika didukung perangkat.
- Gaya Tampilan: Bahasa desain Neo-Brutalisme kustom dengan garis tepi tebal, bayangan tegas (hard drop shadow), dan tipografi berbobot kontras tinggi.
- Komponen Server: `server.js` hanya mengandalkan modul bawaan standar Node.js (`http`, `fs`, `path`, `child_process`). Proyek ini tidak membutuhkan perintah `npm install` atau paket pihak ketiga.

## Kompatibilitas Browser

- Google Chrome (direkomendasikan untuk performa multi-threading WebAssembly terbaik)
- Microsoft Edge
- Mozilla Firefox
- Safari (versi 16.4+)

## Lisensi

Proyek ini bersifat open-source. Anda bebas menggunakan, memodifikasi, dan mendistribusikannya kembali.
