import { File, Paths } from 'expo-file-system';

const berkasPostingan = new File(Paths.document, 'daftar-postingan.json');

export async function bacaDaftarPostingan() {
  try {
    if (!berkasPostingan.exists) {
      return [];
    }

    const isiBerkas = await berkasPostingan.text();
    const daftarPostingan = JSON.parse(isiBerkas);

    return Array.isArray(daftarPostingan) ? daftarPostingan : [];
  } catch (kesalahan) {
    return [];
  }
}

export function simpanDaftarPostingan(daftarPostingan) {
  try {
    if (!berkasPostingan.exists) {
      berkasPostingan.create({ intermediates: true, overwrite: true });
    }

    berkasPostingan.write(JSON.stringify(daftarPostingan, null, 2));

    return true;
  } catch (kesalahan) {
    return false;
  }
}

export function simpanFotoPostingan(uriFoto, idPostingan) {
  try {
    const fotoSementara = new File(uriFoto);
    const fotoTersimpan = new File(Paths.document, `postingan-${idPostingan}.jpg`);

    fotoSementara.copy(fotoTersimpan);

    return fotoTersimpan.uri;
  } catch (kesalahan) {
    return uriFoto;
  }
}
