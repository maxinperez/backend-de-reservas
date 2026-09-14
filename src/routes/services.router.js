import { Router } from 'express';
import { servicesController } from '../controllers/services.controller.js';

const router = Router();

router.get('/',  servicesController.getServices);

router.get('/:id', servicesController.getServicesById);
    
router.post('/', servicesController.createService);

router.put('/:id', servicesController.updateService);

router.delete('/:id', servicesController.deleteService);

export default router;