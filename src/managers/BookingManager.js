import { Utf8Stream } from 'node:fs';
import fs from 'node:fs/promises';
import ServiceManager from '../managers/ServiceManager.js';



class BookingManager {

    constructor(filePath) {
        const serviceManager = new ServiceManager(SERVICES_DATA_PATH);
        this.filePath = filePath;
        this.serviceManager = serviceManager;
    }

    async getBookings() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            const bookings = JSON.parse(data);
            return bookings;
        }
        catch (error) {
            console.error('Error cargando bookings.')
            throw error;
        }
    }


    async getBookingById(id) {
        try {
            const bookings = await this.getBookings();
            const booking = bookings.find(booking => booking.id === parseInt(id));

            return booking ?? null;
        } catch (error) {
            console.error('Error buscando el booking.')
            throw error;
        }

    }

    async createBooking(bookingData) {

        const requiredFields = ['clientName', 'clientEmail', 'date', 'time', 'status', 'services'];

        for (const field of requiredFields) {
            if (!(field in bookingData)) {
                throw new Error(
                    `Booking incompleto, falta el campo: ${field}`
                );
            }
        }

        try {
            const bookings = await this.getBookings();
            const newId = this.getNextId(bookings);
            const newBooking = { ...bookingData, id: newId }// pisa el id de bookingData.;
            bookings.push(newBooking);
            await fs.writeFile(this.filePath, JSON.stringify(bookings, null, 2), 'utf-8')

            return newBooking;
        } catch (error) {

            console.error('Error agregando el booking.', error.message);
            throw error;

        }
    }

    async addServiceToBooking(sid, bid) {
        const service = await this.serviceManager.getServiceById(sid);
        if (service !== null) {

            const bookings = await this.getBookings();

            const bookingIndex = bookings.findIndex(b => b.id === parseInt(bid));
            if (bookingIndex === -1) {
                return null;
            } else {
                const booking = bookings[bookingIndex];
                if (!booking.services) {
                    booking.services = [];
                }
                const existingService = booking.services.find(s => s.service === sid);
                if (existingService) {
                    //si ya existe se incrementa quantity
                    existingService.quantity += 1;

                } else {

                    booking.services.push({ service: sid, quantity: 1 });
                }
                bookings[bookingIndex] = booking;
                await fs.writeFile(this.filePath, JSON.stringify(bookings, null, 2), 'utf-8');

            }



        } else{
             throw new Error(
                    `Service con sid:${sid} no existe.`
                );
        }

    }



    getNextId(bookings) {
        if (bookings.length === 0) return 1;
        const maxId = Math.max(...bookings.map(b => b.id));
        return maxId + 1
    }

}