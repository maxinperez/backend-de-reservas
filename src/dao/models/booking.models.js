import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    clientEmail: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true

    },
    services: [{
        service: {
            
            type: mongoose.Schema.Types.ObjectId,
            ref: 'services'//fk?
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]

})

/*
{
    "id": 1,
    "clientName": "María Gómez",
    "clientEmail": "maria@example.com",
    "date": "2026-09-10",
    "time": "10:00",
    "status": "confirmed",
    "services": [
      {
        "service": 1,
        "quantity": 1
      },
      {
        "service": 2,
        "quantity": 1
      }
    ]
  }

*/