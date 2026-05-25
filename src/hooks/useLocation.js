import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { mintaIzinLokasi } from '../utils/permissions';

export default function useLocation(pantauLokasi) {
  const [lokasiPengguna, setLokasiPengguna] = useState(null);
  const [pesanLokasi, setPesanLokasi] = useState('');
  const [sedangMemuatLokasi, setSedangMemuatLokasi] = useState(false);

  useEffect(() => {
    let layarMasihAktif = true;
    let watcherLokasi = null;

    async function mulaiPantauanLokasi() {
      setSedangMemuatLokasi(true);
      setPesanLokasi('');

      const izinDiberikan = await mintaIzinLokasi();

      if (!layarMasihAktif) {
        return;
      }

      if (!izinDiberikan) {
        setPesanLokasi('Izin lokasi ditolak. Peta pengguna sekitar tidak dapat ditampilkan.');
        setSedangMemuatLokasi(false);
        return;
      }

      watcherLokasi = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 4000,
          distanceInterval: 5,
        },
        (lokasiTerbaru) => {
          if (layarMasihAktif) {
            setLokasiPengguna(lokasiTerbaru.coords);
            setSedangMemuatLokasi(false);
          }
        }
      );

      if (!layarMasihAktif) {
        watcherLokasi.remove();
      }
    }

    if (pantauLokasi) {
      mulaiPantauanLokasi().catch(() => {
        if (layarMasihAktif) {
          setPesanLokasi('Lokasi tidak dapat diambil saat ini.');
          setSedangMemuatLokasi(false);
        }
      });
    }

    return () => {
      layarMasihAktif = false;

      if (watcherLokasi) {
        watcherLokasi.remove();
      }
    };
  }, [pantauLokasi]);

  return {
    lokasiPengguna,
    pesanLokasi,
    sedangMemuatLokasi,
  };
}
