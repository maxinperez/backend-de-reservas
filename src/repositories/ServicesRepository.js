//interfaz uniforme de acceso a datos. Traduce el "lenguaje" del dominio a operaciones del DAO. Si mañana cambiás de JSON a SQL, solo cambiás el DAO y el repository sigue igual.
import { ServicesFsDao } from "../dao/fileSystem/ServicesFsDao.js";

export class ServicesRepository{


    constructor(dao = new ServicesFsDao()) {
    this.dao = dao; 
  }

  getAllServices() {
    return this.dao.getAll();
  }

  getServiceById(id) {
    return this.dao.getById(id);
  }

  saveService(service){
    return this.dao.create(service);
  }

  saveAllServices(services) {
    return this.dao.saveAll(services);
  }

}