import express from 'express';
import { loginController, logoutController, checkAuthController, signUpController } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/check-auth', checkAuthController);
router.post('/signUp', signUpController);



export default router;
