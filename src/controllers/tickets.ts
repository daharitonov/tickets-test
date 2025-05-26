import { Request, Response } from 'express';
import * as TicketService from '../services/tickets';

export const createTicket = async (req: Request, res: Response) => {
  const { subject, message } = req.body;
  
  try {
    const ticket = await TicketService.createTicket(subject, message);
    res.status(201).json(ticket);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
  }; 

export const startTicket = async (req: Request, res: Response) => {
  const ticket = await TicketService.startTicket(+req.params.id);
  if (!ticket) return res.status(400).json({ error: 'Invalid ticket status' });
  res.json(ticket);
};

export const completeTicket = async (req: Request, res: Response) => {
  const { resolution } = req.body;
  const ticket = await TicketService.completeTicket(+req.params.id, resolution);
  if (!ticket) return res.status(400).json({ error: 'Invalid ticket status' });
  res.json(ticket);
};

export const cancelTicket = async (req: Request, res: Response) => {
  const { reason } = req.body;
  const ticket = await TicketService.cancelTicket(+req.params.id, reason);
  if (!ticket) return res.status(400).json({ error: 'Invalid ticket status' });
  res.json(ticket);
};

export const listTickets = async (req: Request, res: Response) => {
  const { date, startDate, endDate } = req.query;
  const tickets = await TicketService.listTickets(date as string, startDate as string, endDate as string);
  res.json(tickets);
};

export const cancelAllInProgressTickets = async (req: Request, res: Response) => {
  const count = await TicketService.bulkCancelInProgress();
  res.json({ cancelled: count });
};
