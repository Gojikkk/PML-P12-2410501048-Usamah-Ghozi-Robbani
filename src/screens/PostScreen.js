import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useImagePicker from '../hooks/useImagePicker';
import { bagikanFoto } from '../utils/sharing';
import { simpanFotoKeGaleri } from '../utils/mediaLibrary';
import { simpanFotoPostingan } from '../utils/fileSystem';

export default function PostScreen({ daftarPostingan, simpanPostingan }) {
  const {
    fotoDipilih,
    sedangMemproses,
    pesanGaleri,
    pilihFotoDariGaleri,
  } = useImagePicker();

  async function buatPostingan() {
    const fotoSiapUnggah = await pilihFotoDariGaleri();

    if (!fotoSiapUnggah) {
      return;
    }

    const idPostingan = Date.now().toString();
    const uriFotoTersimpan = simpanFotoPostingan(fotoSiapUnggah.uri, idPostingan);
    const postinganBaru = {
      id: idPostingan,
      uriFoto: uriFotoTersimpan,
      caption: 'Menikmati hari ini bersama SocialApp.',
      dibuatPada: new Date().toLocaleString('id-ID'),
    };

    const berhasilDisimpan = await simpanPostingan(postinganBaru);

    if (!berhasilDisimpan) {
      Alert.alert('Postingan gagal', 'Data postingan tidak dapat disimpan.');
    }
  }

  async function simpanFoto(uriFoto) {
    const hasilPenyimpanan = await simpanFotoKeGaleri(uriFoto);

    Alert.alert('Simpan foto', hasilPenyimpanan.pesan);
  }

  async function bagikanPostingan(uriFoto) {
    const hasilBerbagi = await bagikanFoto(uriFoto);

    if (!hasilBerbagi.berhasil) {
      Alert.alert('Bagikan foto', hasilBerbagi.pesan);
    }
  }

  return (
    <View>
      <Pressable
        style={[styles.tombolUnggah, sedangMemproses && styles.tombolNonaktif]}
        onPress={buatPostingan}
        disabled={sedangMemproses}
      >
        <Ionicons name="images-outline" size={21} color="#ffffff" />
        <Text style={styles.teksTombolUnggah}>
          {sedangMemproses ? 'Memproses foto...' : 'Buat Post Foto'}
        </Text>
      </Pressable>

      {pesanGaleri ? <Text style={styles.pesan}>{pesanGaleri}</Text> : null}

      {fotoDipilih ? (
        <Text style={styles.statusFoto}>Foto terakhir sudah dipotong dan dikompres.</Text>
      ) : null}

      <Text style={styles.judulDaftar}>Postingan Terbaru</Text>

      {daftarPostingan.length === 0 ? (
        <View style={styles.keadaanKosong}>
          <Ionicons name="image-outline" size={42} color="#94a3b8" />
          <Text style={styles.teksKosong}>Belum ada postingan foto.</Text>
        </View>
      ) : (
        daftarPostingan.map((postingan) => (
          <View key={postingan.id} style={styles.kartu}>
            <Image source={{ uri: postingan.uriFoto }} style={styles.fotoPostingan} />
            <Text style={styles.caption}>{postingan.caption}</Text>
            <Text style={styles.waktu}>{postingan.dibuatPada}</Text>
            <View style={styles.aksi}>
              <Pressable style={styles.tombolAksi} onPress={() => simpanFoto(postingan.uriFoto)}>
                <Ionicons name="download-outline" size={19} color="#4f46e5" />
                <Text style={styles.teksAksi}>Simpan</Text>
              </Pressable>
              <Pressable style={styles.tombolAksi} onPress={() => bagikanPostingan(postingan.uriFoto)}>
                <Ionicons name="share-social-outline" size={19} color="#4f46e5" />
                <Text style={styles.teksAksi}>Bagikan</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tombolUnggah: {
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    padding: 14,
  },
  tombolNonaktif: {
    opacity: 0.55,
  },
  teksTombolUnggah: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  pesan: {
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    color: '#b91c1c',
    marginTop: 12,
    padding: 10,
  },
  statusFoto: {
    color: '#15803d',
    fontSize: 13,
    marginTop: 10,
  },
  judulDaftar: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 22,
  },
  keadaanKosong: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 28,
  },
  teksKosong: {
    color: '#64748b',
    marginTop: 8,
  },
  kartu: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    paddingBottom: 12,
  },
  fotoPostingan: {
    aspectRatio: 1,
    backgroundColor: '#e2e8f0',
    width: '100%',
  },
  caption: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 12,
    marginTop: 12,
  },
  waktu: {
    color: '#64748b',
    fontSize: 12,
    marginHorizontal: 12,
    marginTop: 4,
  },
  aksi: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 12,
    marginTop: 12,
  },
  tombolAksi: {
    alignItems: 'center',
    borderColor: '#c7d2fe',
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  teksAksi: {
    color: '#4f46e5',
    fontWeight: '600',
  },
});
