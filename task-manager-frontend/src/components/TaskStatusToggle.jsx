// src/components/TaskStatusToggle.jsx
import React from 'react';
import './TaskStatusToggle.css'; // Crearemos este archivo CSS en el siguiente sub-paso

// Opciones de estado de la tarea
const STATUS_OPTIONS = [
  { value: false, label: 'En Progreso' },
  { value: true, label: 'Completada' }
];

// Componente que muestra botones de estado.
// Recibe el estado 'completed' actual (boolean) y una función para manejar el cambio.
function TaskStatusToggle({ isCompleted, onToggle }) {
  return (
    <div className="task-status-toggle">
      {/* Mapeamos sobre las opciones de estado para crear un botón por cada una */}
      {STATUS_OPTIONS.map(option => (
        <button
          key={option.value.toString()} // La key debe ser única (convertimos boolean a string)
          type="button" // Importante: es un botón, no de envío de formulario
          // Clase dinámica: 'selected' si el valor coincide con el estado actual
          className={`status-button ${isCompleted === option.value ? 'selected' : ''}`}
          onClick={() => onToggle(option.value)} // Llama a la función onToggle con el nuevo valor (true/false)
        >
          {option.label} {/* Muestra el texto de la opción */}
        </button>
      ))}
    </div>
  );
}

export default TaskStatusToggle;
