
import dotenv from 'dotenv';

dotenv.config();
const requiredEnvVars = ['PORT', 'NODE_ENV'];
// uso una lista por si despues debo agregar mas variables
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(
      `❌ Falta la variable de entorno requerida: ${varName}. Revisá tu archivo .env`
    );
  }
}

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;