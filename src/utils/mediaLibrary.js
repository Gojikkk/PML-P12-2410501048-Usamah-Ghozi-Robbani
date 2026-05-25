import * as MediaLibrary from 'expo-media-library';
import { mintaIzinMediaLibrary } from './permissions';

export async function simpanFotoKeGaleri(uriFoto) {
  const izinDiberikan = await mintaIzinMediaLibrary();

  if (!izinDiberikan) {
    return {
      berhasil: false,
      pesan: 'Izin menyimpan foto ditolak. Aktifkan izin foto untuk SocialApp di pengaturan perangkat.',
    };
  }

  try {
    await MediaLibrary.saveToLibraryAsync(uriFoto);

    return {
      berhasil: true,
      pesan: 'Foto berhasil disimpan ke galeri.',
    };
  } catch (kesalahan) {
    return {
      berhasil: false,
      pesan: 'Foto gagal disimpan ke galeri.',
    };
  }
}
