import { AppDataSource } from '../typeorm/data-source';
import { Ticket } from '../typeorm/entities/Ticket';
import { Between } from 'typeorm';

export const createTicket = async (subject: string, message: string) => {
  const ticket = new Ticket();
  ticket.subject = subject;
  ticket.message = message;
  ticket.status = 'new';
  ticket.createdAt = new Date();
  return await AppDataSource.manager.save(ticket);
};

export const startTicket = async (id: number) => {
  const ticket = await AppDataSource.manager.findOneBy(Ticket, { id });
  if (!ticket || ticket.status !== 'new') return null;
  ticket.status = 'in_progress';
  return await AppDataSource.manager.save(ticket);
};

export const completeTicket = async (id: number, resolution: string) => {
  const ticket = await AppDataSource.manager.findOneBy(Ticket, { id });
  if (!ticket || ticket.status !== 'in_progress') return null;
  ticket.status = 'completed';
  ticket.resolution = resolution;
  return await AppDataSource.manager.save(ticket);
};

export const cancelTicket = async (id: number, reason: string) => {
  const ticket = await AppDataSource.manager.findOneBy(Ticket, { id });
  if (!ticket || (ticket.status !== 'new' && ticket.status !== 'in_progress')) return null;
  ticket.status = 'cancelled';
  ticket.cancellationReason = reason;
  return await AppDataSource.manager.save(ticket);
};

export const listTickets = async (date?: string, startDate?: string, endDate?: string) => {
  let where: any = {};
  if (date) {
    const d = new Date(date);
    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    where.createdAt = Between(start, end);
  } else if (startDate && endDate) {
    where.createdAt = Between(new Date(startDate), new Date(endDate));
  }
  return await AppDataSource.manager.find(Ticket, { where });
};

export const cancelAllInProgressTickets = async () => {
  const tickets = await AppDataSource.manager.findBy(Ticket, { status: 'in_progress' });
  for (const ticket of tickets) {
    ticket.status = 'cancelled';
    ticket.cancellationReason = 'Auto-cancelled';
    await AppDataSource.manager.save(ticket);
  }
  return tickets.length;
};

export const bulkCancelInProgress = async () => {
  
  const result = await AppDataSource
  .createQueryBuilder()
  .update(Ticket)
  .set({ status: 'cancelled', cancellationReason: 'Auto-cancelled' })
  .where("status = :status", { status: 'in_progress' })
  .execute();
  
  return result.affected ?? 0
};