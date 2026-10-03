import { Router } from 'express';
import { ServicesService } from '../services/services.service.js';
import { BookingsService } from '../services/bookings.service.js';



const viewsRouter = Router();
const servicesService = new ServicesService();
const bookingsService = new BookingsService();


viewsRouter.get('/services', viewsController.getServices)

viewsRouter.get('/bookings', viewsController.getBookings)



export default viewsRouter;