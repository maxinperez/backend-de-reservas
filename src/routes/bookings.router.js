import { Router } from 'express';
import BookingManager from '../managers/BookingManager.js';
import { BOOKINGS_DATA_PATH } from '../config/env.config.js';


const router = Router();
const bookingManager = new BookingManager(BOOKINGS_DATA_PATH);

router.get('/:bid', async (req, res, next) => {

    try {
        const id = req.params.bid;
        const booking = await bookingManager.getBookingById(id);

        if (booking === null) {
            return res.status(404).json({ error: 'Booking no encontrado' });
        }
        res.status(200).json(booking);
    } catch (error) {
        next(error);
    }
})


router.post('/', async (req, res, next) => {
    const bookingData = req.body;
    try {
        const newBooking = await bookingManager.createBooking(bookingData);
        res.status(201).json(newBooking);
    } catch (error) {
        // Si el error es por campos faltantes, devolvemos 400
        if (error.message.startsWith('Booking incompleto')) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
})

//agrega un servicio a una reserva existente, validando que ambos existan.
router.post('/:bid/services/:sid', async (req, res, next) => {

    const sid = req.params.sid;
    const bid = req.params.bid;

    try {
        const updatedBooking = await bookingManager.addServiceToBooking(parseInt(bid), parseInt(sid));

        if (updatedBooking === null) {
            return res.status(404).json({ error: `Booking con id ${bid} no encontrado` });
        }

        const existingService = updatedBooking.services.find(s => s.service === parseInt(sid));
        const service = await bookingManager.serviceManager.getServiceById(sid);

        if ( service === null) {
            return res.status(404).json({ error: `Service con id ${sid} no encontrado` });
        }

        if (!service.available) {
            return res.status(400).json({ error: `Service con id ${sid} no está disponible` });
        }

        res.status(200).json(updatedBooking);

    }
    catch (error) {
        next(error);

    }



})

export default router;