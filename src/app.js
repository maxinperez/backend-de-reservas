import express from 'express';
import servicesRouter from './routes/services.router.js';
import bookingsRouter from './routes/bookings.router.js';
import { engine } from 'express-handlebars';
export const app = express();

//handlebars config
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());
//routes
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);

//manage errors
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  return res.status(status).json({ error: message });
});



export default app;

