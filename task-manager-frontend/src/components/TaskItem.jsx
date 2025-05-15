// src/components/TaskItem.jsx
import React, { useState, useEffect } from 'react';
import PrioritySelector from './PrioritySelector';
import TaskStatusToggle from './TaskStatusToggle'; // Asegúrate de importar TaskStatusToggle
import './TaskItem.css';

const PRIORITIES = ['Low', 'Medium', 'High'];
const DESCRIPTION_TRUNCATE_LIMIT = 100;


function TaskItem({ task, onDelete, onEditTask, onToggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedPriority, setEditedPriority] = useState(task.priority || PRIORITIES[0]);

  const [hasChanges, setHasChanges] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const changesDetected =
      editedTitle.trim() !== task.title.trim() ||
      editedDescription.trim() !== task.description.trim() ||
      editedPriority !== (task.priority || PRIORITIES[0]);

    setHasChanges(changesDetected);

  }, [editedTitle, editedDescription, editedPriority, task]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedPriority(task.priority || PRIORITIES[0]);
    setHasChanges(false);
    setIsDescriptionExpanded(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedPriority(task.priority || PRIORITIES[0]);
    setHasChanges(false);
  };

  const handleSaveClick = () => {
    if (!editedTitle.trim()) {
      alert('El título no puede estar vacío.');
      return;
    }
     if (!editedPriority) {
         alert('La prioridad es requerida.');
         return;
     }
     if (!hasChanges) {
         console.log("No hay cambios para guardar.");
         setIsEditing(false);
         return;
     }

    const updatedTaskData = {
      id: task.id,
      title: editedTitle.trim(),
      description: editedDescription.trim(),
      priority: editedPriority,
      completed: task.completed,
      createdAt: task.createdAt
    };

    onEditTask(updatedTaskData);

    setIsEditing(false);
    setHasChanges(false);
  };

   const formatDate = (dateString) => {
       if (!dateString) return 'Fecha no disponible';
       try {
           const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
           const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Fecha inválida';
           return date.toLocaleDateString(undefined, options);
       } catch (error) {
           console.error("Error formatting date:", error);
           return 'Fecha inválida';
       }
   };

    const isDescriptionLong = task.description && task.description.length > DESCRIPTION_TRUNCATE_LIMIT;
    const displayedDescription = isDescriptionLong && !isDescriptionExpanded
        ? task.description.substring(0, DESCRIPTION_TRUNCATE_LIMIT) + '...'
        : task.description;

    const toggleDescriptionExpansion = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };


  return (
    // Añadir la clase 'is-editing' si isEditing es true
    <div className={`task-item ${task.completed ? 'completed' : ''} ${isEditing ? 'is-editing' : ''}`}> {/* <--- MODIFICADO */}
      {isEditing ? (
        // --- Modo de Edición ---
        <div className="edit-form-container">
           <h3>Editar Tarea</h3>
          <div>
            <label htmlFor={`edit-title-${task.id}`}>Título:</label>
            <input
              id={`edit-title-${task.id}`}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor={`edit-description-${task.id}`}>Descripción:</label>
            <textarea
              id={`edit-description-${task.id}`}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </div>

          <PrioritySelector
            selectedPriority={editedPriority}
            onSelectPriority={setEditedPriority}
          />

          <div className="edit-buttons">
              <button onClick={handleCancelClick} className="cancel-button">Cancelar</button>
              <button
                 onClick={handleSaveClick}
                 className="save-button"
                 disabled={!hasChanges || editedTitle.trim() === ''}
              >
                 Guardar
             </button>
          </div>
        </div>
      ) : (
        // --- Modo de Visualización ---
        <>
          <div className="task-details-view">
            <h3>{task.title}</h3>
            {task.description && (
                <p>
                    {displayedDescription}
                    {isDescriptionLong && (
                        <span onClick={toggleDescriptionExpansion} className="toggle-description">
                            {isDescriptionExpanded ? ' Ver menos' : ' Ver más'}
                        </span>
                    )}
                </p>
            )}

            {/* Contenedor para meta-información (Prioridad, Fecha, Estado) */}
            <div className="task-meta">
                {/* Etiqueta de prioridad */}
                <span className={`priority-tag ${task.priority ? task.priority.toLowerCase() : 'low'}`}>
                    {task.priority || 'Low'}
                </span>
                 {/* Fecha de creación */}
                <span className="created-date">
                   Creada el: {formatDate(task.createdAt)}
                </span>
                {/* Toggle de Estado */}
                 <TaskStatusToggle
                    isCompleted={task.completed}
                    onToggle={() => onToggleComplete(task)}
                 />
            </div>
          </div>

          {/* Botones de acción: Editar y Eliminar */}
          <div className="action-buttons">
              <button onClick={handleEditClick} className="edit-button">
                  ✏️
              </button>
              <button onClick={() => onDelete(task.id)} className="delete-button">
                Eliminar
              </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem;
