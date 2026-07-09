import { Router } from 'express';
import * as reservationController from '../controllers/reservation.controller';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuth, reservationController.createReservation);

export default router;
