# 📅 Backend de Turnos y Reservas

Sistema backend desarrollado en Node.js para la gestión de servicios de un sistema de turnos y reservas.Permite administrar servicios con persistencia en un archivo JSON( por ahora, dentro de poco le metemos MongoDB).

Proyecto desarrollado en el curso de **Backend** de [CoderHouse](https://www.coderhouse.com/).

---

## 📋 Descripción del Proyecto

El proyecto implementa un backend con **Node.js** y **Express** para la gestión de un sistema de turnos y reservas. Actualmente expone dos recursos principales, **servicios** (`services`) y **reservas** (`bookings`), siguiendo una arquitectura en capas que separa responsabilidades:

- **Routers**: definen los endpoints y delegan el manejo de cada request a su controller correspondiente.
- **Controllers**: contienen la lógica de negocio (filtrado, validaciones, formateo de respuestas) y se comunican con el manager correspondiente.
- **Managers**: encapsulan el acceso a los datos, realizando las operaciones CRUD sobre archivos JSON (`service.json` y `bookings.json`).

Esta separación permite que cada capa tenga una única responsabilidad, facilitando el mantenimiento y la futura migración de la persistencia en archivos JSON hacia una base de datos MongoDB.

La configuración del entorno se valida al iniciar la aplicación: si falta alguna variable requerida, la app falla con un mensaje claro antes de ejecutar cualquier lógica de negocio.
---

## 🔧 Tecnologías

- **Node.js** con ES Modules (`import`/`export`)
- **dotenv** — gestión de variables de entorno
- **fs/promises** — lectura y escritura de archivos de forma asíncrona (no bloqueante)

---

## 📦 Instalación

1. Cloná el repositorio:

```bash
git clone https://github.com/maxinperez/backend-de-reservas.git
cd backend-de-reservas
```

2. Instalá las dependencias:

```bash
npm install
```

3. Creá tu archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

Completá los valores en el `.env` (ver sección de variables de entorno).

---

## 🚀 Cómo Ejecutar

```bash
node src/server.js
```

> Si falta alguna variable de entorno requerida, la aplicación se detiene al iniciar con un mensaje que indica cuál falta. Esto es intencional — preferimos un error explícito al arrancar antes que un comportamiento inesperado en tiempo de ejecución.

---

## 🔐 Variables de Entorno

El archivo `.env` debe definir las siguientes variables. Usá `.env.example` como plantilla:

| Variable              | Descripción                                      | Ejemplo                          |
|------------------------|-------------------------------------------------|-----------------------------------|
| `PORT`                 | Puerto en el que corre el servidor.              | `8080`                            |
| `NODE_ENV`             | Entorno de ejecución.                            | `development`                     |
| `SERVICES_DATA_PATH`   | Ruta al JSON donde se persisten los services.   | `./src/data/service.json`      |
| `BOOKINGS_DATA_PATH`   | Ruta al JSON donde se persisten las reservas.   | `./src/data/bookings.json`     |


---

## 📝 `type: module`

Este proyecto usa ES Modules nativos de Node.js. El `package.json` incluye:

```json
{
  "type": "module"
}
```

Esto habilita el uso de `import`/`export` en todos los archivos `.js` del proyecto, sin necesidad de Babel ni transpiladores.

---

## 📁 Estructura del Proyecto

```
backend-de-reservas/
├── src/
│   ├── config/
│   │   └── env.config.js
│   ├── controllers/
│   │   ├── bookings.controller.js
│   │   └── services.controller.js
│   ├── dao/
│   │   └── fileSystem/
│   │       ├── bookings.fs.dao.js
│   │       └── services.fs.dao.js
│   ├── data/
│   │   ├── bookings.json
│   │   └── services.json
│   ├── repositories/
│   │   ├── bookings.repository.js
│   │   └── services.repository.js
│   ├── routes/
│   │   ├── bookings.router.js
│   │   └── services.router.js
│   ├── services/
│   │   ├── bookings.service.js
│   │   └── services.service.js
│   ├── app.js
│   └── server.js
├── .env                  # Local; no debe incluirse en Git
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```
---



## 👤 Autor

**Máximo Perez** — Curso de Backend, CoderHouse.
