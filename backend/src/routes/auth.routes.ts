import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validator';
import * as authValidator from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(authValidator.registerSchema), authController.register);
router.post('/verify-otp', validate(authValidator.verifyOTPSchema), authController.verifyOTP);
router.post('/resend-otp', validate(authValidator.emailOnlySchema), authController.resendOTP);
router.post('/login', validate(authValidator.loginSchema), authController.login);
router.post('/login-otp/send', validate(authValidator.emailOnlySchema), authController.sendLoginOTP);
router.post('/login-otp/verify', validate(authValidator.loginOTPSchema), authController.loginWithOTP);
router.post('/set-password', authenticate, validate(authValidator.setPasswordSchema), authController.setPassword);
router.post('/google', authController.googleLogin);
router.post('/facebook', authController.facebookLogin);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.post('/forgot-password', validate(authValidator.emailOnlySchema), authController.forgotPassword);
router.post('/reset-password', validate(authValidator.resetPasswordSchema), authController.resetPassword);
router.get('/me', authenticate, authController.getMe);

export default router;
