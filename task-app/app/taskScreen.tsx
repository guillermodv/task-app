import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TaskScreen() {
  const { title, description, priority, status } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text>Descripción: {description}</Text>
      <Text>Prioridad: {priority}</Text>
      <Text>Estado: {status}</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F3F4F6' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2563EB',
    borderRadius: 6,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
