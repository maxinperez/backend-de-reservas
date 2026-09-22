import { ServicesService } from "../services/servicesService.js";

class ServiceManager {
  constructor() {
    this.service = new ServicesService();
  }

  async getAllServices(filters = {}) {
    return this.service.getAllServices(filters);
  }

  async getServiceById(id) {
    return this.service.getServiceById(id);
  }

  async createService(data) {
    return this.service.createService(data);
  }

  async updateService(id, data) {
    return this.service.updateService(id, data);
  }

  async deleteService(id) {
    return this.service.deleteService(id);
  }
}

export default ServiceManager;
