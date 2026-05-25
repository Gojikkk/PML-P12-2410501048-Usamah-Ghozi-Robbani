import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { mintaIzinGaleri } from '../utils/permissions';

export default function useImagePicker() {
  const [fotoDipilih, setFotoDipilih] = useState(null);
  const [sedangMemproses, setSedangMemproses] = useState(false);
  const [pesanGaleri, setPesanGaleri] = useState('');

  async function pilihFotoDariGaleri() {
    const izinDiberikan = await mintaIzinGaleri();

    if (!izinDiberikan) {
      setPesanGaleri('Izin galeri ditolak. Berikan izin untuk memilih foto.');
      return null;
    }

    setSedangMemproses(true);
    setPesanGaleri('');

    try {
      const hasilPemilihan = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (hasilPemilihan.canceled) {
        return null;
      }

      const fotoAwal = hasilPemilihan.assets[0];
      const konteksManipulasi = ImageManipulator.manipulate(fotoAwal.uri);
      konteksManipulasi.resize({ width: 800 });
      const gambarSiapSimpan = await konteksManipulasi.renderAsync();
      const fotoTerkompresi = await gambarSiapSimpan.saveAsync({
        compress: 0.7,
        format: SaveFormat.JPEG,
      });

      setFotoDipilih(fotoTerkompresi);

      return fotoTerkompresi;
    } catch (kesalahan) {
      setPesanGaleri('Foto gagal diproses. Silakan pilih foto lain.');
      return null;
    } finally {
      setSedangMemproses(false);
    }
  }

  return {
    fotoDipilih,
    sedangMemproses,
    pesanGaleri,
    pilihFotoDariGaleri,
  };
}
