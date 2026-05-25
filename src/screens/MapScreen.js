import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import useLocation from '../hooks/useLocation';

export default function MapScreen() {
  const tabSedangAktif = useIsFocused();
  const {
    lokasiPengguna,
    pesanLokasi,
    sedangMemuatLokasi,
  } = useLocation(tabSedangAktif);

  const daftarPenggunaSekitar = useMemo(() => {
    if (!lokasiPengguna) {
      return [];
    }

    return [
      {
        id: 'dewi',
        nama: 'Dewi',
        latitude: lokasiPengguna.latitude + 0.0015,
        longitude: lokasiPengguna.longitude + 0.0012,
      },
      {
        id: 'rama',
        nama: 'Rama',
        latitude: lokasiPengguna.latitude - 0.0011,
        longitude: lokasiPengguna.longitude + 0.0018,
      },
      {
        id: 'sinta',
        nama: 'Sinta',
        latitude: lokasiPengguna.latitude + 0.001,
        longitude: lokasiPengguna.longitude - 0.0017,
      },
    ];
  }, [lokasiPengguna]);

  if (pesanLokasi) {
    return (
      <View style={styles.status}>
        <Ionicons name="location-outline" size={47} color="#64748b" />
        <Text style={styles.teksStatus}>{pesanLokasi}</Text>
      </View>
    );
  }

  if (sedangMemuatLokasi || !lokasiPengguna) {
    return (
      <View style={styles.status}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.teksStatus}>Mengambil lokasi Anda...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.peta}
        region={{
          latitude: lokasiPengguna.latitude,
          longitude: lokasiPengguna.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }}
      >
        <Marker
          coordinate={{
            latitude: lokasiPengguna.latitude,
            longitude: lokasiPengguna.longitude,
          }}
          title="Lokasi Anda"
          pinColor="#4f46e5"
        />
        {daftarPenggunaSekitar.map((pengguna) => (
          <Marker
            key={pengguna.id}
            coordinate={{
              latitude: pengguna.latitude,
              longitude: pengguna.longitude,
            }}
            title={pengguna.nama}
            description="Pengguna di sekitar Anda"
          />
        ))}
      </MapView>
      <View style={styles.label}>
        <Text style={styles.judulLabel}>Nearby Users</Text>
        <Text style={styles.teksLabel}>{daftarPenggunaSekitar.length} teman berada di sekitar Anda</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  peta: {
    flex: 1,
  },
  status: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    flex: 1,
    gap: 14,
    justifyContent: 'center',
    padding: 26,
  },
  teksStatus: {
    color: '#475569',
    fontSize: 16,
    textAlign: 'center',
  },
  label: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    bottom: 18,
    left: 16,
    padding: 14,
    position: 'absolute',
    right: 16,
  },
  judulLabel: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  teksLabel: {
    color: '#64748b',
    marginTop: 4,
  },
});
