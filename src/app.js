import express from 'express';

export const app = express();

app.use(express.json());

app.use()

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API: sistema de turnos y reservas'
    })
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message }); // 👈 SIEMPRE 500
});





