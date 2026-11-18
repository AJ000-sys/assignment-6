import express from 'express';
import triviabookRouter from './routes/triviabook.js';
import { initDb } from './db.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/triviabook', triviabookRouter);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

await initDb();
app.listen(port, () => console.log(`Triviabook listening on ${port}`));