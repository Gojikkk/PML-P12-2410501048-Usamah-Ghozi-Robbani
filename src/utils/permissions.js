import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import * as Notifications from 'expo-notifications';

export async function mintaIzinGaleri() {
  try {
    const statusIzin = await ImagePicker.requestMediaLibraryPermissionsAsync();

    return statusIzin.granted;
  } catch (kesalahan) {
    return false;
  }
}

export async function mintaIzinLokasi() {
  try {
    const statusIzin = await Location.requestForegroundPermissionsAsync();

    return statusIzin.granted;
  } catch (kesalahan) {
    return false;
  }
}

export async function mintaIzinNotifikasi() {
  try {
    const statusIzinSaatIni = await Notifications.getPermissionsAsync();

    if (statusIzinSaatIni.granted) {
      return true;
    }

    const statusIzinBaru = await Notifications.requestPermissionsAsync();

    return statusIzinBaru.granted;
  } catch (kesalahan) {
    return false;
  }
}

export async function mintaIzinMediaLibrary() {
  try {
    const statusIzin = await MediaLibrary.requestPermissionsAsync(true);

    return statusIzin.granted;
  } catch (kesalahan) {
    return false;
  }
}
