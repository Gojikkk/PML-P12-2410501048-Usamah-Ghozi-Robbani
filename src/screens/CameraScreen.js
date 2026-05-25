import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { simpanFotoPostingan } from '../utils/fileSystem';
import { simpanFotoKeGaleri } from '../utils/mediaLibrary';
import { bagikanFoto } from '../utils/sharing';

export default function CameraScreen({ navigation, simpanPostingan }) {
  const referensiKamera = useRef(null);
  const tabSedangAktif = useIsFocused();
  const tabAktifSaatIni = useRef(tabSedangAktif);
  const [izinKamera, mintaIzinKamera] = useCameraPermissions();
  const [arahKamera, setArahKamera] = useState('back');
  const [flashAktif, setFlashAktif] = useState(false);
  const [hitungMundur, setHitungMundur] = useState(null);
  const [fotoCerita, setFotoCerita] = useState(null);
  const [pesanKamera, setPesanKamera] = useState('');
  const [sedangMemotret, setSedangMemotret] = useState(false);

  useEffect(() => {
    tabAktifSaatIni.current = tabSedangAktif;

    if (tabSedangAktif && izinKamera === null) {
      mintaAksesKamera();
    }

    if (!tabSedangAktif) {
      setHitungMundur(null);
      setSedangMemotret(false);
    }
  }, [izinKamera?.granted, mintaIzinKamera, tabSedangAktif]);

  async function mintaAksesKamera() {
    try {
      await mintaIzinKamera();
    } catch (kesalahan) {
      setPesanKamera('Izin kamera tidak dapat diminta saat ini.');
    }
  }

  useEffect(() => {
    if (hitungMundur === null) {
      return undefined;
    }

    if (hitungMundur > 0) {
      const pewaktuHitungMundur = setTimeout(() => {
        setHitungMundur((angkaSaatIni) => angkaSaatIni - 1);
      }, 1000);

      return () => {
        clearTimeout(pewaktuHitungMundur);
      };
    }

    ambilFoto();

    return undefined;
  }, [hitungMundur]);

  async function ambilFoto() {
    if (!referensiKamera.current || !tabAktifSaatIni.current) {
      return;
    }

    setSedangMemotret(true);
    setHitungMundur(null);
    setPesanKamera('');

    try {
      const fotoAwal = await referensiKamera.current.takePictureAsync({
        quality: 1,
      });
      const konteksManipulasi = ImageManipulator.manipulate(fotoAwal.uri);
      konteksManipulasi.resize({ width: 800 });
      const gambarSiapSimpan = await konteksManipulasi.renderAsync();
      const fotoTerkompresi = await gambarSiapSimpan.saveAsync({
        compress: 0.7,
        format: SaveFormat.JPEG,
      });

      if (tabAktifSaatIni.current) {
        setFotoCerita(fotoTerkompresi);
      }
    } catch (kesalahan) {
      if (tabAktifSaatIni.current) {
        setPesanKamera('Foto gagal diambil. Coba kembali.');
      }
    } finally {
      if (tabAktifSaatIni.current) {
        setSedangMemotret(false);
      }
    }
  }

  function mulaiHitungMundur() {
    if (!sedangMemotret && hitungMundur === null) {
      setFotoCerita(null);
      setHitungMundur(3);
    }
  }

  function gantiArahKamera() {
    setArahKamera((arahSaatIni) => (arahSaatIni === 'back' ? 'front' : 'back'));
  }

  async function jadikanPostingan() {
    const idPostingan = Date.now().toString();
    const uriFotoTersimpan = simpanFotoPostingan(fotoCerita.uri, idPostingan);
    const postinganBaru = {
      id: idPostingan,
      uriFoto: uriFotoTersimpan,
      caption: 'Story terbaru dari kamera SocialApp.',
      dibuatPada: new Date().toLocaleString('id-ID'),
    };
    const berhasilDisimpan = await simpanPostingan(postinganBaru);

    if (!berhasilDisimpan) {
      Alert.alert('Postingan gagal', 'Foto kamera tidak dapat disimpan sebagai postingan.');
      return;
    }

    setFotoCerita(null);
    navigation.navigate('Home');
  }

  async function simpanFoto() {
    const hasilPenyimpanan = await simpanFotoKeGaleri(fotoCerita.uri);

    Alert.alert('Simpan foto', hasilPenyimpanan.pesan);
  }

  async function bagikanFotoCerita() {
    const hasilBerbagi = await bagikanFoto(fotoCerita.uri);

    if (!hasilBerbagi.berhasil) {
      Alert.alert('Bagikan foto', hasilBerbagi.pesan);
    }
  }

  if (!izinKamera) {
    return (
      <View style={styles.status}>
        <Text style={styles.teksStatus}>Meminta izin kamera...</Text>
      </View>
    );
  }

  if (!izinKamera.granted) {
    return (
      <View style={styles.status}>
        <Ionicons name="camera-outline" size={48} color="#64748b" />
        <Text style={styles.teksStatus}>Izin kamera diperlukan untuk membuat story.</Text>
        <Pressable style={styles.tombolIzin} onPress={mintaAksesKamera}>
          <Text style={styles.teksTombol}>Izinkan Kamera</Text>
        </Pressable>
      </View>
    );
  }

  if (fotoCerita) {
    return (
      <View style={styles.preview}>
        <Image source={{ uri: fotoCerita.uri }} style={styles.fotoPreview} />
        <Text style={styles.keterangan}>Story sudah di-resize maksimal 800px dan dikompres.</Text>
        <Pressable style={styles.tombolPosting} onPress={jadikanPostingan}>
          <Ionicons name="cloud-upload-outline" size={20} color="#ffffff" />
          <Text style={styles.teksTombol}>Jadikan Post</Text>
        </Pressable>
        <View style={styles.aksiPreview}>
          <Pressable style={styles.tombolPreview} onPress={simpanFoto}>
            <Ionicons name="download-outline" size={20} color="#ffffff" />
            <Text style={styles.teksPreview}>Simpan</Text>
          </Pressable>
          <Pressable style={styles.tombolPreview} onPress={bagikanFotoCerita}>
            <Ionicons name="share-social-outline" size={20} color="#ffffff" />
            <Text style={styles.teksPreview}>Bagikan</Text>
          </Pressable>
          <Pressable style={styles.tombolPreview} onPress={() => setFotoCerita(null)}>
            <Ionicons name="camera-outline" size={20} color="#ffffff" />
            <Text style={styles.teksPreview}>Ulang</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.kameraContainer}>
      {tabSedangAktif ? (
        <CameraView
          ref={referensiKamera}
          style={styles.kamera}
          facing={arahKamera}
          flash={flashAktif ? 'on' : 'off'}
          enableTorch={flashAktif}
        />
      ) : null}
      {hitungMundur !== null ? (
        <View style={styles.lapisanHitungMundur}>
          <Text style={styles.angkaHitungMundur}>{hitungMundur || ''}</Text>
        </View>
      ) : null}
      {pesanKamera ? <Text style={styles.pesanKamera}>{pesanKamera}</Text> : null}
      <View style={styles.kontrol}>
        <Pressable style={styles.tombolKontrol} onPress={() => setFlashAktif(!flashAktif)}>
          <Ionicons name={flashAktif ? 'flash' : 'flash-off'} size={24} color="#ffffff" />
        </Pressable>
        <Pressable style={styles.tombolJepret} onPress={mulaiHitungMundur} disabled={sedangMemotret}>
          <View style={styles.lingkaranJepret} />
        </Pressable>
        <Pressable style={styles.tombolKontrol} onPress={gantiArahKamera}>
          <Ionicons name="camera-reverse-outline" size={26} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    flex: 1,
    gap: 14,
    justifyContent: 'center',
    padding: 25,
  },
  teksStatus: {
    color: '#475569',
    fontSize: 16,
    textAlign: 'center',
  },
  tombolIzin: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  teksTombol: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  kameraContainer: {
    backgroundColor: '#020617',
    flex: 1,
  },
  kamera: {
    flex: 1,
  },
  lapisanHitungMundur: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.32)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  angkaHitungMundur: {
    color: '#ffffff',
    fontSize: 100,
    fontWeight: '800',
  },
  pesanKamera: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    left: 14,
    padding: 10,
    position: 'absolute',
    right: 14,
    top: 14,
  },
  kontrol: {
    alignItems: 'center',
    bottom: 26,
    flexDirection: 'row',
    justifyContent: 'space-around',
    left: 35,
    position: 'absolute',
    right: 35,
  },
  tombolKontrol: {
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderRadius: 27,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  tombolJepret: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 39,
    height: 78,
    justifyContent: 'center',
    width: 78,
  },
  lingkaranJepret: {
    borderColor: '#0f172a',
    borderRadius: 33,
    borderWidth: 2,
    height: 66,
    width: 66,
  },
  preview: {
    backgroundColor: '#020617',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  fotoPreview: {
    aspectRatio: 3 / 4,
    borderRadius: 18,
    resizeMode: 'contain',
    width: '100%',
  },
  keterangan: {
    color: '#e2e8f0',
    marginBottom: 18,
    marginTop: 12,
    textAlign: 'center',
  },
  tombolPosting: {
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  aksiPreview: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  tombolPreview: {
    alignItems: 'center',
    borderColor: '#475569',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    paddingVertical: 11,
  },
  teksPreview: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});
