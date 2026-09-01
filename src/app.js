import express from 'express';
import servicesRouter from './routes/services.router.js';
export const app = express();

app.use(express.json());

app.use('/api/services', servicesRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API: sistema de turnos y reservas'
    })
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  return res.status(status).json({ error: message });
});





