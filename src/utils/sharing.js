import * as Sharing from 'expo-sharing';

export async function bagikanFoto(uriFoto) {
  try {
    const berbagiTersedia = await Sharing.isAvailableAsync();

    if (!berbagiTersedia) {
      return {
        berhasil: false,
        pesan: 'Fitur berbagi tidak tersedia pada perangkat ini.',
      };
    }

    await Sharing.shareAsync(uriFoto, {
      dialogTitle: 'Bagikan postingan SocialApp',
      mimeType: 'image/jpeg',
    });

    return {
      berhasil: true,
      pesan: 'Foto siap dibagikan.',
    };
  } catch (kesalahan) {
    return {
      berhasil: false,
      pesan: 'Foto tidak dapat dibagikan.',
    };
  }
}
