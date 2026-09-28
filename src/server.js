import {app} from './app.js';
import { PORT } from './config/env.config.js';
import { connectDB } from './config/database.config.js';


const starServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        
    });
    
}

starServer();


