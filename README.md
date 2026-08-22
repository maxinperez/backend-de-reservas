# 📅 Backend de Turnos y Reservas

Sistema backend desarrollado en Node.js para la gestión de servicios de un sistema de turnos y reservas. Implementa una clase `ServiceManager` que permite administrar servicios con persistencia en un archivo JSON.

Proyecto desarrollado en el curso de **Backend** de [CoderHouse](https://www.coderhouse.com/).

---

## 📋 Descripción del Proyecto

El proyecto expone una clase `ServiceManager` que permite crear, leer, actualizar y eliminar servicios (CRUD) de forma persistente sobre un archivo `service.json`. La configuración del entorno se valida al iniciar la aplicación: si falta alguna variable requerida, la app falla con un mensaje claro antes de ejecutar cualquier lógica de negocio.

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
node src/app.js
```

> Si falta alguna variable de entorno requerida, la aplicación se detiene al iniciar con un mensaje que indica cuál falta. Esto es intencional — preferimos un error explícito al arrancar antes que un comportamiento inesperado en tiempo de ejecución.

---

## 🔐 Variables de Entorno

El archivo `.env` debe definir las siguientes variables. Usá `.env.example` como plantilla:

| Variable     | Descripción                              | Ejemplo       |
|--------------|------------------------------------------|---------------|
| `PORT`       | Puerto en el que corre el servidor       | `8080`        |
| `NODE_ENV`   | Entorno de ejecución                     | `development` |

> ⚠️ El archivo `.env` **no se sube al repositorio** (está en `.gitignore`). Nunca incluyas credenciales reales en el control de versiones.

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
│   │   └── env.config.js       # Validación de variables de entorno al iniciar
│   ├── managers/
│   │   └── ServiceManager.js   # Lógica de negocio sobre el recurso services
│   ├── data/
│   │   └── service.json        # Persistencia de los servicios (fuente de verdad)
│   └── app.js                  # Punto de entrada de la aplicación
├── .env.example                # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

---

## 🗂️ Recurso: `services`

El recurso `services` representa los servicios ofrecidos por el sistema (cortes de cabello, masajes, manicura, etc.). Se almacena en `src/data/service.json` como un array de objetos con la siguiente estructura:



## 👤 Autor

**Máximo Perez** — Curso de Backend, CoderHouse.
