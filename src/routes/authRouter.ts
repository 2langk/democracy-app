import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/login');
export default router;
