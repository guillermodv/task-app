import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ priority: 'Todas', status: 'Todos' });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Media');
  const [darkMode, setDarkMode] = useState(false);
  const [errors, setErrors] = useState({ title: '', description: '', priority: '' });
  const router = useRouter();

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
        priority: 'Urgente',
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

  const handleAddTask = () => {
    let valid = true;
    let newErrors = { title: '', description: '', priority: '' };

    if (!title.trim()) {
      newErrors.title = 'El título es obligatorio.';
      valid = false;
    } else if (title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres.';
      valid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'La descripción es obligatoria.';
      valid = false;
    } else if (description.trim().length < 5) {
      newErrors.description = 'La descripción debe tener al menos 5 caracteres.';
      valid = false;
    }

    const validPriorities = ['Urgente', 'Media', 'Baja'];
    if (!validPriorities.includes(priority)) {
      newErrors.priority = 'Seleccioná una prioridad válida.';
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

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
    setErrors({ title: '', description: '', priority: '' });
    Keyboard.dismiss();
  };

  const goToTask = (task) => {
    router.push({
      pathname: '/taskScreen',
      params: task,
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchPriority = filter.priority === 'Todas' || task.priority === filter.priority;
    const matchStatus = filter.status === 'Todos' || task.status === filter.status;
    return matchPriority && matchStatus;
  });

  const renderPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgente': return '#DC2626'; // rojo
      case 'Media': return '#FBBF24'; // amarillo
      case 'Baja': return '#22C55E'; // verde
      default: return '#9CA3AF';
    }
  };

  const renderTask = ({ item }) => (
    <TouchableOpacity onPress={() => goToTask(item)}>
      <View style={[styles.taskCard, darkMode && styles.taskCardDark]}>
        <View style={styles.taskHeader}>
          <View style={[styles.circle, { backgroundColor: renderPriorityColor(item.priority) }]} />
          <Text style={[styles.taskTitle, darkMode && styles.textDark]}>{item.title}</Text>
        </View>
        <Text style={darkMode && styles.textDark}>{item.description}</Text>
        <Text style={darkMode && styles.textDark}>Prioridad: {item.priority}</Text>
        <Text style={darkMode && styles.textDark}>Estado: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, darkMode ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.header, darkMode && styles.textDark]}>Gestor de Tareas</Text>

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
          onPress={() => {
            const next =
              filter.priority === 'Todas' ? 'Urgente' :
              filter.priority === 'Urgente' ? 'Media' :
              filter.priority === 'Media' ? 'Baja' : 'Todas';
            setFilter({ ...filter, priority: next });
          }}
        >
          <Text style={styles.filterBtn}>Prioridad: {filter.priority}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleDarkMode}>
          <Text style={styles.filterBtn}>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
        />
        {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
        />
        {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={priority}
            onValueChange={(itemValue) => setPriority(itemValue)}
            style={{ height: 40 }}
          >
            <Picker.Item label="Urgente" value="Urgente" />
            <Picker.Item label="Media" value="Media" />
            <Picker.Item label="Baja" value="Baja" />
          </Picker>
        </View>
        {errors.priority ? <Text style={styles.errorText}>{errors.priority}</Text> : null}

        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Agregar Tarea</Text>
        </TouchableOpacity>
      </View>

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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
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
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  taskTitle: { fontWeight: '600', fontSize: 16 },
  textDark: { color: '#F9FAFB' },
  errorText: { color: '#DC2626', fontSize: 12, marginTop: -6, marginBottom: 6 },
});
