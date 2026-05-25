import { ScrollView, StyleSheet, Text, View } from 'react-native';
import PostScreen from './PostScreen';

export default function HomeScreen({ daftarPostingan, simpanPostingan }) {
  return (
    <ScrollView contentContainerStyle={styles.konten}>
      <View style={styles.sambutan}>
        <Text style={styles.judul}>SocialApp</Text>
        <Text style={styles.subjudul}>Bagikan momen terbaru bersama temanmu.</Text>
      </View>
      <PostScreen
        daftarPostingan={daftarPostingan}
        simpanPostingan={simpanPostingan}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  konten: {
    padding: 16,
    paddingBottom: 30,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
  },
  sambutan: {
    marginBottom: 18,
  },
  judul: {
    color: '#0f172a',
    fontSize: 27,
    fontWeight: '800',
  },
  subjudul: {
    color: '#64748b',
    fontSize: 15,
    marginTop: 5,
  },
});
