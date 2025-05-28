import { Request, Response } from 'express';
import * as TicketService from '../services/tickets';
import {  
  CreateTicketSchema,
  CompleteTicketSchema,
  CancelTicketSchema,
  TicketIdParamSchema,
  ListTicketQuerySchema 
} from '../schemes/tickets'

export const createTicket = async (req: Request, res: Response) => {
  
  const result = CreateTicketSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  const { subject, message } = result.data;
  
  try {
    const ticket = await TicketService.createTicket(subject, message);
    res.status(201).json(ticket);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
  }; 

export const startTicket = async (req: Request, res: Response) => {

  const result = TicketIdParamSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }


  const ticket = await TicketService.startTicket(+result.data.id);
  if (!ticket) return res.status(400).json({ error: 'Invalid ticket status' });
  res.json(ticket);
};

export const completeTicket = async (req: Request, res: Response) => {

  const paramResult = TicketIdParamSchema.safeParse(req.params);
  const bodyResult = CompleteTicketSchema.safeParse(req.body);
  if (!paramResult.success || !bodyResult.success) {
    return res.status(400).json({
      errors: {
        ...(paramResult.error ? paramResult.error.flatten() : {}),
        ...(bodyResult.error ? bodyResult.error.flatten() : {})
      }
    });
  }


  const { resolution } = bodyResult.data;
  const ticket = await TicketService.completeTicket(+paramResult.data.id, resolution);
  if (!ticket) return res.status(400).json({ error: 'Invalid ticket status' });
  res.json(ticket);
};

export const cancelTicket = async (req: Request, res: Response) => {
  const paramResult = TicketIdParamSchema.safeParse(req.params);
  const bodyResult = CancelTicketSchema.safeParse(req.body);
  if (!paramResult.success || !bodyResult.success) {
    return res.status(400).json({
      errors: {
        ...(paramResult.error ? paramResult.error.flatten() : {}),
        ...(bodyResult.error ? bodyResult.error.flatten() : {})
      }
    });
  }


  const { reason } = bodyResult.data;
  const ticket = await TicketService.cancelTicket(+paramResult.data.id, reason);
  if (!ticket) return res.status(400).json({ error: 'Invalid ticket status' });
  res.json(ticket);
};

export const listTickets = async (req: Request, res: Response) => {
  const result = ListTicketQuerySchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  const { date, startDate, endDate } = result.data;
  const tickets = await TicketService.listTickets(date as string, startDate as string, endDate as string);
  res.json(tickets);
};

export const cancelAllInProgressTickets = async (req: Request, res: Response) => {
  const count = await TicketService.bulkCancelInProgress();
  res.json({ cancelled: count });
};
