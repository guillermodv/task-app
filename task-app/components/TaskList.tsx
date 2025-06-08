import { FlatList, Text } from 'react-native';
import TaskCard from './TaskCard';

export default function TaskList({ tasks, onToggleStatus, onEdit }) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskCard task={item} onToggleStatus={onToggleStatus} onEdit={onEdit} />
      )}
      ListEmptyComponent={<Text>No hay tareas.</Text>}
    />
  );
}
