//forma de los datos de una reserva que entran por la API. No contiene reglas de negocio.
//el middleware antepone el nombre del campo a cada mensaje ("time: debe tener formato HH:MM").
import { z } from 'zod';

const objectId = z.string({ error: 'es obligatorio' })
    .regex(/^[0-9a-fA-F]{24}$/, 'debe ser un id válido');

const text = z.string({ error: 'es obligatorio y debe ser texto' })
    .trim()
    .min(1, 'no puede estar vacío');

export const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled'];

export const createBookingSchema = z.object({
    clientName: text,
    clientEmail: z.email({ error: 'debe ser un email válido' }),
    date: z.string({ error: 'es obligatorio (formato YYYY-MM-DD)' })
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'debe tener formato YYYY-MM-DD')
        .refine((value) => {
            const parsed = new Date(`${value}T00:00:00Z`);
            return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
        }, 'no es una fecha real'),
    time: z.string({ error: 'es obligatorio (formato HH:MM)' })
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'debe tener formato HH:MM (00:00 a 23:59)'),
    status: z.enum(BOOKING_STATUSES, {
        error: `debe ser uno de: ${BOOKING_STATUSES.join(', ')}`,
    }),
    services: z.array(
        z.object({
            service: objectId,
            quantity: z.number({ error: 'debe ser un número' })
                .int('debe ser un número entero')
                .positive('debe ser mayor a 0')
                .default(1),
        }),
        { error: 'debe ser un listado' }
    ).default([]),
}, { error: 'El cuerpo de la request debe ser un objeto JSON' });

export const addServiceToBookingParamsSchema = z.object({
    bid: objectId,
    sid: objectId,
});
