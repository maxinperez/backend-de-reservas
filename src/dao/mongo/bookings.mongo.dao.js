//hablar con MongoDB a través de Mongoose. Nada más. No valida reglas de negocio, no conoce HTTP.
import mongoose from "mongoose";
import { BookingModel } from "../models/booking.models.js";
import { ServiceModel } from "../models/service.models.js";

export class BookingsMongoDao {

  async getAll(filterQuery = {}) {
    return BookingModel.find(filterQuery);
  }

  // populate es solo para consultar: reemplaza cada referencia por el servicio completo en la respuesta, no en la base
  async getById(id, { populate = false } = {}) {
    try {
      const query = BookingModel.findById(id);
      if (populate) {
        query.populate({ path: 'services.service', model: ServiceModel });
      }
      return await query;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) return null;
      throw error;
    }
  }

  async create(booking) {
    return BookingModel.create(booking);
  }

  async updateById(id, data) {
    try {
      return await BookingModel.findByIdAndUpdate(id, data, {
        returnDocument: 'after',
        runValidators: true,
      });
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) return null;
      throw error;
    }
  }

  async deleteById(id) {
    try {
      return await BookingModel.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) return null;
      throw error;
    }
  }

}
