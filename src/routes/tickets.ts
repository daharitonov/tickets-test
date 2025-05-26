import { Router } from 'express';
import {
  createTicket,
  startTicket,
  completeTicket,
  cancelTicket,
  listTickets,
  cancelAllInProgressTickets
} from '../controllers/tickets';

const router = Router();

router.post('/', createTicket);
router.patch('/:id/start', startTicket);
router.patch('/:id/complete', completeTicket);
router.patch('/:id/cancel', cancelTicket);
router.get('/', listTickets);
router.post('/cancel-in-progress', cancelAllInProgressTickets);

export default router;