📅 Backend de Turnos y Reservas

Sistema backend desarrollado en Node.js para la gestión de servicios de un sistema de turnos y reservas. Implementa una clase ServiceManager que permite administrar servicios con persistencia en un archivo JSON.

Proyecto desarrollado como pre-entrega del curso de Backend de CoderHouse.

---

## 🔧 Tecnologías
 
- **Node.js** con ES Modules (`import`/`export`)
- **dotenv** — gestión de variables de entorno
- **fs/promises** — lectura y escritura de archivos de forma asíncrona (no bloqueante)

---

## 📦 Instalación
1. Cloná el repositorio:
```bash
git clone https://github.com/<tu-usuario>/backend-de-reservas.git
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

---

## 🗂️ Recurso: `services`

El recurso services representa los servicios ofrecidos por el sistema (cortes de cabello, masajes, manicura, etc.). Se almacena en src/data/service.json como un array de objetos

```json
{
  "id": 1,
  "name": "Corte de cabello",
  "description": "Corte clásico con máquina y tijera",
  "duration": 30,
  "price": 3500,
  "category": "peluquería",
  "available": true
}
```
 
| Campo         | Tipo      | Descripción                                                                 |
|---------------|-----------|-----------------------------------------------------------------------------|
| `id`          | `number`  | Identificador único. Se genera automáticamente, nunca se recibe como parámetro. |
| `name`        | `string`  | Nombre del servicio.                                                        |
| `description` | `string`  | Descripción del servicio.                                                   |
| `duration`    | `number`  | Duración en minutos.                                                        |
| `price`       | `number`  | Precio del servicio.                                                        |
| `category`    | `string`  | Categoría del servicio.                                                     |
| `available`   | `boolean` | Indica si el servicio está disponible para reservar.                        |
 
---

👤 Autor
Máximo Perez — Curso de Backend, CoderHouse.