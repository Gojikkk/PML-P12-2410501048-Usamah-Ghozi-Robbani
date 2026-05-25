import { useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import MapScreen from './src/screens/MapScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { bacaDaftarPostingan, simpanDaftarPostingan } from './src/utils/fileSystem';
import { bersihkanRegistrasiPushExpoGo } from './src/utils/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const Tab = createBottomTabNavigator();
const referensiNavigasi = createNavigationContainerRef();

const ikonTab = {
  Home: 'home',
  Camera: 'camera',
  Map: 'map',
  Profile: 'person',
};

export default function App() {
  const [daftarPostingan, setDaftarPostingan] = useState([]);
  const tautanTertunda = useRef(null);

  useEffect(() => {
    let aplikasiAktif = true;

    bersihkanRegistrasiPushExpoGo();

    bacaDaftarPostingan().then((postinganTersimpan) => {
      if (aplikasiAktif) {
        setDaftarPostingan(postinganTersimpan);
      }
    });

    return () => {
      aplikasiAktif = false;
    };
  }, []);

  useEffect(() => {
    function bukaTautan(tautan) {
      const jalurTujuan = tautan.replace('socialapp://', '').split(/[/?#]/)[0].toLowerCase();

      if (jalurTujuan !== 'profile') {
        return;
      }

      if (referensiNavigasi.isReady()) {
        referensiNavigasi.navigate('Profile');
      } else {
        tautanTertunda.current = tautan;
      }
    }

    Linking.getInitialURL().then((tautanAwal) => {
      if (tautanAwal) {
        bukaTautan(tautanAwal);
      }
    });

    const listenerTautan = Linking.addEventListener('url', ({ url }) => {
      bukaTautan(url);
    });

    return () => {
      listenerTautan.remove();
    };
  }, []);

  async function simpanPostingan(postinganBaru) {
    const postinganTerbaru = [postinganBaru, ...daftarPostingan];
    const berhasilDisimpan = simpanDaftarPostingan(postinganTerbaru);

    if (berhasilDisimpan) {
      setDaftarPostingan(postinganTerbaru);
    }

    return berhasilDisimpan;
  }

  function tanganiNavigasiSiap() {
    if (tautanTertunda.current) {
      referensiNavigasi.navigate('Profile');
      tautanTertunda.current = null;
    }
  }

  return (
    <NavigationContainer ref={referensiNavigasi} onReady={tanganiNavigasiSiap}>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTitleStyle: {
            fontWeight: '700',
          },
          tabBarActiveTintColor: '#4f46e5',
          tabBarInactiveTintColor: '#64748b',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={ikonTab[route.name]} color={color} size={size} />
          ),
        })}
      >
        <Tab.Screen name="Home">
          {() => (
            <HomeScreen
              daftarPostingan={daftarPostingan}
              simpanPostingan={simpanPostingan}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Camera">
          {({ navigation }) => (
            <CameraScreen
              navigation={navigation}
              simpanPostingan={simpanPostingan}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Profile">
          {() => <ProfileScreen daftarPostingan={daftarPostingan} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
