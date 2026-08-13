import fs from 'node:fs/promises';
class ServiceManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getServices() {
    // ¿qué hace este método, paso a paso?
  }

  async getServiceById(id) {
    // ...
  }

  async addService(serviceData) {
    // ...
  }

  async updateService(id, updatedData) {
    // ...
  }

  async deleteService(id) {
    // ...
  }

  getNextId(services) {
    // esta la vimos recién, ¿por qué no es async?
  }
}

export default ServiceManager;