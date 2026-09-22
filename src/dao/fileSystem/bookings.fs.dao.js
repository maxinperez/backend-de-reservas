import fs from 'fs/promises';
import { BOOKINGS_DATA_PATH } from '../../config/env.config.js';

export class BookingsFsDao {

    async getAll() {
        try {
            const data = await fs.readFile(BOOKINGS_DATA_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') return []; // 
            throw error;
        }
    }

    async getById(id) {
        try {
            const bookings = await this.getAll();
            return bookings.find(booking => booking.id === id) || null;

        } catch (error) {
            throw error;
        }

    }

    async create(booking) {
        try {
            const bookings = await this.getAll();
            bookings.push(booking);
            await fs.writeFile(
                BOOKINGS_DATA_PATH,
                JSON.stringify(bookings, null, 2),
                'utf-8'
            );
            return booking;

        } catch (error) {
            throw error;
        }
    }


    async saveAll(bookings) {
        try {
            await fs.writeFile(
                BOOKINGS_DATA_PATH,
                JSON.stringify(bookings, null, 2),
                'utf-8'
            );

        } catch (error) {
            throw error;
        }
    }
}