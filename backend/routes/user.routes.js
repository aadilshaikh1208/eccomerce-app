import express from 'express';
import { getUsers, getUserByIdController, addUserController } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/getUsers", getUsers)
router.post("/addUsers", addUserController)
router.get("/getUserById/:id", getUserByIdController)

export default router;
