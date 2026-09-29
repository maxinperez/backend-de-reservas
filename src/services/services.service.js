//lógica de negocio. Valida reglas, calcula IDs, lanza errores de dominio. No conoce HTTP (nada de req/res), no conoce el DAO (solo al repository).
import { ServicesRepository } from "../repositories/services.repository.js";

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class ServicesService {

    constructor(repository = new ServicesRepository()) {
        this.repository = repository;
    }

    async getAllServices(filters = {}) {

        const { duration, price, category, available } = filters;
        const filterQuery = {};

        if (duration) {
            const durationNumber = parseInt(duration, 10);
            if (isNaN(durationNumber)) {
                const error = new Error('duration debe ser un número');
                error.status = 400;
                throw error;
            }
            filterQuery.duration = durationNumber;
        }

        if (price) {
            const priceNumber = parseFloat(price);
            if (isNaN(priceNumber)) {
                const error = new Error('price debe ser un número');
                error.status = 400;
                throw error;
            }
            filterQuery.price = priceNumber;
        }

        if (category) {
            filterQuery.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
        }

        if (available !== undefined) {
            if (available !== 'true' && available !== 'false') {
                const error = new Error('available debe ser "true" o "false"');
                error.status = 400;
                throw error;
            }
            filterQuery.available = available === 'true';
        }

        return this.repository.getAllServices(filterQuery);
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

        return this.repository.createService(serviceData);
    }


    async updateService(id, updatedData) {

        try {
            return await this.repository.updateService(id, updatedData);

        } catch (error) {
            console.error('Error actualizando el servicio.', error.message);
            throw error;
        }

    }


    async deleteService(id) {
        try {
            return await this.repository.deleteService(id);

        }

        catch (error) {
            console.error('Error borrando el servicio.', error.message);
            throw error;

        }
    }
}
