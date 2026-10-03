import express from 'express';
import servicesRouter from './routes/services.router.js';
import bookingsRouter from './routes/bookings.router.js';
import viewsRouter from './routes/views.router.js';
import { engine } from 'express-handlebars';

export const app = express();
app.use(express.json());
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/views', viewsRouter);
app.use(express.static('./src/public'));


//handlebars config
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

//manage errors
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  return res.status(status).json({ error: message });
});


 
export default app;

