// src/components/TaskForm.jsx
import React, { useState } from 'react';
// Importamos el componente PrioritySelector
import PrioritySelector from './PrioritySelector';
import './TaskForm.css';

// Array de prioridades (puede ser el mismo que en PrioritySelector)
const PRIORITIES = ['Low', 'Medium', 'High'];

// Componente que contiene el formulario para añadir tareas
function TaskForm({ onAddTask }) {
  // Estados locales para los campos del formulario y la prioridad seleccionada
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // Estado para la prioridad seleccionada, inicializado con la primera prioridad por defecto
  const [selectedPriority, setSelectedPriority] = useState(PRIORITIES[0]);

  // Manejadores de cambio para los inputs
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  // Manejador para la selección de prioridad (pasado a PrioritySelector)
  const handleSelectPriority = (priority) => {
    setSelectedPriority(priority);
  };

  // Manejador para el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación: el título no puede estar vacío (trim para espacios)
    if (!title.trim()) {
      alert('El título de la tarea es requerido.');
      return;
    }

    // Validación: la prioridad debe estar seleccionada (aunque con default siempre habrá una)
    if (!selectedPriority) {
         alert('La prioridad de la tarea es requerida.'); // Esto no debería pasar con el default
         return;
    }


    // Crea un objeto con los datos de la nueva tarea, incluyendo la prioridad
    const newTaskData = {
      title: title.trim(),
      description: description.trim(),
      priority: selectedPriority, // <--- Incluir la prioridad seleccionada
      // El backend añadirá el ID y createdAt, y establecerá completed: false
    };

    // Llama a la función pasada como prop para añadir la tarea
    onAddTask(newTaskData);

    // Limpia el formulario después de enviar
    setTitle('');
    setDescription('');
    // Resetea la prioridad al valor por defecto (el primero del array)
    setSelectedPriority(PRIORITIES[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
   
      <div>
        <label htmlFor="title">Título:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Descripción (Opcional):</label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>

      {/* Incluimos el selector de prioridad, pasándole la prioridad seleccionada y el manejador */}
      <PrioritySelector
         selectedPriority={selectedPriority}
         onSelectPriority={handleSelectPriority}
      />

      <button type="submit">Agregar Tarea</button>
    </form>
  );
}

export default TaskForm;