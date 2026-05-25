import { Platform } from 'react-native';
import { isRunningInExpoGo } from 'expo';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { mintaIzinNotifikasi } from './permissions';

function aplikasiMenggunakanExpoGoAndroid() {
  return (
    Platform.OS === 'android' &&
    isRunningInExpoGo()
  );
}

export async function bersihkanRegistrasiPushExpoGo() {
  if (!aplikasiMenggunakanExpoGoAndroid()) {
    return;
  }

  try {
    await Notifications.setAutoServerRegistrationEnabledAsync(false);
  } catch (kesalahan) {
    return;
  }
}

export async function registrasiPushToken() {
  const menggunakanExpoGoAndroid =
    aplikasiMenggunakanExpoGoAndroid();

  if (menggunakanExpoGoAndroid) {
    await bersihkanRegistrasiPushExpoGo();
    return {
      tokenPush: null,
      pesan: 'Notifikasi lokal dapat diuji di Expo Go. Push token Android memerlukan development build.',
    };
  }

  if (!Device.isDevice) {
    return {
      tokenPush: null,
      pesan: 'Push token hanya tersedia pada perangkat fisik.',
    };
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('pesan', {
      name: 'Pesan Masuk',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4f46e5',
    });
  }

  const izinDiberikan = await mintaIzinNotifikasi();

  if (!izinDiberikan) {
    return {
      tokenPush: null,
      pesan: 'Izin notifikasi ditolak. Notifikasi tidak dapat ditampilkan.',
    };
  }

  try {
    const tokenTerdaftar = await Notifications.getExpoPushTokenAsync();

    return {
      tokenPush: tokenTerdaftar.data,
      pesan: 'Push token berhasil didaftarkan.',
    };
  } catch (kesalahan) {
    return {
      tokenPush: null,
      pesan: 'Izin aktif. Token push memerlukan development build dan konfigurasi proyek.',
    };
  }
}

export async function kirimNotifikasi() {
  const izinDiberikan = await mintaIzinNotifikasi();

  if (!izinDiberikan) {
    return {
      berhasil: false,
      pesan: 'Izin notifikasi diperlukan untuk mengirim notifikasi tes.',
    };
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('pesan', {
      name: 'Pesan Masuk',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Pesan baru dari Dinda',
      body: 'Hai, postingan barumu keren!',
      data: {
        layar: 'Profile',
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
      channelId: Platform.OS === 'android' ? 'pesan' : undefined,
    },
  });

  return {
    berhasil: true,
    pesan: 'Notifikasi chat akan muncul sebentar lagi.',
  };
}
