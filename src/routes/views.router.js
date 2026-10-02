import { Router } from 'express';
const viewsRouter = Router();
import { ServicesService } from '../services/services.service.js';
import { BookingsService } from '../services/bookings.service.js';

const servicesService = new ServicesService();
const bookingsService = new BookingsService();
viewsRouter.get('/services', async (req, res, next) => {
    try {
        const services = await servicesService.getAllServices();
        // toObject() convierte los documentos de Mongoose en objetos planos que Handlebars puede leer
        res.render('services', { services: services.map(s => s.toObject()) });
    } catch (error) {
        next(error);
    }
});

viewsRouter.get('/bookings', async (req, res, next) => {
    try {
        const bookings = await bookingsService.getBookings();
        res.render('bookings', {bookings: bookings.map(b => b.toObject())});
    } catch (error) {
        next(error);
    }
})



export default viewsRouter;