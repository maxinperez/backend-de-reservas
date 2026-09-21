//lógica de negocio. Valida reglas, calcula IDs, lanza errores de dominio. No conoce HTTP (nada de req/res), no conoce el DAO (solo al repository).
import { ServiceRepository } from "../repository/ServiceRepository.js";

export class ServicesService {

    constructor(repository = new ServiceRepository()) {
        this.repository = repository;
    }

    async getAllServices(filter = {}) {

        let services = await this.repository.getAllServices();

        const { duration, price, category, available } = filters;

        if (duration) {
            const durationNumber = parseInt(duration, 10);
            if (isNaN(durationNumber)) {
                const error = new Error('duration debe ser un número');
                error.status = 400;
                throw error;
            }
            services = services.filter(s => s.duration === durationNumber);
        }

        if (price) {
            const priceNumber = parseFloat(price);
            if (isNaN(priceNumber)) {
                const error = new Error('price debe ser un número');
                error.status = 400;
                throw error;
            }
            services = services.filter(s => s.price === priceNumber);
        }

        if (category) {
            services = services.filter(
                s => s.category.toLowerCase() === category.toLowerCase()
            );
        }

        if (available !== undefined) {
            if (available !== 'true' && available !== 'false') {
                const error = new Error('available debe ser "true" o "false"');
                error.status = 400;
                throw error;
            }
            const isAvailable = available === 'true';
            services = services.filter(s => s.available === isAvailable);
        }

        return services;
    }

    async getServiceById(id) {
        const service = await this.repository.getServiceById(id);

        if (!service) {
            const error = new Error(`Servicio con id ${id} no encontrado`);
            error.status = 404;
            throw error;
        }

        return service;
    }

    async createService(serviceData) {
        const requiredFields = ['name', 'description', 'duration', 'price', 'category', 'available'];
        for (const field of requiredFields) {
            if (!(field in serviceData)) {
                const error = new Error(`Service incompleto, falta el campo: ${field}`);
                error.status = 400;
                throw error;
            }
        }

        const services = await this.repository.getAllServices();
        const newId = this.getNextId(services);

        const newService = { ...serviceData, id: newId };
        services.push(newService);
        await this.repository.saveAllServices(services);
        return newService;

    }


    async updateService(id, updatedData) {

        try {
            const services = await this.getAllServices();
            const old_service_index = services.findIndex(service => service.id === parseInt(id));


            if (old_service_index === -1) {
                return null;
            }

            const updateService = { ...services[old_service_index], ...updatedData, id: services[old_service_index].id };
            services[old_service_index] = updateService;
            await this.repository.saveAllServices(services);
            return updateService;


        } catch (error) {
            console.error('Error actualizando el servicio.', error.message);
            throw error;
        }

    }


    async deleteService() {
        try {
            const services = await this.getAllServices();
            const serviceIndex = services.findIndex(s => s.id === parseInt(id));

            if (serviceIndex === -1) {
                return null;
            }

            const deletedService = services.splice(serviceIndex, 1)[0];
            //aqui termina el manejo del arreglo y entra en juego el repository
            await this.repository.saveAllServices(services);

            return deletedService;

        }

        catch (error) {
            console.error('Error borrando el servicio.', error.message);
            throw error;

        }
    }

    getNextId(services) {
        if (services.length === 0) return 1;
        const maxId = Math.max(...services.map(s => s.id));
        return maxId + 1
    }
}