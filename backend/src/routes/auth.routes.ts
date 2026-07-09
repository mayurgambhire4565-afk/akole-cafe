import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/login', authController.login);
router.post('/login-otp/send', authController.sendLoginOTP);
router.post('/login-otp/verify', authController.loginWithOTP);
router.post('/set-password', authenticate, authController.setPassword);
router.post('/google', authController.googleLogin);
router.post('/facebook', authController.facebookLogin);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authenticate, authController.getMe);

export default router;
