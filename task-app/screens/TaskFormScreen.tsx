import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TaskFormScreen({ route }) {
  const navigation = useNavigation();
  const editingTask = route?.params?.task;
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [priority, setPriority] = useState(editingTask?.priority || 'Media');

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }

    const newTask = {
      id: editingTask?.id || Date.now().toString(),
      title,
      description,
      priority,
      status: editingTask?.status || 'Pendiente',
    };

    navigation.navigate('Home', { newTask });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Descripción</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />

      <Text style={styles.label}>Prioridad</Text>
      <TextInput style={styles.input} value={priority} onChangeText={setPriority} />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Tarea</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: 'bold', marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 4,
  },
  button: {
    backgroundColor: '#2563EB', padding: 12, borderRadius: 8, marginTop: 24, alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
