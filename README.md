# Gestor de Tareas Full-Stack

Este proyecto es una aplicación web completa (Full-Stack) para gestionar tareas pendientes (To-Do List). Consiste en un backend simple desarrollado con Node.js y Express, y un frontend interactivo construido con React. La aplicación permite crear, visualizar, editar, eliminar y reordenar tareas, así como filtrarlas y buscarlas.

**Nota Importante:** La persistencia de las tareas se maneja actualmente en el **frontend** utilizando el almacenamiento local del navegador (`localStorage`). El backend solo proporciona una API básica que ya no se utiliza para las operaciones CRUD de tareas en la versión actual del frontend.

## Características

* **Creación de Tareas:** Añade nuevas tareas con título, descripción y prioridad.

* **Visualización de Tareas:** Lista todas las tareas con sus detalles, prioridad y fecha de creación.

* **Edición de Tareas:** Modifica el título, descripción y prioridad de las tareas existentes.

* **Eliminación de Tareas:** Borra tareas individualmente.

* **Toggle de Estado:** Cambia visualmente el estado de una tarea entre "En Progreso" y "Completada".

* **Arrastrar y Soltar (Drag and Drop):** Reordena las tareas en la lista arrastrándolas con el cursor.

* **Búsqueda y Filtrado:** Busca tareas por título o descripción, y filtra por prioridad y estado.

* **Persistencia Local:** Las tareas se guardan automáticamente en el `localStorage` del navegador, persistiendo entre sesiones.

* **Notificaciones Toast:** Recibe mensajes emergentes (toasts) para confirmar operaciones exitosas o mostrar errores.

* **Diseño Responsivo:** Interfaz adaptada para verse y funcionar bien en diferentes tamaños de pantalla (escritorio, tablet, móvil).

## Tecnologías Utilizadas

**Backend:**

* Node.js

* Express.js

* `uuid` (para generar IDs únicos)

* `cors` (para permitir solicitudes desde el frontend)

**Frontend:**

* React

* Vite (como herramienta de construcción)

* HTML, CSS

* `react-beautiful-dnd` (para Drag and Drop)

* `react-toastify` (para notificaciones Toast)

## Configuración y Ejecución

Sigue estos pasos para poner en marcha el proyecto en tu máquina local.

### Prerrequisitos

Asegúrate de tener instalado:

* Node.js y npm (o yarn/pnpm)

* Git

### Pasos

1.  **Clona el Repositorio:**
    Si aún no has clonado el repositorio desde GitHub, usa el siguiente comando:

    ```bash
    git clone [https://github.com/SantiagoGarzonDeveloper/task-manager-fullstack.git](https://github.com/SantiagoGarzonDeveloper/task-manager-fullstack.git)
    ```

    Si ya lo tienes clonado y acabas de subir los cambios, asegúrate de estar en la carpeta raíz de tu proyecto.

2.  **Navega a la Carpeta del Proyecto:**
    Entra a la carpeta principal del proyecto clonado:

    ```bash
    cd task-manager-fullstack # O el nombre de la carpeta principal si es diferente
    ```

3.  **Configura y Ejecuta el Backend:**
    Aunque el frontend actual usa `localStorage` para las tareas, el backend está configurado y puede ser útil para futuras expansiones.

    * Navega a la carpeta del backend:

        ```bash
        cd task-manager-backend
        ```

    * Instala las dependencias del backend:

        ```bash
        npm install
        # o yarn install
        # o pnpm install
        ```

    * Inicia el servidor backend:

        ```bash
        node server.js
        ```

        Verás un mensaje indicando que el servidor está corriendo en `http://localhost:3000`. Mantén esta terminal abierta y el servidor ejecutándose.

4.  **Configura y Ejecuta el Frontend:**

    * Navega a la carpeta del frontend (desde la carpeta raíz del proyecto):

        ```bash
        cd ../task-manager-frontend # Si estás en task-manager-backend
        # o cd task-manager-frontend # Si estás en la carpeta raíz principal
        ```

    * Instala las dependencias del frontend:

        ```bash
        npm install
        # o yarn install
        # o pnpm install
        ```

    * Inicia la aplicación frontend con Vite:

        ```bash
        npm run dev
        # o yarn dev
        # o pnpm dev
        ```

        Vite iniciará un servidor de desarrollo. Verás un mensaje indicando la URL local (normalmente `http://localhost:5173/` o un puerto similar si el 5173 está ocupado).

5.  **Abre la Aplicación en tu Navegador:**
    Copia la URL proporcionada por Vite (`http://localhost:5173/` o la que sea) y ábrela en tu navegador web.

¡La aplicación de gestor de tareas debería estar funcionando!

## Cómo Usar la Aplicación

* **Agregar Tarea:** Usa el formulario en la parte superior. Ingresa un título (obligatorio), descripción (opcional) y selecciona una prioridad. Haz clic en "Agregar Tarea". Verás un toast de confirmación.

* **Ver Tareas:** Las tareas aparecerán listadas debajo del formulario.

* **Editar Tarea:** Haz clic en el icono del lápiz (✏️) junto a una tarea. La tarea cambiará a modo de edición con un formulario. Modifica los campos que desees. El botón "Guardar" se habilitará solo si detecta cambios. Haz clic en "Guardar" para guardar los cambios (verás un toast) o en "Cancelar" para descartarlos.

* **Eliminar Tarea:** Haz clic en el botón "Eliminar" junto a una tarea. Se pedirá confirmación. Si confirmas, la tarea se eliminará (verás un toast).

* **Cambiar Estado:** Haz clic en las pastillas "En Progreso" o "Completada" junto a la fecha de creación de una tarea. El estado de la tarea cambiará visualmente y se actualizará (verás un toast).

* **Reordenar Tareas:** Haz clic y arrastra una tarea (cualquier parte del ítem de tarea) y suéltala en la posición deseada dentro de la lista. El orden se actualizará y guardará en `localStorage`.

* **Buscar Tareas:** Usa el campo de texto en la sección "Buscar y Filtrar Tareas" para buscar tareas por título o descripción.

* **Filtrar Tareas:** Usa los selectores desplegables de "Prioridad" y "Estado" para mostrar solo las tareas que coincidan con los criterios seleccionados.

* **Limpiar Filtros:** Haz clic en el botón "Limpiar Filtros" para eliminar todos los criterios de búsqueda y filtro y mostrar todas las tareas.

## Estructura del Proyecto
