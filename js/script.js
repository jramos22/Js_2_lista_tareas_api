//
// Lista de tareas
//

//
// Modelo.
//
/* eslint-disable no-plusplus, no-underscore-dangle */
// Lista de tareas (Array).
let tareas = [];

fetch('https://js2-tareas-api.netlify.app/api/tareas?uid=20')
  .then((response) => response.json())
  .then((data) => {
    tareas = data;
    // Inicialización de la lista del DOM, a partir de las tareas existentes.
    for (let i = 0; i < tareas.length; i += 1) {
      // eslint-disable-next-line no-use-before-define
      appendTaskDOM(tareas[i]);
    }
  });

// addTask(): Agrega una tarea en la lista.
function addTask(nombreTarea, fechaTarea, completoTarea) {
  // Crea un objeto que representa la nueva tarea.
  const nuevaTarea = {
    name: nombreTarea,
    complete: completoTarea,
    date: fechaTarea,
  };

  // Agrega el objeto en   el array.
  tareas.push(nuevaTarea);

  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify(nuevaTarea),
  };
  fetch('https://js2-tareas-api.netlify.app/api/tareas?uid=20', fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Agrega la tarea al DOM.
      appendTaskDOM(data);// eslint-disable-line no-use-before-define
    });
}
// taskStatus(): Actualiza el estado de una tarea.
function taskStatus(id, complete, nombre, fecha) {
  const FetchUpdate = {
    method: 'PUT',
    body: JSON.stringify({ name: `${nombre}`, complete: true, date: `${fecha}` }),
  };
  fetch(`https://js2-tareas-api.netlify.app/api/tareas/${id}?uid=20`, FetchUpdate)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (tareas.id === id) {
        tareas.completo = complete;
      }
    });
}
// deleteTask(): Borra una tarea.
function deleteTask(id) {
  const fetchDELETE = {
    method: 'DELETE',
  };
  fetch(`https://js2-tareas-api.netlify.app/api/tareas/${id}?uid=20`, fetchDELETE)
    .then((response) => response)
    .then((data) => {
      console.log(data);
    });
}

//
// Vista.
//

// Lista de tareas (DOM).
const lista = document.getElementById('task-list');

function appendTaskDOM(tarea) {
  // Item de la lista
  const item = document.createElement('li');
  item.className = 'task-list__item';
  // Checkbox.
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  // eslint-disable-next-line no-underscore-dangle
  checkbox.setAttribute('id', `tarea-${tarea._id}`);
  checkbox.checked = tarea.complete;
  // Label.
  const label = document.createElement('label');
  // eslint-disable-next-line no-underscore-dangle
  label.setAttribute('for', `tarea-${tarea._id}`);
  label.innerHTML = `${tarea.name} - ${tarea.date}`;
  checkbox.dataset.nombre = tarea.name;
  checkbox.dataset.fecha = tarea.date;
  // Botón de borrar.
  const buttonDelete = document.createElement('button');
  buttonDelete.className = 'task-list__delete';
  // eslint-disable-next-line no-underscore-dangle
  buttonDelete.setAttribute('id', `delete-${tarea._id}`);
  buttonDelete.innerHTML = 'Borrar';
  // Se agregan elementos.
  item.appendChild(checkbox);
  item.appendChild(label);
  item.appendChild(buttonDelete);
  lista.appendChild(item);
  // Evento para marcar tareas como completas.
  checkbox.addEventListener('click', (event) => {
    const complete = event.currentTarget.checked;
    const itemId = event.currentTarget.getAttribute('id');
    const nombre = event.currentTarget.getAttribute('data-nombre');
    const fecha = event.currentTarget.getAttribute('data-fecha');
    const taskId = itemId.substring(6);
    taskStatus(taskId, complete, nombre, fecha);
  });
  // Evento para borrar tareas.
  buttonDelete.addEventListener('click', (event) => {
    const itemId = event.currentTarget.getAttribute('id');
    const taskId = itemId.substring(7);
    deleteTask(taskId);
    // Borra la tarea en el DOM.
    event.currentTarget.parentNode.remove();
  });
}

//
// Controlador.
//

// Formulario para añadir tareas.
const formulario = document.getElementById('new-task-form');

// Event handler para el evento 'submit' del formulario.
// Crea una nueva tarea.
formulario.addEventListener('submit', (event) => {
  // Se cancela el comportamiento default del formulario.
  event.preventDefault();

  // Agrega el nuevo ítem al modelo.
  addTask(formulario.elements[0].value, formulario.elements[1].value, false);

  // Reseteamos el form.
  formulario.elements[0].value = '';
  formulario.elements[1].value = '';
});
