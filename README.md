# SocialApp

SocialApp adalah aplikasi React Native Expo berbasis JavaScript untuk berbagi foto, membuat story dari kamera, melihat pengguna sekitar pada peta, dan mencoba notifikasi lokal.

## Fitur

- Bottom Tab Navigator: Home, Camera, Map, dan Profile.
- Ambil foto menggunakan CameraView dengan countdown, flash, dan ganti kamera.
- Preview hasil kamera dengan aksi Jadikan Post, Simpan, Bagikan, dan Ambil Ulang.
- Membuat postingan dari galeri dengan crop, resize maksimal 800px, dan kompresi.
- Menyimpan data postingan ke file JSON dan menampilkannya kembali.
- Menyimpan foto ke media library dan membagikan foto.
- Menampilkan lokasi pengguna serta marker pengguna dummy di sekitar.
- Notifikasi lokal simulasi chat masuk.
- Deep linking menuju halaman Profile melalui socialapp://profile.

## Teknologi

- Expo SDK 54
- React Native
- React Navigation Bottom Tabs
- Expo Camera
- Expo Image Picker dan Image Manipulator
- Expo Location dan React Native Maps
- Expo Notifications
- Expo File System, Media Library, dan Sharing

## Menjalankan Aplikasi


npm install
npx expo start

Pindai QR code menggunakan Expo Go untuk mencoba fitur dasar aplikasi.

## Development Build

Push notification remote di Android dan akses media library penuh tidak tersedia di Expo Go. Gunakan development build untuk menguji fitur native tersebut secara lengkap.

npx expo install expo-dev-client
npx expo run:android
npx expo start --dev-client


## Deep Linking

Scheme aplikasi:


socialapp


URL untuk membuka Profile:


socialapp://profile

Pengujian pada development build Android:

npx uri-scheme open socialapp://profile --android

Pengujian pada development build iOS:

npx uri-scheme open socialapp://profile --ios

## Permission

Aplikasi meminta izin sesuai fitur yang digunakan:

- Kamera untuk membuat story.
- Galeri untuk memilih dan menyimpan foto.
- Lokasi untuk menampilkan pengguna sekitar.
- Notifikasi untuk menampilkan simulasi pesan masuk.

Jika permission ditolak, aplikasi menampilkan pesan tanpa menghentikan proses aplikasi.

## Tampilan Aplikasi

<p align="center">
  <img src="https://github.com/user-attachments/assets/255b723a-7407-4ccf-aea8-fef5746659d1" width="220"/>
  <img src="https://github.com/user-attachments/assets/a94fd8ea-592e-4fbb-a943-7f5ecdff7e30" width="220"/>
  <img src="https://github.com/user-attachments/assets/b504b80e-2eaa-4990-9c9e-baa50fc091b2" width="220"/>
  <img src="https://github.com/user-attachments/assets/72cdb6cb-fc93-415e-8fe5-7daad8666b9a" width="220"/>
</p>
