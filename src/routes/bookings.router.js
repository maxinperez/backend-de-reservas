import { Router } from 'express';
import { bookingsController } from '../controllers/bookings.controller.js';

const router = Router();


router.get('/:bid', bookingsController.getBookingById)

router.post('/', bookingsController.createBooking)

//agrega un servicio a una reserva existente, validando que ambos existan.
router.post('/:bid/services/:sid', bookingsController.addServiceToBooking)

export default router;