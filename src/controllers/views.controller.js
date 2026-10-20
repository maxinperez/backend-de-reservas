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
            const { payload, ...pagination } = await this.servicesService.getAllServices(req.query);

            // conserva los filtros activos (category, limit, sortBy...) y solo cambia la página
            const buildUrl = (targetPage) => {
                const params = new URLSearchParams(req.query);
                params.set('page', targetPage);
                return `${req.baseUrl}${req.path}?${params}`;
            };

            const { page, totalPages, hasPrevPage, hasNextPage } = pagination;

            res.render('services', {
                services: payload.map(s => s.toObject()),
                ...pagination,
                // si piden una página más allá del final, "Anterior" vuelve a la última real
                prevUrl: hasPrevPage ? buildUrl(Math.min(page - 1, totalPages)) : null,
                nextUrl: hasNextPage ? buildUrl(page + 1) : null,
            });
        } catch (error) {
            next(error);
        }
    };

    getBookings = async (req, res, next) => {
        try {
            const bookings = await this.bookingsService.getBookings();
            res.render('bookings', {
                bookings: bookings.map(b => {
                    const booking = b.toObject();
                    // la fecha se guarda como medianoche UTC; formatearla en hora local la corre al día anterior
                    return {
                        ...booking,
                        date: booking.date.toLocaleDateString('es-AR', { timeZone: 'UTC' }),
                    };
                }),
            });
        } catch (error) {
            next(error);
        }
    };
};

export const viewsController = new ViewsController();
