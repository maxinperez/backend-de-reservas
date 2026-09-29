//hablar con MongoDB a través de Mongoose. Nada más. No valida reglas de negocio, no conoce HTTP.
import mongoose from "mongoose";
import { BookingModel } from "../models/booking.models.js";

export class BookingsMongoDao {

  async getAll(filterQuery = {}) {
    return BookingModel.find(filterQuery);
  }

  async getById(id) {
    try {
      return await BookingModel.findById(id);
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
