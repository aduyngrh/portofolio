# 🚀 Portofolio Modern Yudha - Full-Stack Developer & UI/UX Designer

Portofolio web modern, interaktif, responsif, berkecepatan tinggi, dan **bebas crash (zero-crash architecture)** yang siap digunakan untuk personal branding, melamar kerja, maupun mendapatkan klien freelance.

---

## ✨ Fitur-Fitur Utama

1. **Desain Modern 2026**:
   - Estetika *Glassmorphism*, gradien neon *ambient*, dan tipografi bersih.
   - **Mode Gelap (Dark Mode) & Mode Terang (Light Mode)** dengan penyimpanan preferensi otomatis di `localStorage`.
   - Latar belakang partikel konstelasi interaktif 60 FPS pada HTML5 Canvas (otomatis hemat daya saat tab tidak aktif).

2. **Interaktivitas Maksimal Tanpa Bug / Crash**:
   - **Command Palette (`Ctrl + K` / `Cmd + K` / `/`)**: Fitur pencarian kilat ala macOS Spotlight, Linear, dan Raycast. Pengunjung dapat mencari proyek berdasarkan nama/teknologi, melompat ke seksi manapun, menyalin email, mengunduh CV, atau mengganti tema dalam sekejap dengan navigasi keyboard (`↑`, `↓`, `↵`).
   - **Typewriter Effect**: Teks dinamis yang berganti peran secara berkala di bagian Hero.
   - **Filter Kategori Proyek**: Filter proyek instan berdasarkan kategori (*Web Application*, *AI & Full-Stack*, *Fintech & Mobile*, *Design System*).
   - **Modal Detail Proyek**: Dialog popup interaktif lengkap dengan deskripsi mendalam, poin fitur, teknologi, serta tautan ke Live Demo dan GitHub.
   - **Modal CV / Resume**: Ringkasan resume profesional dengan tombol cetak langsung / simpan PDF (`window.print()`).
   - **Live Playground (Glassmorphism Styler)**: Widget interaktif langsung di mana pengunjung dapat menggeser slider radius, blur, dan glow kartu secara langsung serta menyalin kode CSS yang dihasilkan.
   - **Audio Synthesizer (Web Audio API)**: Efek suara klik dan pop futuristik yang disintesis langsung di peramban tanpa file audio eksternal (default hening/mute, dapat diaktifkan lewat tombol suara).
   - **Scroll Progress & Back to Top**: Indikator persentase scroll di bagian atas serta tombol cepat kembali ke atas halaman.
   - **Formulir Kontak Cepat & Salin Email**: Validasi formulir interaktif, tombol 1-klik salin email dengan pesan toast, serta tautan cepat ke WhatsApp.

3. **Performa & Keandalan**:
   - Skor Lighthouse optimal.
   - Tanpa bundler berat atau dependensi eksternal yang rentan usang — dapat dibuka langsung dengan klik dua kali pada file `index.html` di browser manapun!

---

## 📁 Struktur Berkas

```
portofolio/
│
├── index.html                 # Struktur utama portofolio & SEO meta
├── server.js                  # Server HTTP lokal Node.js tanpa dependensi
├── package.json               # Konfigurasi proyek & perintah npm
├── README.md                  # Dokumentasi panduan
│
├── css/
│   ├── style.css              # Sistem variabel tema, grid, dan komponen
│   └── animations.css         # Animasi keyframes 60fps & transisi
│
├── js/
│   ├── projects-data.js       # PUSAT DATA: Ubah data diri & proyek di sini!
│   ├── sound.js               # Sintesis efek suara Web Audio API
│   ├── particles.js           # Latar canvas partikel ambient
│   └── main.js                # Logika interaktif, filter, modal, & animasi
│
└── assets/
    ├── images/
    │   ├── avatar-placeholder.svg
    │   └── projects/
    │       ├── project-1.svg   (Nexus Commerce)
    │       ├── project-2.svg   (Synapse AI)
    │       ├── project-3.svg   (TaskFlow Pro)
    │       ├── project-4.svg   (PayPulse Fintech)
    │       ├── project-5.svg   (Aura UI Design System)
    │       └── project-6.svg   (FitPulse Tracker)
    └── icons/
```

---

## 🚀 Cara Menjalankan Portofolio

Pilih salah satu metode berikut:

### Opsi 1: Jalankan dengan Server Node.js (Rekomendasi)
Buka terminal di folder ini dan jalankan:
```bash
npm start
```
Atau langsung:
```bash
node server.js
```
Lalu buka peramban Anda di: **`http://localhost:3000`**

### Opsi 2: Buka Langsung (Tanpa Server)
Cukup klik dua kali pada berkas `index.html` untuk langsung membukanya di browser Google Chrome, Edge, Firefox, atau Safari.

---

## ✏️ Cara Mengubah Data Portofolio

Semua data portofolio tersentralisasi dengan rapi di satu berkas:
👉 **`js/projects-data.js`**

Di berkas tersebut, Anda cukup mengubah:
1. **`profile`**: Nama, email, nomor WhatsApp, akun sosial media, dan biografi.
2. **`skills`**: Daftar keahlian frontend, backend, dan tools beserta persentasenya.
3. **`projects`**: Tambah, ubah, atau hapus proyek portofolio, tautan demo, dan repositori GitHub.
4. **`experience`**: Pengalaman kerja dan riwayat karier Anda.
5. **`education`**: Pendidikan formal dan sertifikasi profesional.
6. **`testimonials`**: Ulasan atau rekomendasi dari rekan kerja dan klien.

---

## 🌐 Cara Deploy ke Internet (Gratis)

### A. Deploy ke Vercel (Paling Mudah & Cepat)
1. Buat akun di [Vercel](https://vercel.com).
2. Unggah repositori ini ke GitHub.
3. Di dashboard Vercel, klik **Add New Project** lalu pilih repositori GitHub Anda.
4. Klik **Deploy**. Website portofolio Anda akan langsung online dengan domain HTTPS gratis!

### B. Deploy ke GitHub Pages
1. Unggah folder proyek ini ke repositori GitHub Anda.
2. Buka **Settings** repositori > **Pages**.
3. Di bagian **Source**, pilih branch `main` dan folder `/(root)`.
4. Klik **Save**. Portofolio Anda aktif di `https://<username>.github.io/<nama-repo>/`.

### C. Deploy ke Netlify
1. Tarik (*drag and drop*) seluruh folder portofolio ini ke [Netlify Drop](https://app.netlify.com/drop).
2. Website langsung aktif dalam beberapa detik!

---

## 📄 Lisensi
Dilisensikan di bawah [MIT License](LICENSE). Bebas digunakan dan disesuaikan untuk portofolio pribadi Anda.
