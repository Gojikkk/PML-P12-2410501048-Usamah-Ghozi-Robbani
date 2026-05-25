import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { registrasiPushToken } from '../utils/notifications';

export default function useNotifications(dengarkanNotifikasi) {
  const [tokenPush, setTokenPush] = useState(null);
  const [pesanNotifikasi, setPesanNotifikasi] = useState('');
  const [notifikasiTerbaru, setNotifikasiTerbaru] = useState(null);

  useEffect(() => {
    let layarMasihAktif = true;
    let listenerNotifikasiMasuk = null;
    let listenerResponsNotifikasi = null;

    async function aktifkanNotifikasi() {
      const hasilRegistrasi = await registrasiPushToken();

      if (layarMasihAktif) {
        setTokenPush(hasilRegistrasi.tokenPush);
        setPesanNotifikasi(hasilRegistrasi.pesan);
      }
    }

    if (dengarkanNotifikasi) {
      aktifkanNotifikasi().catch(() => {
        if (layarMasihAktif) {
          setPesanNotifikasi('Notifikasi tidak dapat diaktifkan saat ini.');
        }
      });

      listenerNotifikasiMasuk = Notifications.addNotificationReceivedListener((notifikasi) => {
        setNotifikasiTerbaru(notifikasi.request.content);
      });

      listenerResponsNotifikasi = Notifications.addNotificationResponseReceivedListener((responsNotifikasi) => {
        setNotifikasiTerbaru(responsNotifikasi.notification.request.content);
      });
    }

    return () => {
      layarMasihAktif = false;

      if (listenerNotifikasiMasuk) {
        listenerNotifikasiMasuk.remove();
      }

      if (listenerResponsNotifikasi) {
        listenerResponsNotifikasi.remove();
      }
    };
  }, [dengarkanNotifikasi]);

  return {
    tokenPush,
    pesanNotifikasi,
    notifikasiTerbaru,
  };
}
