import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import useNotifications from '../hooks/useNotifications';
import { kirimNotifikasi } from '../utils/notifications';

export default function ProfileScreen({ daftarPostingan }) {
  const tabSedangAktif = useIsFocused();
  const {
    tokenPush,
    pesanNotifikasi,
    notifikasiTerbaru,
  } = useNotifications(tabSedangAktif);

  async function kirimTestNotifikasi() {
    try {
      const hasilPengiriman = await kirimNotifikasi();

      Alert.alert('Notifikasi', hasilPengiriman.pesan);
    } catch (kesalahan) {
      Alert.alert('Notifikasi', 'Notifikasi tes tidak dapat dikirim.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.konten}>
      <View style={styles.profil}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={42} color="#4f46e5" />
        </View>
        <Text style={styles.nama}>Pengguna SocialApp</Text>
        <Text style={styles.ringkasan}>{daftarPostingan.length} postingan tersimpan</Text>
      </View>

      <Pressable style={styles.tombolNotifikasi} onPress={kirimTestNotifikasi}>
        <Ionicons name="notifications-outline" size={21} color="#ffffff" />
        <Text style={styles.teksTombol}>Kirim Test Notifikasi</Text>
      </Pressable>

      {pesanNotifikasi ? <Text style={styles.pesanNotifikasi}>{pesanNotifikasi}</Text> : null}
      {tokenPush ? <Text style={styles.token} numberOfLines={2}>Token: {tokenPush}</Text> : null}
      {notifikasiTerbaru ? (
        <View style={styles.pesanMasuk}>
          <Text style={styles.judulPesan}>{notifikasiTerbaru.title}</Text>
          <Text style={styles.isiPesan}>{notifikasiTerbaru.body}</Text>
        </View>
      ) : null}

      <Text style={styles.judulBagian}>Post Tersimpan</Text>
      {daftarPostingan.length === 0 ? (
        <Text style={styles.kosong}>Data postingan yang disimpan akan muncul di sini.</Text>
      ) : (
        <View style={styles.galeri}>
          {daftarPostingan.map((postingan) => (
            <Image key={postingan.id} source={{ uri: postingan.uriFoto }} style={styles.foto} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  konten: {
    backgroundColor: '#f8fafc',
    flexGrow: 1,
    padding: 16,
  },
  profil: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginBottom: 18,
    padding: 22,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: 12,
    width: 80,
  },
  nama: {
    color: '#0f172a',
    fontSize: 19,
    fontWeight: '700',
  },
  ringkasan: {
    color: '#64748b',
    marginTop: 5,
  },
  tombolNotifikasi: {
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    borderRadius: 13,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    padding: 14,
  },
  teksTombol: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  pesanNotifikasi: {
    backgroundColor: '#ffffff',
    borderRadius: 11,
    color: '#475569',
    marginTop: 12,
    padding: 11,
  },
  token: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 9,
  },
  pesanMasuk: {
    backgroundColor: '#eef2ff',
    borderRadius: 11,
    marginTop: 12,
    padding: 12,
  },
  judulPesan: {
    color: '#312e81',
    fontWeight: '700',
  },
  isiPesan: {
    color: '#4338ca',
    marginTop: 4,
  },
  judulBagian: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 24,
  },
  kosong: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    color: '#64748b',
    padding: 18,
    textAlign: 'center',
  },
  galeri: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  foto: {
    aspectRatio: 1,
    borderRadius: 8,
    width: '31.5%',
  },
});
