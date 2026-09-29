//hablar con MongoDB a través de Mongoose. Nada más. No valida reglas de negocio, no conoce HTTP.
import mongoose from "mongoose";
import { ServiceModel } from "../models/service.models.js";

export class ServicesMongoDao {

  async getAll(filterQuery = {}) {
    return ServiceModel.find(filterQuery);
  }

  async getById(id) {
    try {
      return await ServiceModel.findById(id);
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) return null;
      throw error;
    }
  }

  async create(service) {
    return ServiceModel.create(service);
  }

  async updateById(id, data) {
    try {
      return await ServiceModel.findByIdAndUpdate(id, data, {
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
      return await ServiceModel.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) return null;
      throw error;
    }
  }

}
