import { Router } from 'express';
import { bookingsController } from '../controllers/bookings.controller.js';

const router = Router();

router.get('/', bookingsController.getAll)

router.get('/:bid', bookingsController.getById)//

router.post('/', bookingsController.create)

//agrega un servicio a una reserva existente, validando que ambos existan.
router.post('/:bid/services/:sid', bookingsController.addServiceToBooking)

export default router;