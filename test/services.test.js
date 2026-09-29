import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import supertest from "supertest";
import { connectDB } from "../src/config/database.config.js";
import { app } from "../src/app.js";
import { ServiceModel } from "../src/dao/models/service.models.js";

const request = supertest(app);

const validService = {
  name: "Corte de cabello",
  description: "Corte de cabello clásico con máquina y tijera",
  duration: 30,
  price: 3500,
  category: "peluquería",
  available: true,
};

const createdIds = [];

before(async () => {
  await connectDB();
});

after(async () => {
  await ServiceModel.deleteMany({ _id: { $in: createdIds } });
  await mongoose.connection.close();
});

test("POST /api/services crea un servicio válido", async () => {
  const res = await request.post("/api/services").send(validService);
  assert.equal(res.status, 201);
  assert.ok(res.body._id);
  assert.equal(res.body.name, validService.name);
  createdIds.push(res.body._id);
});

test("POST /api/services con campo faltante devuelve 400", async () => {
  const { price, ...incomplete } = validService;
  const res = await request.post("/api/services").send(incomplete);
  assert.equal(res.status, 400);
});

test("GET /api/services incluye el servicio creado", async () => {
  const created = await request.post("/api/services").send(validService);
  createdIds.push(created.body._id);

  const res = await request.get("/api/services");
  assert.equal(res.status, 200);
  assert.ok(res.body.some((s) => s._id === created.body._id));
});

test("GET /api/services filtra por duration/category/available", async () => {
  const created = await request.post("/api/services").send(validService);
  createdIds.push(created.body._id);

  const byDuration = await request.get("/api/services?duration=30");
  assert.equal(byDuration.status, 200);
  assert.ok(byDuration.body.some((s) => s._id === created.body._id));

  const byCategory = await request.get("/api/services?category=PELUQUERÍA");
  assert.equal(byCategory.status, 200);
  assert.ok(byCategory.body.some((s) => s._id === created.body._id));

  const byAvailable = await request.get("/api/services?available=true");
  assert.equal(byAvailable.status, 200);
  assert.ok(byAvailable.body.every((s) => s.available === true));

  const invalidAvailable = await request.get("/api/services?available=maybe");
  assert.equal(invalidAvailable.status, 400);
});

test("GET /api/services/:id devuelve el servicio existente", async () => {
  const created = await request.post("/api/services").send(validService);
  createdIds.push(created.body._id);

  const res = await request.get(`/api/services/${created.body._id}`);
  assert.equal(res.status, 200);
  assert.equal(res.body._id, created.body._id);
});

test("GET /api/services/:id con id malformado devuelve 404", async () => {
  const res = await request.get("/api/services/no-es-un-id-valido");
  assert.equal(res.status, 404);
});

test("GET /api/services/:id con id inexistente devuelve 404", async () => {
  const res = await request.get("/api/services/507f1f77bcf86cd799439011");
  assert.equal(res.status, 404);
});

test("PUT /api/services/:id actualiza el servicio", async () => {
  const created = await request.post("/api/services").send(validService);
  createdIds.push(created.body._id);

  const res = await request
    .put(`/api/services/${created.body._id}`)
    .send({ price: 4000 });
  assert.equal(res.status, 200);
  assert.equal(res.body.price, 4000);
  assert.equal(res.body.name, validService.name);
});

test("PUT /api/services/:id con id malformado devuelve 404", async () => {
  const res = await request
    .put("/api/services/no-es-un-id-valido")
    .send({ price: 4000 });
  assert.equal(res.status, 404);
});

test("DELETE /api/services/:id elimina el servicio", async () => {
  const created = await request.post("/api/services").send(validService);

  const res = await request.delete(`/api/services/${created.body._id}`);
  assert.equal(res.status, 200);

  const afterDelete = await request.get(`/api/services/${created.body._id}`);
  assert.equal(afterDelete.status, 404);
});

test("DELETE /api/services/:id con id malformado devuelve 404", async () => {
  const res = await request.delete("/api/services/no-es-un-id-valido");
  assert.equal(res.status, 404);
});
