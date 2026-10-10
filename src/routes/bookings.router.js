import { Router } from 'express';
import { bookingsController } from '../controllers/bookings.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createBookingSchema, addServiceToBookingParamsSchema } from '../schemas/booking.schema.js';

const router = Router();

router.get('/', bookingsController.getAll)

router.get('/:bid', bookingsController.getById)//

router.post('/', validate(createBookingSchema), bookingsController.create)

//agrega un servicio a una reserva existente, validando que ambos existan.
router.post('/:bid/services/:sid', validate(addServiceToBookingParamsSchema, 'params'), bookingsController.addServiceToBooking)

export default router;