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
            const bookings = await this.repository.getAllBookings();
            const booking = bookings.find((booking) => booking.id === parseInt(bid));

            return booking ?? null;
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

            try {
              const bookings = await this.getBookings();
              const newId = this.getNextId(bookings);
              if (!("services" in bookingData)) {
                bookingData.services = [];
              }
              const newBooking = { ...bookingData, id: newId }; // pisa el id de bookingData.;
              bookings.push(newBooking);
              await this.repository.saveAllBookings(bookings);
              return newBooking;
            } catch (error) {
              console.error("Error agregando el booking.", error.message);
              throw error;
            }
    }

     async addServiceToBooking(bid, sid) {
        const bookings = await this.getBookings();

        const bookingIndex = bookings.findIndex((b) => b.id === parseInt(bid));

        if (bookingIndex === -1) {
          return null;
        } else {
          //se valida el service antes de tocar la reserva: lanza 404 si no existe
          const service = await this.servicesService.getServiceById(parseInt(sid));

          if (!service.available) {
            const error = new Error(`Service con id ${sid} no está disponible`);
            error.status = 400;
            throw error;
          }

          const booking = bookings[bookingIndex];

          const existingService = booking.services.find((s) => s.service === parseInt(sid));
          if (existingService !== undefined) {
            //si ya existe se incrementa quantity
            existingService.quantity += 1;
          } else {
            booking.services.push({ service: parseInt(sid), quantity: 1 });
          }
          bookings[bookingIndex] = booking;
          await this.repository.saveAllBookings(bookings);

          return booking;
        }
      }


    getNextId(bookings) {
        if (bookings.length === 0) return 1;
        const maxId = Math.max(...bookings.map(s => s.id));
        return maxId + 1
    }
}