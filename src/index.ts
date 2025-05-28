import express from 'express';
import { json } from 'body-parser';
import { AppDataSource } from './typeorm/data-source';
import ticketRoutes from './routes/tickets';
import dotenv from 'dotenv';

dotenv.config();
const PORT = parseInt(process.env.PORT || '3000', 10);
const JSON_LIMIT = process.env.MAX_JSON_SIZE || '1mb';

const app = express();
app.use(express.json({ limit: JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: JSON_LIMIT }));
app.use(json());
app.use('/tickets', ticketRoutes);

AppDataSource.initialize().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});