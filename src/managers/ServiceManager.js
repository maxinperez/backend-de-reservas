import { Utf8Stream } from 'node:fs';
import fs from 'node:fs/promises';
class ServiceManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getServices() {
   try{const data = await fs.readFile(this.filePath, 'utf-8');    
    const services = JSON.parse(data);
    return services;
  } 
    catch(error){
      console.error('Error cargando servicios.')
      throw error;
    }
  }

  async getServiceById(id) {
    try{
      const services = await this.getServices();
      const service = services.find(service => service.id === parseInt(id));
  
      return service ?? null;
    } catch(error){
      console.error('Error buscando el servicio.')
      throw error;
    }

  }

  async addService(serviceData) {
      const requiredFields = ['name', 'description', 'duration', 'price', 'category', 'available'];

      for( const field of requiredFields){
        if(!(field in serviceData)){
          throw new Error(
            `Service incompleto, falta el campo: ${field}`
          );
        }
      }

      try{
        const services = await this.getServices();
        const newId = this.getNextId(services);
        const newService = {...serviceData, id: newId}
        services.push(newService);
        await fs.writeFile(this.filePath, JSON.stringify(services, null, 2), 'utf-8');
      
        return newService;
      } catch (error) {
        console.error('Error agregando el servicio.')
        throw error;
      }
  }

  async updateService(id, updatedData) {
    
  }

  async deleteService(id) {
    // ...
  }

  getNextId(services) {
    if (services.length === 0) return 1;
    const maxId = Math.max(...services.map(s => s.id));
    return maxId + 1
  }
}

export default ServiceManager;