const socket = io();

const servicesList = document.getElementById('services-list');

socket.on('newService', (service) => {
  if (!servicesList) return;

 
  const emptyMessage = servicesList.querySelector('.empty-message');
  if (emptyMessage) emptyMessage.remove();

  const item = document.createElement('li');

  const name = document.createElement('strong');
  name.textContent = service.name;

  const availability = service.available ? 'Disponible' : 'No disponible';
  const details = ` - ${service.category} (${service.duration} min) - $${service.price} - ${service.description} ${availability}`;

  // textContent evita inyectar HTML con los datos que vienen del servidor
  item.append(name, details);
  servicesList.appendChild(item);
});
