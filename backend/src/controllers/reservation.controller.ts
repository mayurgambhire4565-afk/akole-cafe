import { Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
import prisma from '../database/prisma';
import { sendReservationConfirmationEmail } from '../utils/email';

export const createReservation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { date, time, guestCount, name, email, phone, specialRequests } = req.body;

  if (!date || !time || !guestCount || !name || !email || !phone) {
    sendError(res, 'All required fields (date, time, guestCount, name, email, phone) must be provided', 400);
    return;
  }

  // Parse guestCount
  const parsedGuestCount = parseInt(guestCount, 10);
  if (isNaN(parsedGuestCount) || parsedGuestCount <= 0) {
    sendError(res, 'Guest count must be a positive number', 400);
    return;
  }

  // Parse date
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    sendError(res, 'Invalid date format provided', 400);
    return;
  }

  // Save in database
  const reservation = await prisma.reservation.create({
    data: {
      userId: req.user?.id || null,
      name,
      email,
      phone,
      date: parsedDate,
      time,
      guestCount: parsedGuestCount,
      specialNotes: specialRequests || null,
      status: 'CONFIRMED', // Confirm reservation immediately for a premium instant experience
    },
  });

  // Send confirmation email
  const formattedDate = parsedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Execute email sending in the background so API responds quickly
  sendReservationConfirmationEmail(
    email,
    name,
    formattedDate,
    time,
    parsedGuestCount,
    specialRequests
  ).catch((err) => {
    console.error('[RESERVATION EMAIL ERROR] Failed to send confirmation email:', err);
  });

  sendSuccess(res, { reservation }, 'Table reservation confirmed successfully!', 201);
});
