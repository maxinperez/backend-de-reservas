//interfaz uniforme de acceso a datos. Traduce el "lenguaje" del dominio a operaciones del DAO. Si mañana cambiás de JSON a SQL, solo cambiás el DAO y el repository sigue igual.
import { ServicesMongoDao } from "../dao/mongo/services.mongo.dao.js";

export class ServicesRepository{


    constructor(dao = new ServicesMongoDao()) {
    this.dao = dao;
  }

  getAllServices(filterQuery) {
    return this.dao.getAll(filterQuery);
  }

  getServiceById(id) {
    return this.dao.getById(id);
  }

  createService(data){
    return this.dao.create(data);
  }

  updateService(id, data) {
    return this.dao.updateById(id, data);
  }

  deleteService(id) {
    return this.dao.deleteById(id);
  }

}
