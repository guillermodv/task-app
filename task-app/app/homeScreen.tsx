import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Switch,
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
  const [status, setStatus] = useState('Pendiente');
  const [darkMode, setDarkMode] = useState(false);
  const [errors, setErrors] = useState({ title: '', description: '', priority: '', status: '' });
  const [editingTaskId, setEditingTaskId] = useState(null);

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

  const handleAddOrUpdateTask = () => {
    let valid = true;
    let newErrors = { title: '', description: '', priority: '', status: '' };

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
    const validStatuses = ['Pendiente', 'Completada'];
    if (!validPriorities.includes(priority)) {
      newErrors.priority = 'Seleccioná una prioridad válida.';
      valid = false;
    }

    if (!validStatuses.includes(status)) {
      newErrors.status = 'Seleccioná un estado válido.';
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTaskId
            ? { ...t, title, description, priority, status }
            : t
        )
      );
      setEditingTaskId(null);
    } else {
      const newTask = {
        id: Date.now().toString(),
        title,
        description,
        priority,
        status,
      };
      setTasks((prev) => [...prev, newTask]);
    }

    setTitle('');
    setDescription('');
    setPriority('Media');
    setStatus('Pendiente');
    setErrors({ title: '', description: '', priority: '', status: '' });
    Keyboard.dismiss();
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleEditTask = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setStatus(task.status);
    setEditingTaskId(task.id);
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
      case 'Urgente': return '#DC2626';
      case 'Media': return '#FBBF24';
      case 'Baja': return '#22C55E';
      default: return '#9CA3AF';
    }
  };

  const renderTask = ({ item }) => (
    <View style={[styles.taskCard, darkMode && styles.taskCardDark]}>
      <TouchableOpacity onPress={() => goToTask(item)}>
        <View style={styles.taskHeader}>
          <View style={[styles.circle, { backgroundColor: renderPriorityColor(item.priority) }]} />
          <Text style={[styles.taskTitle, darkMode && styles.textDark]}>{item.title}</Text>
        </View>
        <Text style={darkMode && styles.textDark}>{item.description}</Text>
        <Text style={darkMode && styles.textDark}>Prioridad: {item.priority}</Text>
        <Text style={darkMode && styles.textDark}>Estado: {item.status}</Text>
      </TouchableOpacity>
      <View style={styles.taskActions}>
        <TouchableOpacity onPress={() => handleEditTask(item)}>
          <Text style={styles.actionButton}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
          <Text style={styles.actionButton}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, darkMode ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.header, darkMode && styles.textDark]}>Gestor de Tareas</Text>

      <View style={styles.filters}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.filterBtn}>Modo Oscuro</Text>
          &nbsp;&nbsp;
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      <Text style={[styles.subheader, darkMode && styles.textDark]}>Filtros de tareas.</Text>
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
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, darkMode && { backgroundColor: '#4B5563', color: '#F9FAFB' }]}
          placeholder="Título"
          placeholderTextColor={darkMode ? '#9CA3AF' : '#6B7280'}
          value={title}
          onChangeText={setTitle}
        />
        {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

        <TextInput
          style={[styles.input, darkMode && { backgroundColor: '#4B5563', color: '#F9FAFB' }]}
          placeholder="Descripción"
          placeholderTextColor={darkMode ? '#9CA3AF' : '#6B7280'}
          value={description}
          onChangeText={setDescription}
        />
        {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}

        <View style={[styles.pickerContainer, darkMode && { backgroundColor: '#4B5563' }]}>
          <Picker selectedValue={priority} onValueChange={setPriority} style={{ height: 50 }}>
            <Picker.Item label="Urgente" value="Urgente" />
            <Picker.Item label="Media" value="Media" />
            <Picker.Item label="Baja" value="Baja" />
          </Picker>
        </View>
        {errors.priority ? <Text style={styles.errorText}>{errors.priority}</Text> : null}

        <View style={[styles.pickerContainer, darkMode && { backgroundColor: '#4B5563' }]}>
          <Picker selectedValue={status} onValueChange={setStatus} style={{ height: 50 }}>
            <Picker.Item label="Pendiente" value="Pendiente" />
            <Picker.Item label="Completada" value="Completada" />
          </Picker>
        </View>
        {errors.status ? <Text style={styles.errorText}>{errors.status}</Text> : null}

        <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdateTask}>
          <Text style={styles.addButtonText}>
            {editingTaskId ? 'Actualizar Tarea' : 'Agregar Tarea'}
          </Text>
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
  subheader: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  filters: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  filterBtn: { color: '#2563EB' },
  inputContainer: { gap: 8, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 8,
    height: 50,
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
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    fontSize: 18,
  },
});
