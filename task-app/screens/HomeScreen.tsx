import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const colorScheme = useColorScheme();

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ priority: 'Todas', status: 'Todos' });

  useEffect(() => {
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
      {
        id: '3',
        title: 'Tarea ejemplo 3',
        description: 'Descripción de tarea 3',
        priority: 'Baja',
        status: 'Pendiente',
      },
    ];
    setTasks(defaultTasks);
  }, []);

  // Agregar o actualizar tareas nuevas desde TaskForm
  useEffect(() => {
    if (route.params?.newTask) {
      setTasks((prev) => {
        const exists = prev.some((t) => t.id === route.params.newTask.id);
        return exists
          ? prev.map((t) => (t.id === route.params.newTask.id ? route.params.newTask : t))
          : [...prev, route.params.newTask];
      });
    }
  }, [route.params?.newTask]);

  // Alternar estado de tarea (Pendiente <-> Completada)
  const toggleStatus = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: task.status === 'Pendiente' ? 'Completada' : 'Pendiente' }
          : task
      )
    );
  };

  // Aplicar filtros
  const filteredTasks = tasks.filter((task) => {
    const matchPriority = filter.priority === 'Todas' || task.priority === filter.priority;
    const matchStatus = filter.status === 'Todos' || task.status === filter.status;
    return matchPriority && matchStatus;
  });

  // Renderizar cada tarea
  const renderTask = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleStatus(item.id)}
      onLongPress={() => navigation.navigate('TaskForm', { task: item })}
    >
      <View style={styles.taskCard}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text>Prioridad: {item.priority}</Text>
        <Text>Estado: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, colorScheme === 'dark' && styles.containerDark]}>
      <Text style={styles.header}>Gestor de Tareas</Text>

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
          <Text style={styles.filterBtn}>Filtro Estado: {filter.status}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setFilter((f) => {
              const nextPriority =
                f.priority === 'Todas'
                  ? 'Alta'
                  : f.priority === 'Alta'
                  ? 'Media'
                  : f.priority === 'Media'
                  ? 'Baja'
                  : 'Todas';
              return { ...f, priority: nextPriority };
            })
          }
        >
          <Text style={styles.filterBtn}>Filtro Prioridad: {filter.priority}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        ListEmptyComponent={<Text>No hay tareas.</Text>}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('TaskForm')}>
        <Text style={styles.addButtonText}>+ Nueva Tarea</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F3F4F6' },
  containerDark: { backgroundColor: '#1F2937' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  taskCard: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 12 },
  taskTitle: { fontWeight: '600', fontSize: 16 },
  addButton: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  addButtonText: { color: '#FFF', fontWeight: 'bold' },
  filters: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  filterBtn: { color: '#2563EB', fontWeight: 'bold' },
});
