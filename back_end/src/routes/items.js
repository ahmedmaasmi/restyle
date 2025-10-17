import express from 'express';
import { getAllItems } from '../controllers/itemsController.js';

const router = express.Router();

router.get('/', getAllItems);

export default router;
