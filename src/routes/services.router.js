import { Router } from 'express';
import ServiceManager from '../managers/ServiceManager.js';
import { SERVICES_DATA_PATH } from '../config/env.config.js';

/*
importar controllers, en controller debo llamar a ServiceManager y hacer la logica de negocio, y en router solo debo llamar a los controllers.
foto en wp.
 */
const router = Router();
const serviceManager = new ServiceManager(SERVICES_DATA_PATH);

router.get('/', async (req, res, next) => {
    try{
        let services = await serviceManager.getServices();

        const {duration, price, category, available} = req.query;
        
        if(duration){
            services = services.filter(s => s.duration == duration);
        }

        if(price){
            const priceNumber = parseFloat(price);
            services = services.filter(s => s.price == priceNumber);
        }

        if(category){
            //evito que la busqueda sea case sensitive, por eso uso toLowerCase()
            services = services.filter(s => s.category.toLowerCase() === category.toLowerCase());   
        }

        if (available !== undefined) {

            if (available !== 'true' && available !== 'false') {
                return res.status(400).json({ error: 'available debe ser "true" o "false"' });
            }
    
            const isAvailable = available === 'true';
            services = services.filter(s => s.available === isAvailable);
        }

        res.status(200).json(services);

    } catch (error){
        next(error);
    }
})

router.get('/:id', async (req, res, next) => {

    try{const id = req.params.id;
    const service = await serviceManager.getServiceById(id);

    if(service === null){
        return res.status(404).json({error: 'Servicio no encontrado'});
    }
    res.status(200).json(service);
    } catch (error){
        next(error);
    }
})
    


router.post('/', async (req, res, next) => {
    const serviceData = req.body;
    try{
        const newService = await serviceManager.addService(serviceData);
        res.status(201).json(newService);
    } catch (error){
        // Si el error es por campos faltantes, devolvemos 400
    if (error.message.startsWith('Service incompleto')) {
      return res.status(400).json({ error: error.message });
    }
        next(error);
    }
})

router.put('/:id', async (req, res, next) => {
    try {
    const id = req.params.id;
    const updatedData = req.body;
    const updatedService = await serviceManager.updateService(id, updatedData);

    if (updatedService === null) {
      return res.status(404).json({ error: `Servicio con id ${id} no encontrado` });
    }
    res.status(200).json(updatedService);
    } catch(error){
        next(error);
    }

})


router.delete('/:id', async (req, res, next) => {

    try {
        const sid = req.params.id;
        const deletedService = await serviceManager.deleteService(sid);

        if (deletedService === null) {
            return res.status(404).json({ error: `Servicio con id:${sid} no encontrado` });
        }
        res.status(200).json({ message: `Servicio con id:${sid} eliminado` });

    } catch(error){
        next(error);
    }
 })

export default router;