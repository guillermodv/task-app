// screens/HomeScreen.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ priority: 'Todas', status: 'Todos' });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Media');

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      const storedMode = await AsyncStorage.getItem('darkMode');
      if (storedMode) setDarkMode(JSON.parse(storedMode));
    };
    loadPreferences();

    const defaultTasks = [
      {
        id: '1',
        title: 'Tarea ejemplo 1',
        description: 'Descripción de tarea 1',
        priority: 'Alta',
        status: 'Pendiente',
      },
      {
        id: '2',
        title: 'Tarea ejemplo 2',
        description: 'Descripción de tarea 2',
        priority: 'Media',
        status: 'Completada',
      },
    ];
    setTasks(defaultTasks);
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    await AsyncStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  const toggleStatus = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: task.status === 'Pendiente' ? 'Completada' : 'Pendiente' }
          : task
      )
    );
  };

  const handleAddTask = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'La descripción es obligatoria');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      status: 'Pendiente',
    };

    setTasks((prev) => [...prev, newTask]);
    setTitle('');
    setDescription('');
    setPriority('Media');
    Keyboard.dismiss();
  };

  const filteredTasks = tasks.filter((task) => {
    const matchPriority = filter.priority === 'Todas' || task.priority === filter.priority;
    const matchStatus = filter.status === 'Todos' || task.status === filter.status;
    return matchPriority && matchStatus;
  });

  const renderTask = ({ item }) => (
    <TouchableOpacity onPress={() => toggleStatus(item.id)}>
      <View style={[styles.taskCard, darkMode && styles.taskCardDark]}>
        <Text style={[styles.taskTitle, darkMode && styles.textDark]}>{item.title}</Text>
        <Text style={darkMode && styles.textDark}>{item.description}</Text>
        <Text style={darkMode && styles.textDark}>Prioridad: {item.priority}</Text>
        <Text style={darkMode && styles.textDark}>Estado: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, darkMode ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.header, darkMode && styles.textDark]}>Gestor de Tareas</Text>

      {/* Filtros */}
      <View style={styles.filters}>
        <TouchableOpacity
          onPress={() =>
            setFilter((f) => ({
              ...f,
              status: f.status === 'Todos' ? 'Pendiente' : f.status === 'Pendiente' ? 'Completada' : 'Todos',
            }))
          }
        >
          <Text style={styles.filterBtn}>Estado: {filter.status}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setFilter((f) => {
              const next =
                f.priority === 'Todas' ? 'Alta' : f.priority === 'Alta' ? 'Media' : f.priority === 'Media' ? 'Baja' : 'Todas';
              return { ...f, priority: next };
            })
          }
        >
          <Text style={styles.filterBtn}>Prioridad: {filter.priority}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleDarkMode}>
          <Text style={styles.filterBtn}>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</Text>
        </TouchableOpacity>
      </View>

      {/* Inputs para nueva tarea */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Prioridad (Alta, Media, Baja)"
          value={priority}
          onChangeText={setPriority}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Agregar Tarea</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tareas */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        ListEmptyComponent={<Text style={darkMode && styles.textDark}>No hay tareas.</Text>}
        style={{ marginTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  containerLight: { backgroundColor: '#F3F4F6' },
  containerDark: { backgroundColor: '#1F2937' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  filters: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  filterBtn: { color: '#2563EB', fontWeight: 'bold' },
  inputContainer: { gap: 8, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { color: '#FFF', fontWeight: 'bold' },
  taskCard: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  taskCardDark: {
    backgroundColor: '#374151',
  },
  taskTitle: { fontWeight: '600', fontSize: 16 },
  textDark: { color: '#F9FAFB' },
});
