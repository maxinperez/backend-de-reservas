//lógica de negocio. Valida reglas, calcula IDs, lanza errores de dominio. No conoce HTTP (nada de req/res), no conoce el DAO (solo al repository).
import { ServicesRepository } from "../repositories/services.repository.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const DEFAULT_SORT_BY = 'createdAt';
const DEFAULT_ORDER = 'asc';
const SORTABLE_FIELDS = ['name', 'price', 'duration', 'category', 'createdAt'];

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class ServicesService {

    constructor(repository = new ServicesRepository()) {
        this.repository = repository;
    }

    async getAllServices(filters = {}) {

        const { duration, price, category, available, page, limit, sortBy, order } = filters;
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

        const pageNumber = page === undefined ? DEFAULT_PAGE : Number(page);
        if (!Number.isInteger(pageNumber) || pageNumber < 1) {
            const error = new Error('page debe ser un entero mayor o igual a 1');
            error.status = 400;
            throw error;
        }

        const limitNumber = limit === undefined ? DEFAULT_LIMIT : Number(limit);
        if (!Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > MAX_LIMIT) {
            const error = new Error(`limit debe ser un entero entre 1 y ${MAX_LIMIT}`);
            error.status = 400;
            throw error;
        }

        const sortField = sortBy === undefined ? DEFAULT_SORT_BY : sortBy;
        if (!SORTABLE_FIELDS.includes(sortField)) {
            const error = new Error(`sortBy debe ser uno de: ${SORTABLE_FIELDS.join(', ')}`);
            error.status = 400;
            throw error;
        }

        const sortOrder = order === undefined ? DEFAULT_ORDER : order;
        if (sortOrder !== 'asc' && sortOrder !== 'desc') {
            const error = new Error('order debe ser "asc" o "desc"');
            error.status = 400;
            throw error;
        }

        const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

        const { docs, total } = await this.repository.getAllServices(filterQuery, {
            page: pageNumber,
            limit: limitNumber,
            sort,
        });

        const totalPages = Math.ceil(total / limitNumber);

        return {
            payload: docs,
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages,
            hasPrevPage: pageNumber > 1,
            hasNextPage: pageNumber < totalPages,
        };
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
