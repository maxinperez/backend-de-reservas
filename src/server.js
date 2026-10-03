import {app} from './app.js';
import { PORT } from './config/env.config.js';
import { connectDB } from './config/database.config.js';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const httpServer = createServer(app);
const io = new Server(httpServer);
app.set('io', io);
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const starServer = async () => {
    await connectDB();
    httpServer.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        
    });
    
}


starServer();


