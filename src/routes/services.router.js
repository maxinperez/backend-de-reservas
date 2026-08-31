import { Router } from 'express';
import ServiceManager from '../managers/ServiceManager.js';
import { SERVICES_DATA_PATH } from '../config/env.config.js';


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

        if(available !== undefined){
            const isAvailable = available === 'true';
            services = services.filter(s => s.available === available);
        }

        res.status(200).json(services);

    } catch (error){
        next(error);
    }
})
