// server.js

// 1. Importar módulos necesarios
const express = require('express'); // Framework web para Node.js
const { v4: uuidv4 } = require('uuid'); // Para generar IDs únicos
const cors = require('cors'); // Middleware para manejar CORS

// 2. Inicializar la aplicación Express
const app = express();
const PORT = 3000; // Puerto donde escuchará el servidor

// Usar el middleware cors
app.use(cors());

// 3. Middleware para parsear cuerpos de solicitud en JSON
app.use(express.json());

// 4. Array en memoria para almacenar las tareas (persistencia temporal)
let tasks = [];

// --- Rutas (Endpoints de la API) ---

// 5. GET /tasks: Listar todas las tareas
app.get('/tasks', (req, res) => {
  console.log('GET /tasks - Listando tareas');
  res.json(tasks);
});

// 6. POST /tasks: Crear una nueva tarea
app.post('/tasks', (req, res) => {
  console.log('POST /tasks - Creando nueva tarea');
  // Obtenemos el título, descripción y prioridad del cuerpo de la solicitud
  // Ahora la prioridad también es esperada (aunque pondremos un default si no viene)
  const { title, description, priority } = req.body;

  // Validación: Asegurarnos de que el título no esté vacío
  if (!title || title.trim() === '') { // Añadimos trim() para validar espacios en blanco
    console.warn('POST /tasks - Solicitud rechazada: Título requerido');
    return res.status(400).json({ message: 'El título es requerido para crear una tarea.' });
  }

  // Validación básica para prioridad (opcional, si quieres restringir valores)
  // let taskPriority = priority || 'Low'; // Default a 'Low' si no viene
  // if (!['Low', 'Medium', 'High'].includes(taskPriority)) {
  //     taskPriority = 'Low'; // Si viene un valor inválido, default a 'Low'
  // }
  // Simplificamos por ahora, asumimos que el frontend enviará una prioridad válida o 'Low'

  // Creamos el objeto de la nueva tarea
  const newTask = {
    id: uuidv4(), // Generamos un ID único
    title: title.trim(), // Guardamos el título sin espacios extra
    description: description ? description.trim() : '', // Guardamos descripción (trim si existe)
    completed: false, // Por defecto, la tarea no está completada
    priority: priority || 'Low', // <--- NUEVO: Añadir prioridad (default 'Low')
    createdAt: new Date().toISOString() // <--- NUEVO: Añadir fecha de creación en formato ISO
  };

  // Añadimos la nueva tarea al array
  tasks.push(newTask);

  console.log(`POST /tasks - Tarea creada con ID: ${newTask.id}`);
  // Respondemos con un código de estado 201 (Created) y la tarea creada
  res.status(201).json(newTask);
});

// 7. PUT /tasks/:id: Actualizar una tarea existente
app.put('/tasks/:id', (req, res) => {
  // Obtenemos el ID de la tarea de los parámetros de la URL
  const taskId = req.params.id;
  console.log(`PUT /tasks/${taskId} - Actualizando tarea`);

  // Obtenemos los posibles campos a actualizar del cuerpo de la solicitud
  // Ahora incluimos 'priority' en lo que podemos recibir para actualizar
  const { title, description, completed, priority } = req.body;

  // Buscamos el índice de la tarea en el array por su ID
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  // Si la tarea no se encuentra
  if (taskIndex === -1) {
    console.warn(`PUT /tasks/${taskId} - Tarea no encontrada`);
    return res.status(404).json({ message: 'Tarea no encontrada.' });
  }

  // Obtenemos la tarea actual por su índice
  const task = tasks[taskIndex];

  // Validar si se intenta actualizar a un título vacío (si el campo title está presente)
  if (title !== undefined && title.trim() === '') {
       console.warn(`PUT /tasks/${taskId} - Solicitud rechazada: Título no puede estar vacío`);
       return res.status(400).json({ message: 'El título no puede estar vacío.' });
  }

  // Actualizamos los campos de la tarea si vienen en el cuerpo de la solicitud
  // Usamos !== undefined para permitir que se envíe null, false, o 0 si fuera el caso
  if (title !== undefined) {
    task.title = title.trim(); // <--- Usar trim() al actualizar
  }
  if (description !== undefined) {
    task.description = description === null ? '' : description.trim(); // <--- Permitir null y usar trim()
  }
  if (completed !== undefined) {
    task.completed = completed;
  }
  if (priority !== undefined) { // <--- NUEVO: Permitir actualizar prioridad
    // Validación básica para prioridad actualizada (opcional)
    // if (['Low', 'Medium', 'High'].includes(priority)) {
        task.priority = priority;
    // } else {
    //     console.warn(`PUT /tasks/${taskId} - Prioridad inválida recibida: ${priority}`);
    //     // Opcional: enviar un error 400 aquí si quieres ser estricto con la prioridad
    // }
  }

  // Opcional: Podrías actualizar la fecha de modificación aquí si fuera necesario
  // task.updatedAt = new Date().toISOString();

  console.log(`PUT /tasks/${taskId} - Tarea actualizada`);
  // Respondemos con la tarea actualizada
  res.json(task);
});

// 8. DELETE /tasks/:id: Eliminar una tarea
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  console.log(`DELETE /tasks/${taskId} - Eliminando tarea`);
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    console.warn(`DELETE /tasks/${taskId} - Tarea no encontrada`);
    return res.status(404).json({ message: 'Tarea no encontrada.' });
  }

  tasks.splice(taskIndex, 1);
  console.log(`DELETE /tasks/${taskId} - Tarea eliminada`);
  res.json({ message: 'Tarea eliminada correctamente.' });
});


// 9. Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de tareas corriendo en http://localhost:${PORT}`);
});