import { BookingsMongoDao } from "../dao/mongo/bookings.mongo.dao.js";

export class BookingsRepository {

    constructor(dao = new BookingsMongoDao()) {
        this.dao = dao;
    }

    getAllBookings(filterQuery) {
        return this.dao.getAll(filterQuery);
    }

    getBookingById(id) {
        return this.dao.getById(id);
    }

    createBooking(data) {
        return this.dao.create(data);
    }

    updateBooking(id, data) {
        return this.dao.updateById(id, data);
    }

    deleteBooking(id) {
        return this.dao.deleteById(id);
    }

}
