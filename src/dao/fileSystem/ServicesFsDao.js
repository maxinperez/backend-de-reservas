//hablar con el archivo JSON. Nada más. No valida reglas de negocio, no conoce HTTP.
import fs from 'fs/promises';
import { SERVICES_DATA_PATH } from '../../config/env.config.js';

export class ServicesFsDao {

  async getAll() {
    try {
      const data = await fs.readFile(SERVICES_DATA_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') return []; // 
      throw error;
    }
  }

  async getById(id) {
    try {
      const services = await this.getAll();
      return services.find(service => service.id === id) || null;

    } catch (error) {
      throw error;
    }

  }

  async create(service) {
    try {
      const services = await this.getAll();
      services.push(service);
      await fs.writeFile(
        SERVICES_DATA_PATH,
        JSON.stringify(services, null, 2),
        'utf-8'
      );
      return service;

    } catch (error) {

    }
  }


  async saveAll(services) {
    try {
      await fs.writeFile(
        SERVICES_DATA_PATH,
        JSON.stringify(services, null, 2),
        'utf-8'
      );
    
    } catch (error) {

    }
  }



}
