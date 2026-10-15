# 📅 Backend de Turnos y Reservas

Sistema backend desarrollado en Node.js para la gestión de servicios de un sistema de turnos y reservas. Permite administrar servicios y reservas con persistencia en **MongoDB Atlas** (a través de Mongoose), consultarlos mediante una **API REST** con filtros, paginación y ordenamiento, verlos en **vistas Handlebars** y recibir cambios en tiempo real con **Socket.IO**.

Proyecto desarrollado en el curso de **Backend** de [CoderHouse](https://www.coderhouse.com/).

---

## 📋 Descripción del Proyecto

El proyecto implementa un backend con **Node.js** y **Express** para la gestión de un sistema de turnos y reservas. Expone dos recursos principales, **servicios** (`services`) y **reservas** (`bookings`), siguiendo una arquitectura en capas que separa responsabilidades:

`routes → controllers → services → repositories → DAO → models`

- **Routers**: definen los endpoints y conectan, cuando corresponde, el middleware de validación. No contienen lógica.
- **Middlewares / Schemas**: los esquemas de **Zod** describen la forma válida de los datos de entrada y el middleware `validate` corta la request con un `400` antes de llegar a los controllers.
- **Controllers**: manejan HTTP (extraen parámetros, llaman al service y formatean la respuesta). Los controllers de vistas renderizan Handlebars usando los mismos services que la API.
- **Services**: contienen la lógica de negocio (filtros, paginación, reglas como "el servicio debe estar disponible") y no conocen HTTP.
- **Repositories**: interfaz de acceso a datos; traducen el lenguaje del dominio a operaciones del DAO.
- **DAO (Mongo)**: único lugar donde se habla con MongoDB a través de los modelos de Mongoose.
- **Models**: schemas y modelos de Mongoose (`services`, `bookings`).

Esta separación permite que cada capa tenga una única responsabilidad: por ejemplo, la migración de archivos JSON a MongoDB solo requirió cambiar el DAO, sin tocar la lógica de negocio.

La configuración del entorno se valida al iniciar la aplicación: si falta alguna variable requerida, la app falla con un mensaje claro antes de ejecutar cualquier lógica de negocio.

---

## 🔧 Tecnologías

- **Node.js** con ES Modules (`import`/`export`)
- **Express** — framework web para la API REST y el enrutamiento
- **MongoDB Atlas** — base de datos en la nube
- **Mongoose** — modelado de datos y acceso a MongoDB (schemas, modelos y `populate`)
- **Handlebars** (`express-handlebars`) — vistas renderizadas del lado del servidor
- **Socket.IO** — comunicación en tiempo real entre el servidor y el navegador
- **Zod** — validación de los datos que entran por la API
- **dotenv** — gestión de variables de entorno

**Testing**

- **node:test** — test runner nativo de Node.js (`npm test`)
- **Supertest** — pruebas de los endpoints HTTP

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
npm run dev     # desarrollo: reinicia el servidor al guardar cambios
npm start       # producción
npm test        # corre los tests de los endpoints y las vistas
```

El servidor queda disponible en `http://localhost:<PORT>`.

> Los tests usan la base de datos configurada en `MONGO_URI`: crean sus propios datos con una categoría única y los eliminan al terminar.

> Si falta alguna variable de entorno requerida, la aplicación se detiene al iniciar con un mensaje que indica cuál falta. Esto es intencional — preferimos un error explícito al arrancar antes que un comportamiento inesperado en tiempo de ejecución.

---

## 🔐 Variables de Entorno

El archivo `.env` debe definir las siguientes variables. Usá `.env.example` como plantilla:

| Variable              | Descripción                                      | Ejemplo                          |
|------------------------|-------------------------------------------------|-----------------------------------|
| `PORT`                 | Puerto en el que corre el servidor.              | `8080`                            |
| `NODE_ENV`             | Entorno de ejecución.                            | `development`                     |
| `MONGO_URI`            | URI de conexión a MongoDB Atlas.                | `mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<base>` |

> Nunca subas tu `.env` ni credenciales reales al repositorio: el archivo está en `.gitignore`.

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

## 📡 API REST

Todos los endpoints cuelgan de `/api`. Los errores siempre responden con el formato `{ "error": "mensaje" }`.

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/services` | Lista servicios con filtros, paginación y ordenamiento. |
| `GET` | `/api/services/:id` | Devuelve un servicio (`404` si no existe). |
| `POST` | `/api/services` | Crea un servicio (`201`). |
| `PUT` | `/api/services/:id` | Actualiza uno o más campos de un servicio. |
| `DELETE` | `/api/services/:id` | Elimina un servicio. |
| `GET` | `/api/bookings` | Lista las reservas (los servicios vienen como ids). |
| `GET` | `/api/bookings/:bid` | Devuelve una reserva **con los servicios completos** (`populate`). |
| `POST` | `/api/bookings` | Crea una reserva (`201`). |
| `POST` | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva existente. |

### Filtros, paginación y ordenamiento en `GET /api/services`

| Parámetro | Descripción | Valores / default |
|-----------|-------------|-------------------|
| `category` | Filtra por categoría (sin distinguir mayúsculas). | texto |
| `available` | Filtra por disponibilidad. | `true` o `false` |
| `duration` | Filtra por duración exacta en minutos. | número |
| `price` | Filtra por precio exacto. | número |
| `page` | Página que se pide. | entero ≥ 1 (default `1`) |
| `limit` | Cantidad de servicios por página. | entero entre 1 y 50 (default `10`) |
| `sortBy` | Campo por el que se ordena. | `name`, `price`, `duration`, `category`, `createdAt` (default `createdAt`) |
| `order` | Sentido del orden. | `asc` o `desc` (default `asc`) |

Los parámetros se pueden combinar. Ejemplos:

```http
GET /api/services?page=2&limit=3
GET /api/services?category=peluquería&available=true
GET /api/services?sortBy=price&order=desc&limit=5
GET /api/services?category=peluquería&available=true&sortBy=price&order=asc&page=1&limit=2
```

La respuesta incluye el listado en `payload` y los metadatos de paginación:

```json
{
  "payload": [
    {
      "_id": "6ac034f68d7cb211057596dd",
      "name": "Corte de cabello",
      "description": "Corte clásico con máquina y tijera",
      "duration": 30,
      "price": 3500,
      "category": "peluquería",
      "available": true,
      "createdAt": "2026-10-02T22:49:26.273Z",
      "updatedAt": "2026-10-02T22:49:26.273Z"
    }
  ],
  "total": 7,
  "page": 1,
  "limit": 1,
  "totalPages": 7,
  "hasPrevPage": false,
  "hasNextPage": true
}
```

| Campo | Significado |
|-------|-------------|
| `total` | Cantidad total de servicios que cumplen los filtros (no solo los de la página). |
| `page` / `limit` | Página y tamaño de página aplicados. |
| `totalPages` | `ceil(total / limit)`. |
| `hasPrevPage` / `hasNextPage` | Si existe una página anterior / siguiente. |

**Cómo funciona:** se calcula `skip = (page - 1) * limit` y se pide a MongoDB solo ese tramo (`find` + `sort` + `skip` + `limit`), en paralelo con un `countDocuments` que usa el mismo filtro para obtener el total. Siempre se ordena (con `_id` como desempate) para que las páginas sean estables. Pedir una página más allá del final devuelve `200` con `payload: []`. Un valor inválido (`page=0`, `limit=100`, `sortBy=otro`, `order=arriba`) devuelve `400`.

### Validaciones (Zod)

Los datos que entran se validan con **Zod** en un middleware (`src/middlewares/validate.middleware.js`) usando los esquemas de `src/schemas/`. Si no son válidos, la request se corta con `400` **antes de llegar a MongoDB**, indicando qué campo falla. Los campos desconocidos del cuerpo se descartan.

| Operación | Qué se valida |
|-----------|---------------|
| `POST /api/services` | Todos obligatorios: `name`, `description` y `category` texto no vacío; `duration` entero > 0; `price` número > 0; `available` booleano. |
| `PUT /api/services/:id` | Los mismos campos, pero todos opcionales; los que lleguen deben ser válidos y debe enviarse al menos uno. |
| `POST /api/bookings` | `clientName` texto no vacío; `clientEmail` email válido; `date` en formato `YYYY-MM-DD` y fecha real; `time` en formato `HH:MM`; `status` uno de `pending`, `confirmed`, `cancelled`; `services` opcional (default `[]`), cada ítem con `service` (id válido) y `quantity` entero > 0 (default `1`). |
| `POST /api/bookings/:bid/services/:sid` | `bid` y `sid` deben ser ids válidos de MongoDB (24 caracteres hexadecimales). |

Ejemplo de error:

```http
POST /api/services
{ "name": "Manicura", "price": "abc", "duration": 1.5 }
```

```json
{
  "error": "description: es obligatorio y debe ser texto; duration: debe ser un número entero; price: es obligatorio y debe ser un número; category: es obligatorio y debe ser texto; available: es obligatorio y debe ser true o false"
}
```

> La validación de Zod corta primero. Las reglas de negocio (por ejemplo, que el servicio exista y esté disponible) siguen en la capa de services, y los schemas de Mongoose quedan como última red de seguridad.

### Consultar una reserva con sus servicios completos

Las reservas guardan los servicios como **referencias** (`{ service: ObjectId, quantity: Number }`), no como objetos completos. `GET /api/bookings/:bid` usa `populate` para reemplazar cada referencia por el servicio completo **solo en la respuesta**; en la base de datos sigue guardándose únicamente el id.

```http
GET /api/bookings/6ac2f1a1d3b9c8e4a7f01234
```

```json
{
  "_id": "6ac2f1a1d3b9c8e4a7f01234",
  "clientName": "María Gómez",
  "clientEmail": "maria@example.com",
  "date": "2026-09-10T00:00:00.000Z",
  "time": "10:00",
  "status": "confirmed",
  "services": [
    {
      "service": {
        "_id": "6ac034f68d7cb211057596dd",
        "name": "Corte de cabello",
        "description": "Corte clásico con máquina y tijera",
        "duration": 30,
        "price": 3500,
        "category": "peluquería",
        "available": true
      },
      "quantity": 1
    }
  ]
}
```

En cambio, `GET /api/bookings` (el listado) devuelve en `services` solo los ids, para no cargar cada reserva con datos que muchas veces no se necesitan.

### Agregar un servicio a una reserva

```http
POST /api/bookings/:bid/services/:sid
```

- Si el servicio ya estaba en la reserva, se incrementa su `quantity`; si no, se agrega con `quantity: 1`.
- `404` si la reserva o el servicio no existen; `400` si el servicio no está disponible o si algún id tiene un formato inválido.

---

## 🖥️ Vistas y tiempo real

| Ruta | Descripción |
|------|-------------|
| `GET /views/services` | Listado de servicios renderizado con Handlebars, con navegación Anterior / Siguiente. Acepta los mismos parámetros que la API (`page`, `limit`, `category`, `sortBy`...). |
| `GET /views/bookings` | Listado de reservas. |

Las vistas no tienen datos escritos a mano: los controllers de vistas usan los mismos services que la API.

**Tiempo real (Socket.IO):** al crear un servicio con `POST /api/services`, el servidor emite el evento `newService` y todos los navegadores que tengan abierto `/views/services` (`src/public/js/socket.js`) agregan el servicio a la lista sin recargar la página.

---

## 📁 Estructura del Proyecto

```
backend-de-reservas/
├── src/
│   ├── config/
│   │   ├── database.config.js
│   │   └── env.config.js
│   ├── controllers/
│   │   ├── bookings.controller.js
│   │   ├── services.controller.js
│   │   └── views.controller.js
│   ├── dao/
│   │   ├── models/
│   │   │   ├── booking.models.js
│   │   │   ├── message.models.js
│   │   │   └── service.models.js
│   │   └── mongo/
│   │       ├── bookings.mongo.dao.js
│   │       └── services.mongo.dao.js
│   ├── middlewares/
│   │   └── validate.middleware.js
│   ├── public/
│   │   ├── css/
│   │   │   └── styles.css
│   │   └── js/
│   │       └── socket.js
│   ├── repositories/
│   │   ├── bookings.repository.js
│   │   └── services.repository.js
│   ├── routes/
│   │   ├── bookings.router.js
│   │   ├── services.router.js
│   │   └── views.router.js
│   ├── schemas/
│   │   ├── booking.schema.js
│   │   └── service.schema.js
│   ├── services/
│   │   ├── bookings.service.js
│   │   └── services.service.js
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── bookings.handlebars
│   │   └── services.handlebars
│   ├── app.js
│   └── server.js
├── test/
│   ├── bookings.test.js
│   ├── services.test.js
│   ├── validation.test.js
│   └── views.test.js
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
