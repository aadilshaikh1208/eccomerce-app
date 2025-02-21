import express from 'express';
import { addOrdersController,fetchOrdersController } from '../controllers/order.controller.js';
const router = express.Router();


router.post("/add-orders", addOrdersController)
router.get("/fetch-orders", fetchOrdersController)


export default router