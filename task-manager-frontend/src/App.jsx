// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react'; // Importamos useMemo para optimizar el filtrado
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css';

const API_URL = 'http://localhost:3000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NUEVOS ESTADOS PARA BUSCADOR Y FILTROS ---
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el texto de búsqueda
  const [filterPriority, setFilterPriority] = useState('All'); // Estado para el filtro de prioridad ('All', 'Low', 'Medium', 'High')
  const [filterStatus, setFilterStatus] = useState('All'); // Estado para el filtro de estado ('All', 'En Progreso', 'Completada')
  // const [filterDate, setFilterDate] = useState(''); // Estado para el filtro de fecha (si se implementa)
  // ---------------------------------------------


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_URL);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error HTTP! status: ${response.status}, body: ${errorText || 'No response body'}`);
        }

        const data = await response.json();
        const tasksWithDefaults = data.map(task => ({
            ...task,
            priority: task.priority || 'Low',
            createdAt: task.createdAt || new Date().toISOString(),
            completed: task.completed || false,
        }));
        setTasks(tasksWithDefaults);

      } catch (err) {
        console.error("Error cargando tareas:", err);
        setError('No se pudieron cargar las tareas. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // --- Funciones para interactuar con la API (CRUD) ---

  const addTask = async (newTaskData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskData),
      });

      if (!response.ok) {
         const errorText = await response.text();
         throw new Error(`Error HTTP! status: ${response.status}, body: ${errorText || 'No response body'}`);
      }

      const createdTask = await response.json();
      const taskWithDefaults = {
           ...createdTask,
           priority: createdTask.priority || 'Low',
           createdAt: createdTask.createdAt || new Date().toISOString(),
           completed: createdTask.completed || false,
      };
      // Añadir la nueva tarea al principio de la lista para que se vea primero (opcional)
      // setTasks([taskWithDefaults, ...tasks]);
      // O al final, como antes:
      setTasks([...tasks, taskWithDefaults]);

      setError(null);
      console.log("Tarea creada con éxito!"); // Placeholder for toast

    } catch (err) {
      console.error("Error añadiendo tarea:", err);
      setError(`Error al añadir tarea: ${err.message}`);
    }
  };

  const deleteTask = async (taskId) => {
    const isConfirmed = window.confirm(`¿Estás seguro de que quieres eliminar esta tarea?`);
    if (!isConfirmed) { return; }

    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
      });

       if (!response.ok) {
          const errorText = await response.text();
         throw new Error(`Error HTTP! status: ${response.status}, body: ${errorText || 'No response body'}`);
      }

      setTasks(tasks.filter(task => task.id !== taskId));
      setError(null);
      console.log(`Tarea ${taskId} eliminada con éxito!`); // Placeholder for toast

    } catch (err) {
      console.error("Error eliminando tarea:", err);
       setError(`Error al eliminar tarea: ${err.message}`);
    }
  };

  const toggleComplete = async (taskToUpdate) => {
      const newCompletedStatus = !taskToUpdate.completed;
      const updatedData = { completed: newCompletedStatus };

    try {
      const response = await fetch(`${API_URL}/${taskToUpdate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

       if (!response.ok) {
          const errorText = await response.text();
         throw new Error(`Error HTTP! status: ${response.status}, body: ${errorText || 'No response body'}`);
       }

      const updatedTask = await response.json();
       const taskWithDefaults = {
           ...updatedTask,
           priority: updatedTask.priority || 'Low',
           createdAt: updatedTask.createdAt || new Date().toISOString(),
           completed: updatedTask.completed || false,
       };

      setTasks(tasks.map(task =>
        task.id === taskWithDefaults.id ? taskWithDefaults : task
      ));
      setError(null);
       console.log(`Estado de tarea ${taskWithDefaults.id} actualizado a: ${taskWithDefaults.completed}`); // Placeholder for toast


    } catch (err) {
      console.error("Error actualizando estado de completado:", err);
       setError(`Error al actualizar estado: ${err.message}`);
    }
  };

   const editTask = async (taskToUpdate) => {
       const taskId = taskToUpdate.id;

       try {
           const response = await fetch(`${API_URL}/${taskId}`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(taskToUpdate),
           });

            if (!response.ok) {
               const errorText = await response.text();
              throw new Error(`Error HTTP! status: ${response.status}, body: ${errorText || 'No response body'}`);
           }

           const updatedTask = await response.json();
           const taskWithDefaults = {
                ...updatedTask,
                priority: updatedTask.priority || 'Low',
                createdAt: updatedTask.createdAt || new Date().toISOString(),
                completed: updatedTask.completed || false,
           };

           setTasks(tasks.map(task =>
               task.id === taskWithDefaults.id ? taskWithDefaults : task
           ));
           setError(null);
           console.log(`Tarea ${taskId} editada con éxito.`); // Placeholder for toast

       } catch (err) {
           console.error("Error editando tarea:", err);
           setError(`Error al editar tarea: ${err.message}`);
       }
   };

   // --- LÓGICA DE BUSCADOR Y FILTROS ---
   // Usamos useMemo para memoizar el resultado del filtrado.
   // Esto evita recalcular la lista filtrada a menos que 'tasks', 'searchTerm',
   // 'filterPriority' o 'filterStatus' cambien. Optimiza el rendimiento.
   const filteredTasks = useMemo(() => {
       // Empezamos con la lista completa de tareas
       let latestFilteredTasks = tasks;

       // 1. Filtrar por término de búsqueda (título o descripción)
       if (searchTerm) {
           const lowerCaseSearchTerm = searchTerm.toLowerCase();
           latestFilteredTasks = latestFilteredTasks.filter(task =>
               task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
               task.description.toLowerCase().includes(lowerCaseSearchTerm)
           );
       }

       // 2. Filtrar por prioridad
       if (filterPriority !== 'All') {
           latestFilteredTasks = latestFilteredTasks.filter(task =>
               task.priority === filterPriority
           );
       }

       // 3. Filtrar por estado (En Progreso / Completada)
       if (filterStatus !== 'All') {
           // Convertir el string del filtro a boolean para comparar con task.completed
           const isCompletedFilter = filterStatus === 'Completada';
           latestFilteredTasks = latestFilteredTasks.filter(task =>
               task.completed === isCompletedFilter
           );
       }

       // 4. Filtrar por fecha (Placeholder - la lógica real iría aquí si filterDate no está vacío)
       // if (filterDate) {
       //     latestFilteredTasks = latestFilteredTasks.filter(task => {
       //         // Lógica para comparar task.createdAt con filterDate
       //         // Esto puede ser complejo dependiendo de cómo quieras comparar fechas
       //         return task.createdAt.startsWith(filterDate); // Ejemplo simple: coincide con el inicio de la cadena ISO
       //     });
       // }


       return latestFilteredTasks; // Devolvemos la lista de tareas filtradas
   }, [tasks, searchTerm, filterPriority, filterStatus]); // Dependencias de useMemo


   // --- Manejadores para los inputs de filtro ---
   const handleSearchChange = (e) => {
       setSearchTerm(e.target.value); // Actualiza el estado searchTerm al escribir
   };

   const handlePriorityFilterChange = (e) => {
       setFilterPriority(e.target.value); // Actualiza el estado filterPriority
   };

    const handleStatusFilterChange = (e) => {
       setFilterStatus(e.target.value); // Actualiza el estado filterStatus
   };

   // const handleDateFilterChange = (e) => {
   //     setFilterDate(e.target.value); // Actualiza el estado filterDate
   // };

   // Función para limpiar todos los filtros
   const clearFilters = () => {
       setSearchTerm('');
       setFilterPriority('All');
       setFilterStatus('All');
       // setFilterDate('');
   };

   // ------------------------------------------


  // --- Renderizado ---

  return (
    <div className="app-container">
      <h1>Gestor de Tareas</h1>

      <TaskForm onAddTask={addTask} />

      {/* --- Sección para el Buscador y Filtros --- */}
      <div className="filter-sort-section">
          <h3>Buscar y Filtrar Tareas</h3>

          {/* Input de búsqueda por texto */}
          <input
              type="text"
              placeholder="Buscar por título, descripción..."
              value={searchTerm} // El valor del input está controlado por el estado searchTerm
              onChange={handleSearchChange} // Llama al manejador al escribir
          />

          {/* Selector de filtro por Prioridad */}
          <select value={filterPriority} onChange={handlePriorityFilterChange}>
              <option value="All">Todas las Prioridades</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
          </select>

          {/* Selector de filtro por Estado */}
           <select value={filterStatus} onChange={handleStatusFilterChange}>
              <option value="All">Todos los Estados</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completada">Completada</option>
          </select>

          {/* Input de fecha para filtrar (Descomentar y añadir manejador si se implementa) */}
          {/* <input type="date" value={filterDate} onChange={handleDateFilterChange} /> */}

          {/* Botón para limpiar filtros */}
           <button onClick={clearFilters}>Limpiar Filtros</button>

      </div>
      {/* ----------------------------------------------- */}


      {loading && <p>Cargando tareas...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {/* Si NO estamos cargando Y NO hay error, renderizamos la lista de tareas */}
      {/* Ahora pasamos la lista de TAREAS FILTRADAS a TaskList */}
      {!loading && !error && (
        <TaskList
          tasks={filteredTasks} // <--- Pasar la lista de tareas filtradas
          onDelete={deleteTask}
          onEditTask={editTask}
          onToggleComplete={toggleComplete}
        />
      )}

    </div>
  );
}

export default App;
