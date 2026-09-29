import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import supertest from "supertest";
import { connectDB } from "../src/config/database.config.js";
import { app } from "../src/app.js";
import { ServiceModel } from "../src/dao/models/service.models.js";
import { BookingModel } from "../src/dao/models/booking.models.js";

const request = supertest(app);

const validBooking = {
  clientName: "María Gómez",
  clientEmail: "maria@example.com",
  date: "2026-09-10",
  time: "10:00",
  status: "confirmed",
};

const createdServiceIds = [];
const createdBookingIds = [];

async function createService(overrides = {}) {
  const service = {
    name: "Corte de cabello",
    description: "Corte de cabello clásico con máquina y tijera",
    duration: 30,
    price: 3500,
    category: "peluquería",
    available: true,
    ...overrides,
  };
  const res = await request.post("/api/services").send(service);
  createdServiceIds.push(res.body._id);
  return res.body;
}

async function createBooking(overrides = {}) {
  const res = await request
    .post("/api/bookings")
    .send({ ...validBooking, ...overrides });
  createdBookingIds.push(res.body._id);
  return res.body;
}

before(async () => {
  await connectDB();
});

after(async () => {
  await BookingModel.deleteMany({ _id: { $in: createdBookingIds } });
  await ServiceModel.deleteMany({ _id: { $in: createdServiceIds } });
  await mongoose.connection.close();
});

test("POST /api/bookings crea una reserva válida", async () => {
  const res = await request.post("/api/bookings").send(validBooking);
  assert.equal(res.status, 201);
  assert.ok(res.body._id);
  assert.equal(res.body.time, "10:00");
  assert.deepEqual(res.body.services, []);
  createdBookingIds.push(res.body._id);
});

test("POST /api/bookings con campo faltante devuelve 400", async () => {
  const { clientEmail, ...incomplete } = validBooking;
  const res = await request.post("/api/bookings").send(incomplete);
  assert.equal(res.status, 400);
});

test("GET /api/bookings incluye la reserva creada", async () => {
  const created = await createBooking();
  const res = await request.get("/api/bookings");
  assert.equal(res.status, 200);
  assert.ok(res.body.some((b) => b._id === created._id));
});

test("GET /api/bookings/:bid devuelve la reserva existente", async () => {
  const created = await createBooking();
  const res = await request.get(`/api/bookings/${created._id}`);
  assert.equal(res.status, 200);
  assert.equal(res.body._id, created._id);
});

test("GET /api/bookings/:bid con id malformado devuelve 404", async () => {
  const res = await request.get("/api/bookings/no-es-un-id-valido");
  assert.equal(res.status, 404);
});

test("GET /api/bookings/:bid con id inexistente devuelve 404", async () => {
  const res = await request.get("/api/bookings/507f1f77bcf86cd799439011");
  assert.equal(res.status, 404);
});

test("POST /api/bookings/:bid/services/:sid agrega un servicio disponible", async () => {
  const booking = await createBooking();
  const service = await createService({ available: true });

  const res = await request.post(
    `/api/bookings/${booking._id}/services/${service._id}`
  );
  assert.equal(res.status, 200);
  assert.equal(res.body.services.length, 1);
  assert.equal(res.body.services[0].service, service._id);
  assert.equal(res.body.services[0].quantity, 1);
});

test("POST /api/bookings/:bid/services/:sid repetido incrementa quantity", async () => {
  const booking = await createBooking();
  const service = await createService({ available: true });

  await request.post(`/api/bookings/${booking._id}/services/${service._id}`);
  const res = await request.post(
    `/api/bookings/${booking._id}/services/${service._id}`
  );

  assert.equal(res.status, 200);
  assert.equal(res.body.services.length, 1);
  assert.equal(res.body.services[0].quantity, 2);
});

test("POST /api/bookings/:bid/services/:sid con servicio no disponible devuelve 400", async () => {
  const booking = await createBooking();
  const service = await createService({ available: false });

  const res = await request.post(
    `/api/bookings/${booking._id}/services/${service._id}`
  );
  assert.equal(res.status, 400);
});

test("POST /api/bookings/:bid/services/:sid con servicio inexistente devuelve 404", async () => {
  const booking = await createBooking();

  const res = await request.post(
    `/api/bookings/${booking._id}/services/507f1f77bcf86cd799439011`
  );
  assert.equal(res.status, 404);
});

test("POST /api/bookings/:bid/services/:sid con booking inexistente devuelve 404", async () => {
  const service = await createService({ available: true });

  const res = await request.post(
    `/api/bookings/507f1f77bcf86cd799439011/services/${service._id}`
  );
  assert.equal(res.status, 404);
});

test("POST /api/bookings/:bid/services/:sid con ids malformados devuelve 404", async () => {
  const booking = await createBooking();
  const service = await createService({ available: true });

  const badBid = await request.post(
    `/api/bookings/no-es-un-id/services/${service._id}`
  );
  assert.equal(badBid.status, 404);

  const badSid = await request.post(
    `/api/bookings/${booking._id}/services/no-es-un-id`
  );
  assert.equal(badSid.status, 404);
});
