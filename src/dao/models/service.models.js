import mongoose from "mongoose";
import { type } from "os";

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    }

})

export const ServiceModel = mongoose.model('services', serviceSchema);
/* {
    "id": 1,
    "name": "Corte de cabello",
    "description": "Corte de cabello clásico con máquina y tijera",
    "duration": 30,
    "price": 3500,
    "category": "peluquería",
    "available": true
  } */