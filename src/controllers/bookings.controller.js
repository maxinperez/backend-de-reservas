import { BookingsService } from '../services/bookings.service.js'

export class BookingsController {

    constructor(service = new BookingsService()) {
        this.service = service;
    }



    getById = async (req, res, next) => {
        try {
            const id = req.params.bid;
            const booking = await this.service.getBookingById(id);

            if (booking === null) {
                return res.status(404).json({ error: 'Booking no encontrado' });
            }
            res.status(200).json(booking);
        } catch (error) {
            next(error);
        }

    }

    create = async (req, res, next) => {
        try {
            const newBooking = await this.service.createBooking(req.body);
            res.status(201).json(newBooking);
        } catch (error) {
            next(error);
        }
    }


    getAll = async (req, res, next) => {
        try {
            const bookings = await this.service.getBookings();
            res.status(200).json(bookings);
        } catch (error) {
            next(error);
        }
    }

    addServiceToBooking = async (req, res, next) => {

        const sid = req.params.sid;
        const bid = req.params.bid;

        try {
            const updatedBooking = await this.service.addServiceToBooking(bid, sid);

            if (updatedBooking === null) {
                return res.status(404).json({ error: `Booking con id ${bid} no encontrado` });
            }

            res.status(200).json(updatedBooking);

        }
        catch (error) {
            next(error);

        }
    }

}

export const bookingsController = new BookingsController();

