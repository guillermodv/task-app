import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TaskCard({ task, onToggleStatus, onEdit }) {
  return (
    <TouchableOpacity onPress={() => onToggleStatus(task.id)} onLongPress={() => onEdit(task)}>
      <View style={styles.card}>
        <Text style={styles.title}>{task.title}</Text>
        <Text>{task.description}</Text>
        <Text>Prioridad: {task.priority}</Text>
        <Text>Estado: {task.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 12 },
  title: { fontWeight: '600', fontSize: 16 },
});
