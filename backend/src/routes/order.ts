import { Router } from 'express';
import { celebrate, Segments } from '../middlewares/validation';
import createOrder from '../controllers/order';
import createOrderValidation from '../validators/order';

const router = Router();
router.post('/', celebrate({ [Segments.BODY]: createOrderValidation }), createOrder);

export default router;
