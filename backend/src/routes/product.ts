import { Router } from 'express';
import { celebrate, Segments } from '../middlewares/validation';
import { getProducts, createProduct } from '../controllers/product';
import createProductValidation from '../validators/product';

const router = Router();

router.get('/', getProducts);
router.post('/', celebrate({ [Segments.BODY]: createProductValidation }), createProduct);

export default router;
