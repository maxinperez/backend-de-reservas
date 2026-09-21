import { Utf8Stream } from 'node:fs';
import fs from 'node:fs/promises';


class ServiceManager {
  constructor(filePath) {
    this.filePath = filePath;
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
        const newService = {...serviceData, id: newId}// pisa el id de serviceData.
        services.push(newService);
        await fs.writeFile(this.filePath, JSON.stringify(services, null, 2), 'utf-8');
      
        return newService;
      } catch (error) {
        console.error('Error agregando el servicio.', error.message)
        throw error;
      }
  }

  async updateService(id, updatedData) {
    
    try{
       const services = await this.getServices();
        const old_service_index = services.findIndex( service => service.id === parseInt(id));
       

        if(old_service_index === -1){
          return null;
        }

        const updateService = {...services[old_service_index],...updatedData, id: services[old_service_index].id};
        
        services[old_service_index] = updateService;

        await fs.writeFile(this.filePath, JSON.stringify(services, null, 2), 'utf-8');

        return updateService;
      

    } catch(error){
      console.error('Error actualizando el servicio.', error.message);
      throw error;
    }
      
  }

  async deleteService(id) {
    try{
        const services = await this.getServices();
        const serviceIndex = services.findIndex( s => s.id === parseInt(id));

        if(serviceIndex === -1){
          return null;
        }

        const deletedService = services.splice(serviceIndex, 1)[0];
        await fs.writeFile(this.filePath, JSON.stringify(services, null, 2), 'utf-8');

        return deletedService;
 
    } 
    
    catch(error){
      console.error('Error borrando el servicio.', error.message);
      throw error;

    }
  }

  getNextId(services) {
    if (services.length === 0) return 1;
    const maxId = Math.max(...services.map(s => s.id));
    return maxId + 1
  }
}

export default ServiceManager;