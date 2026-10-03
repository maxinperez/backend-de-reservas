import { Router } from 'express';
import { viewsController } from '../controllers/views.controller.js';



const viewsRouter = Router();

viewsRouter.get('/services', viewsController.getServices);
viewsRouter.get('/bookings', viewsController.getBookings);



export default viewsRouter;