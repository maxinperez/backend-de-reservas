import { BookingsFsDao } from "../dao/fileSystem/bookings.fs.dao.js";

export class BookingsRepository {

    constructor(dao = new BookingsFsDao()) {
        this.dao = dao;
    }

    getAllBookings() {
        return this.dao.getAll();
    }

    getBookingById(id) {
        return this.dao.getById(id);
    }

    saveBooking(booking) {
        return this.dao.create(booking);
    }

    saveAllBookings(bookings) {
        return this.dao.saveAll(bookings);
    }

}