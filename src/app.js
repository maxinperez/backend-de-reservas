import express from 'express';
import servicesRouter from './routes/services.router.js';
import bookingsRouter from './routes/bookings.router.js';
export const app = express();

app.use(express.json());
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);


app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  return res.status(status).json({ error: message });
});



export default app;

