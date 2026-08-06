// Importamos el módulo nativo de Node.js
const http = require('http');

// Creamos el servidor
const server = http.createServer((req, res) => {
    // req = request (lo que viene del cliente)
    // res = response (lo que enviamos al cliente)

    console.log(`Petición recibida: ${req.method} en la ruta ${req.url}`);

    // Definimos el estado y el tipo de contenido
    res.writeHead(200, { 'Content-Type': 'application/json' });

    // Enviamos la respuesta
    const respuesta = {
        mensaje: "Bienvenido al Backend de Servicios de Turnos",
        status: "activo"
    };

    res.end(JSON.stringify(respuesta));
});

// El servidor escucha en el puerto 3000
server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
