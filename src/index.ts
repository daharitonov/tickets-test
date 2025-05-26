import express from 'express';
import { json } from 'body-parser';
import { AppDataSource } from './typeorm/data-source';
import ticketRoutes from './routes/tickets';

const app = express();
app.use(json());
app.use('/tickets', ticketRoutes);

const PORT = 3000;

AppDataSource.initialize().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});