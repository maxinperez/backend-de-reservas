import { BookingsRepository } from "../repositories/bookings.repository.js";
import { ServicesService } from "./services.service.js";

export class BookingsService {

    constructor(repository = new BookingsRepository(), servicesService = new ServicesService()) {
        this.repository = repository;
        this.servicesService = servicesService;
    }

    async getBookings() {
        try {
          const bookings = await this.repository.getAllBookings();
          return bookings;
        } catch (error) {
          console.error("Error cargando bookings.");
          throw error;
        }
      }

    async getBookingById(bid) {
        try {
            return await this.repository.getBookingById(bid);
        } catch (error) {
            console.error("Error buscando el booking.");
            throw error;
        }
    }

    async createBooking(bookingData){
        const requiredFields = [
              "clientName",
              "clientEmail",
              "date",
              "time",
              "status",
            ];

            for (const field of requiredFields) {
              if (!(field in bookingData)) {
                const error = new Error(`Booking incompleto, falta el campo: ${field}`);
                error.status = 400;
                throw error;
              }
            }

            if (!("services" in bookingData)) {
              bookingData.services = [];
            }

            try {
              return await this.repository.createBooking(bookingData);
            } catch (error) {
              console.error("Error agregando el booking.", error.message);
              throw error;
            }
    }

     async addServiceToBooking(bid, sid) {
        const booking = await this.repository.getBookingById(bid);

        if (!booking) {
          return null;
        }

        //se valida el service antes de tocar la reserva: lanza 404 si no existe
        const service = await this.servicesService.getServiceById(sid);

        if (!service.available) {
          const error = new Error(`Service con id ${sid} no está disponible`);
          error.status = 400;
          throw error;
        }

        const existingService = booking.services.find((s) => s.service.toString() === sid.toString());
        if (existingService !== undefined) {
          //si ya existe se incrementa quantity
          existingService.quantity += 1;
        } else {
          booking.services.push({ service: sid, quantity: 1 });
        }

        return this.repository.updateBooking(bid, { services: booking.services });
      }

}
