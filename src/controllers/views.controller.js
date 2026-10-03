import { ServicesService } from '../services/services.service.js';
import { BookingsService } from '../services/bookings.service.js';


export class ViewsController {
    constructor(
        servicesService = new ServicesService(),
        bookingsService = new BookingsService()
    ) {
        this.servicesService = servicesService;
        this.bookingsService = bookingsService;
    }

    getServices = async (req, res, next) => {
        try {
            const services = await this.servicesService.getAllServices();
            res.render('services', { services: services.map(s => s.toObject()) });
        } catch (error) {
            next(error);
        }
    };

    getBookings = async (req, res, next) => {
        try {
            const bookings = await this.bookingsService.getBookings();
            res.render('bookings', { bookings: bookings.map(b => b.toObject()) });
        } catch (error) {
            next(error);
        }
    };
};

export const viewsController = new ViewsController();
