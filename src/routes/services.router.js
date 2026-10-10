import { Router } from 'express';
import { servicesController } from '../controllers/services.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createServiceSchema, updateServiceSchema } from '../schemas/service.schema.js';

const router = Router();

router.get('/',  servicesController.getAll);//check

router.get('/:id', servicesController.getById);

router.post('/', validate(createServiceSchema), servicesController.createService);

router.put('/:id', validate(updateServiceSchema), servicesController.updateService);

router.delete('/:id', servicesController.deleteService);

export default router;