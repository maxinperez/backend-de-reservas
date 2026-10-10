//forma de los datos de un servicio que entran por la API. No contiene reglas de negocio.
//el middleware antepone el nombre del campo a cada mensaje ("price: debe ser un número").
import { z } from 'zod';

const text = z.string({ error: 'es obligatorio y debe ser texto' })
    .trim()
    .min(1, 'no puede estar vacío');

export const createServiceSchema = z.object({
    name: text,
    description: text,
    duration: z.number({ error: 'es obligatorio y debe ser un número' })
        .int('debe ser un número entero')
        .positive('debe ser mayor a 0'),
    price: z.number({ error: 'es obligatorio y debe ser un número' })
        .positive('debe ser mayor a 0'),
    category: text,
    available: z.boolean({ error: 'es obligatorio y debe ser true o false' }),
}, { error: 'El cuerpo de la request debe ser un objeto JSON' });

export const updateServiceSchema = createServiceSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        error: 'Enviá al menos un campo para actualizar',
    });
