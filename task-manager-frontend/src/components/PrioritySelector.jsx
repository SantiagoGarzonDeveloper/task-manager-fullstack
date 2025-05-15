// src/components/PrioritySelector.jsx
import React from 'react';
import './PrioritySelector.css'; // Crearemos este CSS en el siguiente sub-paso

// Array de prioridades disponibles
const PRIORITIES = ['Low', 'Medium', 'High'];

// Componente que muestra botones de prioridad.
// Recibe la prioridad seleccionada actualmente y una función para manejar el cambio.
function PrioritySelector({ selectedPriority, onSelectPriority }) {
  return (
    <div className="priority-selector">
      <label>Prioridad:</label>
      <div className="priority-buttons">
        {/* Mapeamos sobre el array de prioridades para crear un botón por cada una */}
        {PRIORITIES.map(priority => (
          <button
            key={priority} // La key es importante para las listas
            type="button" // Importante: es un botón, no de envío de formulario
            className={`priority-button ${selectedPriority === priority ? 'selected' : ''} ${priority.toLowerCase()}`}
            onClick={() => onSelectPriority(priority)} // Llama a la función padre al hacer clic
          >
            {priority} {/* Muestra el texto de la prioridad */}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PrioritySelector;