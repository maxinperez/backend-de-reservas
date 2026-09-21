import { Router } from 'express';
import { servicesController } from '../controllers/ServicesController.js';

const router = Router();

router.get('/',  servicesController.getAll);//check

router.get('/:id', servicesController.getById);

router.post('/', servicesController.createService);

router.put('/:id', servicesController.updateService);

router.delete('/:id', servicesController.deleteService);

export default router;