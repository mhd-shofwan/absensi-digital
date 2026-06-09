# Absensi Kajian 🕌

Aplikasi absensi *real-time* berbasis kios (*kiosk*) yang dirancang khusus untuk mempermudah proses pendataan kehadiran pada kajian dan pengajian. Dibangun menggunakan Vanilla JavaScript, Tailwind CSS, dan infrastruktur Firebase.

## 🌟 Fitur Utama

- **Mode Kios (*Kiosk Mode*)**: Layar absensi berjalan tanpa perlu login (publik) untuk memudahkan guru/peserta menyentuh kehadiran mereka secara mandiri.
- **Manajemen Perangkat (Device Control)**: Admin memegang kendali penuh. Perangkat/tablet baru wajib disetujui (*Approve*) sebelum bisa beroperasi sebagai mesin absensi.
- **Dashboard Real-Time**: Pantau statistik kehadiran (Hadir, Sakit, Izin, Alpha) dan status tablet secara *live*.
- **Import Massal CSV**: Masukkan banyak data guru/peserta sekaligus tanpa ribet dengan *template* CSV.
- **Manajemen Kajian (Events)**: Buka atau tutup sesi absen pada kajian tertentu hanya dalam satu kali klik.
- **Auto-Update Paksa (Force Reload)**: Dilengkapi dengan skrip khusus untuk membekukan layar dan memaksa seluruh perangkat lawas mengunduh pembaruan saat rilis versi baru.
- **Export Laporan Excel**: Unduh rekap absensi guru (terpisah Ikhwan dan Akhwat) beserta jam kedatangan ke dalam format `.xlsx`.
- **Undian Doorprize (Coming Soon)**: Fitur pengacakan (*Wheel of Names*) berdasarkan data kehadiran dan batas waktu absen.
- **Keamanan Ketat (Firebase Rules)**: Struktur *Security Rules* berlapis yang mengunci data master agar tidak bisa dieksploitasi pihak tak berwenang.

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, Vanilla JavaScript (ES Modules), Tailwind CSS
- **Backend/Database**: Firebase Firestore
- **Otentikasi**: Firebase Auth (Khusus Admin)
- **Tooling**: Node.js, Firebase JS SDK

## 🚀 Panduan Memulai

### Prasyarat
- [Node.js](https://nodejs.org/) terinstal di komputer Anda.
- Proyek Firebase (Pastikan fitur **Firestore Database** & **Authentication Email/Password** telah diaktifkan).

### Instalasi

1. **Clone repositori**
   ```bash
   git clone https://github.com/mhd-shofwan/absensi-digital.git
   cd absensi-digital
   ```

2. **Install library**
   Install dependensi seperti Tailwind CSS dan Firebase SDK.
   ```bash
   npm install
   ```

3. **Konfigurasi Firebase**
   Salin *config* proyek Firebase Anda (dari Firebase Console) ke dalam file `assets/js/firebase.js.example`, kemudian ubah nama filenya menjadi `assets/js/firebase.js` (hapus `.example`).

4. **Jalankan Tailwind CSS (Mode Pengembangan)**
   ```bash
   npm run watch:css
   ```
   *Catatan: Saat akan diunggah ke hosting (Production), gunakan `npm run build:css` untuk memperkecil ukuran file.*

5. **Jalankan Aplikasi**
   Buka folder proyek ini menggunakan _local server_ andalan Anda (seperti Laragon, XAMPP, atau ekstensi _Live Server_ di VSCode).

## 🔒 Keamanan Database (Firestore Rules)
Jangan biarkan aturan Firestore Anda terbuka secara publik. Terapkan konfigurasi *Security Rules* yang telah disediakan di dalam file `firestore.rules` melalui Firebase Console untuk memastikan keamanan data aplikasi Anda secara maksimal.

## 📦 Merilis Versi Baru (Auto-Update Kios)
Jika Anda memperbarui aplikasi dan ingin seluruh perangkat yang ada di masjid terkunci untuk mengunduh versi terbaru:
1. Isi konfigurasi Firebase di dalam file `release.mjs.example` lalu ubah namanya menjadi `release.mjs` (hapus `.example`).
2. Ganti angka versi pada `assets/js/config.js`.
3. Jalankan perintah Node ini di terminal Anda:
   ```bash
   node release.mjs <versi> <email_admin> <password_admin>
   # Contoh: node release.mjs 1.0.1 admin@masjid.com rahasia123
   ```

## 📄 Lisensi
Proyek ini bersifat *Open Source* di bawah lisensi MIT. Dikembangkan oleh [Mhd Shofwan](https://github.com/mhd-shofwan).