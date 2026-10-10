import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import supertest from "supertest";
import { connectDB } from "../src/config/database.config.js";
import { app } from "../src/app.js";
import { ServiceModel } from "../src/dao/models/service.models.js";

const request = supertest(app);

// categoría única por corrida: aísla los tests del resto de los servicios que haya en Atlas
const uniqueCategory = `test-views-${Date.now()}`;
const createdIds = [];

async function createService(name, price) {
  const res = await request.post("/api/services").send({
    name,
    description: "Servicio creado por los tests de vistas",
    duration: 30,
    price,
    category: uniqueCategory,
    available: true,
  });
  createdIds.push(res.body._id);
  return res.body;
}

// Handlebars escapa "&" y "=" como entidades HTML dentro del href; el navegador las decodifica,
// así que el test hace lo mismo y devuelve los parámetros reales del enlace.
function linkParams(html, label) {
  const match = html.match(new RegExp(`<a href="([^"]+)">[^<]*${label}`));
  assert.ok(match, `no se encontró el enlace "${label}"`);
  const href = match[1].replaceAll("&amp;", "&").replaceAll("&#x3D;", "=");
  return new URL(href, "http://localhost").searchParams;
}

before(async () => {
  // server.js es quien crea el io real; en los tests se reemplaza por uno que no hace nada
  app.set("io", { emit: () => {} });
  await connectDB();
  await createService("Vista A", 100);
  await createService("Vista B", 200);
  await createService("Vista C", 300);
});

after(async () => {
  await ServiceModel.deleteMany({ _id: { $in: createdIds } });
  await mongoose.connection.close();
});

test("GET /views/services renderiza el listado desde la base", async () => {
  const res = await request.get(`/views/services?category=${uniqueCategory}`);
  assert.equal(res.status, 200);
  assert.match(res.headers["content-type"], /text\/html/);
  assert.ok(res.text.includes("Vista A"));
  assert.ok(res.text.includes("Vista B"));
  assert.ok(res.text.includes("Vista C"));
});

test("GET /views/services primera página: muestra Siguiente y no Anterior", async () => {
  const res = await request.get(
    `/views/services?category=${uniqueCategory}&limit=2&page=1`
  );
  assert.equal(res.status, 200);
  assert.ok(res.text.includes("Página 1 de 2"));
  assert.ok(res.text.includes("Siguiente"));
  assert.ok(!res.text.includes("Anterior"));
  // el enlace apunta a la página 2 y conserva los filtros
  const next = linkParams(res.text, "Siguiente");
  assert.equal(next.get("page"), "2");
  assert.equal(next.get("category"), uniqueCategory);
  assert.equal(next.get("limit"), "2");
  assert.ok(res.text.includes("Vista A"));
  assert.ok(!res.text.includes("Vista C"));
});

test("GET /views/services segunda página: muestra Anterior y no Siguiente", async () => {
  const res = await request.get(
    `/views/services?category=${uniqueCategory}&limit=2&page=2`
  );
  assert.equal(res.status, 200);
  assert.ok(res.text.includes("Página 2 de 2"));
  assert.ok(res.text.includes("Anterior"));
  assert.ok(!res.text.includes("Siguiente"));
  const prev = linkParams(res.text, "Anterior");
  assert.equal(prev.get("page"), "1");
  assert.equal(prev.get("category"), uniqueCategory);
  assert.ok(res.text.includes("Vista C"));
  assert.ok(!res.text.includes("Vista A"));
});

test("GET /views/services con una página inválida devuelve 400", async () => {
  const res = await request.get("/views/services?page=0");
  assert.equal(res.status, 400);
});

test("GET /views/bookings responde 200", async () => {
  const res = await request.get("/views/bookings");
  assert.equal(res.status, 200);
  assert.match(res.headers["content-type"], /text\/html/);
});
