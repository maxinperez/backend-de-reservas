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

// categoría única por corrida: aísla los tests del resto de los servicios que haya en Atlas
const uniqueCategory = `test-cat-${Date.now()}`;

async function createService(overrides = {}) {
  const res = await request
    .post("/api/services")
    .send({ ...validService, category: uniqueCategory, ...overrides });
  createdIds.push(res.body._id);
  return res.body;
}

before(async () => {
  // server.js es quien crea el io real; en los tests se reemplaza por uno que no hace nada
  app.set("io", { emit: () => {} });
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
  const created = await createService();

  const res = await request.get(`/api/services?category=${uniqueCategory}`);
  assert.equal(res.status, 200);
  assert.ok(res.body.payload.some((s) => s._id === created._id));
});

test("GET /api/services filtra por duration/category/available", async () => {
  const created = await createService({ duration: 30 });

  const byDuration = await request.get(
    `/api/services?category=${uniqueCategory}&duration=30`
  );
  assert.equal(byDuration.status, 200);
  assert.ok(byDuration.body.payload.some((s) => s._id === created._id));

  const byCategory = await request.get(
    `/api/services?category=${uniqueCategory.toUpperCase()}`
  );
  assert.equal(byCategory.status, 200);
  assert.ok(byCategory.body.payload.some((s) => s._id === created._id));

  const byAvailable = await request.get(
    `/api/services?category=${uniqueCategory}&available=true`
  );
  assert.equal(byAvailable.status, 200);
  assert.ok(byAvailable.body.payload.length > 0);
  assert.ok(byAvailable.body.payload.every((s) => s.available === true));

  const invalidAvailable = await request.get("/api/services?available=maybe");
  assert.equal(invalidAvailable.status, 400);
});

test("GET /api/services sin parámetros usa page=1 y limit=10 por defecto", async () => {
  await createService();

  const res = await request.get(`/api/services?category=${uniqueCategory}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.page, 1);
  assert.equal(res.body.limit, 10);
  assert.ok(Array.isArray(res.body.payload));
});

// los 3 servicios de paginación usan su propia categoría para que los totales sean exactos
const paginationCategory = `${uniqueCategory}-paginacion`;

test("paginación: 3 servicios con limit=2 se reparten en 2 páginas", async () => {
  await createService({ name: "Pag A", price: 100, category: paginationCategory });
  await createService({ name: "Pag B", price: 200, category: paginationCategory });
  await createService({ name: "Pag C", price: 300, category: paginationCategory });

  const page1 = await request.get(
    `/api/services?category=${paginationCategory}&limit=2&page=1`
  );
  assert.equal(page1.status, 200);
  assert.equal(page1.body.payload.length, 2);
  assert.equal(page1.body.total, 3);
  assert.equal(page1.body.page, 1);
  assert.equal(page1.body.limit, 2);
  assert.equal(page1.body.totalPages, 2);
  assert.equal(page1.body.hasPrevPage, false);
  assert.equal(page1.body.hasNextPage, true);

  const page2 = await request.get(
    `/api/services?category=${paginationCategory}&limit=2&page=2`
  );
  assert.equal(page2.status, 200);
  assert.equal(page2.body.payload.length, 1);
  assert.equal(page2.body.hasPrevPage, true);
  assert.equal(page2.body.hasNextPage, false);
});

test("paginación: el orden por defecto es el de creación (createdAt asc)", async () => {
  const res = await request.get(`/api/services?category=${paginationCategory}`);
  assert.equal(res.status, 200);
  assert.deepEqual(
    res.body.payload.map((s) => s.name),
    ["Pag A", "Pag B", "Pag C"]
  );
});

test("ordenamiento: sortBy=price con order=desc y order=asc", async () => {
  const desc = await request.get(
    `/api/services?category=${paginationCategory}&sortBy=price&order=desc`
  );
  assert.equal(desc.status, 200);
  assert.deepEqual(
    desc.body.payload.map((s) => s.price),
    [300, 200, 100]
  );

  const asc = await request.get(
    `/api/services?category=${paginationCategory}&sortBy=price&order=asc`
  );
  assert.equal(asc.status, 200);
  assert.deepEqual(
    asc.body.payload.map((s) => s.price),
    [100, 200, 300]
  );
});

test("paginación: una página más allá del final devuelve payload vacío", async () => {
  const res = await request.get(
    `/api/services?category=${paginationCategory}&page=99`
  );
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.payload, []);
  assert.equal(res.body.total, 3);
  assert.equal(res.body.hasPrevPage, true);
  assert.equal(res.body.hasNextPage, false);
});

const invalidQueries = [
  "page=0",
  "page=abc",
  "limit=0",
  "limit=abc",
  "limit=51",
  "sortBy=campoInventado",
  "order=arriba",
];

for (const query of invalidQueries) {
  test(`GET /api/services?${query} devuelve 400`, async () => {
    const res = await request.get(`/api/services?${query}`);
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });
}

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
