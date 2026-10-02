import { Router } from 'express';
const viewsRouter = Router();
import { ServicesService } from '../services/services.service.js';

const servicesService = new ServicesService();

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
    
})
export default viewsRouter;