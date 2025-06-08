import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FilterBar({ filter, setFilter }) {
  const toggleStatus = () => {
    setFilter((f) => ({
      ...f,
      status: f.status === 'Todos' ? 'Pendiente' : f.status === 'Pendiente' ? 'Completada' : 'Todos',
    }));
  };

  const togglePriority = () => {
    const next =
      filter.priority === 'Todas'
        ? 'Alta'
        : filter.priority === 'Alta'
        ? 'Media'
        : filter.priority === 'Media'
        ? 'Baja'
        : 'Todas';
    setFilter((f) => ({ ...f, priority: next }));
  };

  return (
    <View style={styles.filters}>
      <TouchableOpacity onPress={toggleStatus}>
        <Text style={styles.btn}>Filtro Estado: {filter.status}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={togglePriority}>
        <Text style={styles.btn}>Filtro Prioridad: {filter.priority}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  btn: { color: '#2563EB', fontWeight: 'bold' },
});
