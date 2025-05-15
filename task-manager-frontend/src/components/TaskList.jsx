// src/components/TaskList.jsx
import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

// TaskList ahora recibe onToggleComplete de nuevo
function TaskList({ tasks, onDelete, onEditTask, onToggleComplete }) { // <--- Añadir onToggleComplete aquí
  if (tasks.length === 0) {
    return <p>No hay tareas aún. ¡Crea una!</p>;
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onEditTask={onEditTask}
          // Pasar onToggleComplete a TaskItem
          onToggleComplete={onToggleComplete} // <--- Pasarla a TaskItem
        />
      ))}
    </div>
  );
}

export default TaskList;
