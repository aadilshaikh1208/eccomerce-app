import express from 'express';
import { updateCartController, getCartController,mergeCartsController,removeCartController } from '../controllers/cart.controller.js';
const router = express.Router();

router.post('/update', updateCartController);
router.get('/:userId', getCartController);
router.post('/merge', mergeCartsController);
router.delete('/remove/:userId', removeCartController);

export default router;
