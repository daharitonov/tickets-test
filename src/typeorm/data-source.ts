import { DataSource } from 'typeorm';
import { Ticket } from './entities/Ticket';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'tickets.sqlite',
  synchronize: true,
  logging: false,
  entities: [Ticket],
});