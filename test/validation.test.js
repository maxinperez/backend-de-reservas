import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import supertest from "supertest";
import { connectDB } from "../src/config/database.config.js";
import { app } from "../src/app.js";
import { ServiceModel } from "../src/dao/models/service.models.js";
import { BookingModel } from "../src/dao/models/booking.models.js";

const request = supertest(app);

// categoría única por corrida: permite contar los servicios de estos tests sin depender de la base
const uniqueCategory = `test-validation-${Date.now()}`;

const validService = {
  name: "Servicio validación",
  description: "Servicio creado por los tests de validación",
  duration: 30,
  price: 3500,
  category: uniqueCategory,
  available: true,
};

const validBooking = {
  clientName: "María Gómez",
  clientEmail: "maria@example.com",
  date: "2026-09-10",
  time: "10:00",
  status: "confirmed",
};

const createdServiceIds = [];
const createdBookingIds = [];

before(async () => {
  // server.js es quien crea el io real; en los tests se reemplaza por uno que no hace nada
  app.set("io", { emit: () => {} });
  await connectDB();
});

after(async () => {
  await ServiceModel.deleteMany({ _id: { $in: createdServiceIds } });
  await BookingModel.deleteMany({ _id: { $in: createdBookingIds } });
  await mongoose.connection.close();
});

// ---------- POST /api/services ----------

const invalidServices = {
  "price con texto": { price: "abc" },
  "price negativo": { price: -5 },
  "price en cero": { price: 0 },
  "duration decimal": { duration: 1.5 },
  "duration con texto": { duration: "30" },
  "available con texto": { available: "si" },
  "name vacío": { name: "   " },
  "name con número": { name: 123 },
};

for (const [label, override] of Object.entries(invalidServices)) {
  test(`POST /api/services con ${label} devuelve 400`, async () => {
    const res = await request
      .post("/api/services")
      .send({ ...validService, ...override });
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });
}

test("POST /api/services inválido no llega a la base (no se crea nada)", async () => {
  const before = await ServiceModel.countDocuments({ category: uniqueCategory });
  await request.post("/api/services").send({ ...validService, price: "abc" });
  await request.post("/api/services").send({ ...validService, name: "" });
  const after = await ServiceModel.countDocuments({ category: uniqueCategory });
  assert.equal(after, before);
});

test("POST /api/services con campo faltante indica cuál falta", async () => {
  const { description, ...incomplete } = validService;
  const res = await request.post("/api/services").send(incomplete);
  assert.equal(res.status, 400);
  assert.match(res.body.error, /description/);
});

test("POST /api/services sin cuerpo devuelve 400", async () => {
  const res = await request.post("/api/services");
  assert.equal(res.status, 400);
});

test("POST /api/services descarta los campos desconocidos", async () => {
  const res = await request
    .post("/api/services")
    .send({ ...validService, campoInventado: "x" });
  assert.equal(res.status, 201);
  assert.equal(res.body.campoInventado, undefined);
  createdServiceIds.push(res.body._id);
});

// ---------- PUT /api/services/:id ----------

test("PUT /api/services/:id con actualización parcial válida devuelve 200", async () => {
  const created = await request.post("/api/services").send(validService);
  createdServiceIds.push(created.body._id);

  const res = await request
    .put(`/api/services/${created.body._id}`)
    .send({ price: 4200 });
  assert.equal(res.status, 200);
  assert.equal(res.body.price, 4200);
  assert.equal(res.body.name, validService.name);
});

test("PUT /api/services/:id con price inválido devuelve 400 y no modifica el servicio", async () => {
  const created = await request.post("/api/services").send(validService);
  createdServiceIds.push(created.body._id);

  const res = await request
    .put(`/api/services/${created.body._id}`)
    .send({ price: "gratis" });
  assert.equal(res.status, 400);

  const stored = await ServiceModel.findById(created.body._id).lean();
  assert.equal(stored.price, validService.price);
});

test("PUT /api/services/:id con cuerpo vacío devuelve 400", async () => {
  const created = await request.post("/api/services").send(validService);
  createdServiceIds.push(created.body._id);

  const res = await request.put(`/api/services/${created.body._id}`).send({});
  assert.equal(res.status, 400);
  assert.match(res.body.error, /al menos un campo/);
});

// ---------- POST /api/bookings ----------

const invalidBookings = {
  "email inválido": { clientEmail: "no-es-un-email" },
  "time fuera de rango": { time: "25:00" },
  "time sin formato HH:MM": { time: "10" },
  "date con formato incorrecto": { date: "10/09/2026" },
  "date inexistente": { date: "2026-02-31" },
  "status no permitido": { status: "inventado" },
  "clientName vacío": { clientName: "" },
  "services con ObjectId inválido": { services: [{ service: "abc", quantity: 1 }] },
  "services con quantity en cero": {
    services: [{ service: "507f1f77bcf86cd799439011", quantity: 0 }],
  },
  "services que no es un listado": { services: "abc" },
};

for (const [label, override] of Object.entries(invalidBookings)) {
  test(`POST /api/bookings con ${label} devuelve 400`, async () => {
    const res = await request
      .post("/api/bookings")
      .send({ ...validBooking, ...override });
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });
}

test("POST /api/bookings inválido no llega a la base (no se crea nada)", async () => {
  const before = await BookingModel.countDocuments({ clientEmail: "no-llega@example.com" });
  await request
    .post("/api/bookings")
    .send({ ...validBooking, clientEmail: "no-llega@example.com", time: "99:99" });
  const after = await BookingModel.countDocuments({ clientEmail: "no-llega@example.com" });
  assert.equal(after, before);
});

test("POST /api/bookings sin services aplica el valor por defecto []", async () => {
  const res = await request.post("/api/bookings").send(validBooking);
  assert.equal(res.status, 201);
  assert.deepEqual(res.body.services, []);
  createdBookingIds.push(res.body._id);
});

test("POST /api/bookings con services válidos aplica quantity=1 por defecto", async () => {
  const service = await request.post("/api/services").send(validService);
  createdServiceIds.push(service.body._id);

  const res = await request
    .post("/api/bookings")
    .send({ ...validBooking, services: [{ service: service.body._id }] });
  assert.equal(res.status, 201);
  assert.equal(res.body.services[0].quantity, 1);
  createdBookingIds.push(res.body._id);
});

// ---------- POST /api/bookings/:bid/services/:sid ----------

test("POST /api/bookings/:bid/services/:sid con ids inválidos devuelve 400", async () => {
  const res = await request.post("/api/bookings/abc/services/xyz");
  assert.equal(res.status, 400);
  assert.match(res.body.error, /bid/);
  assert.match(res.body.error, /sid/);
});
