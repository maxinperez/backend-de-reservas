//manejar la request/response HTTP. Extrae params, llama al service, formatea la respuesta. No tiene lógica de negocio.
import { ServicesService } from "../services/services.service.js";

export class ServicesController {
    constructor(service = new ServicesService() ) {
        this.service = service;
    }

    createService = async (req, res, next) => {
        return this.create(req, res, next);
    };

    updateService = async (req, res, next) => {
        return this.update(req, res, next);
    };

    deleteService = async (req, res, next) => {
        return this.delete(req, res, next);
    };

    getAll = async (req, res, next) => {
         
        try {
            const filters = req.query;
            const services = await this.service.getAllServices(filters);
            res.status(200).json(services);
        } catch (error) {
         
            next(error);
        }
    };

    getById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const service = await this.service.getServiceById(parseInt(id));
            res.status(200).json(service);
        } catch (error) {
            next(error)

        }
    }

    create = async (req, res, next) => {
        try {
            const newService = await this.service.createService(req.body);
            res.status(201).json(newService);
        } catch (error) {
            next(error);
        }

    }



    update = async (req, res, next) => {
        try {
            const id = req.params.id;
            const updatedData = req.body;
            const updatedService = await this.service.updateService(id, updatedData);

            if (updatedService === null) {
                return res.status(404).json({ error: `Servicio con id:${id} no encontrado` });
            }
            res.status(200).json(updatedService);

        } catch (error) {
            next(error);
        }
    }

    delete = async (req, res, next) =>{
        try {
        const sid = req.params.id;
        const deletedService = await this.service.deleteService(sid);

        if (deletedService === null) {
            return res.status(404).json({ error: `Servicio con id:${sid} no encontrado` });
        }
        res.status(200).json({ message: `Servicio con id:${sid} eliminado` });

    } catch (error) {
        next(error);
    }

    }


};

export const servicesController = new ServicesController();

