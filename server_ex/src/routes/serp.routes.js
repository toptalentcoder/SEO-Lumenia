import express from 'express';
import { googleSearchAPI } from '../controllers/serp.controller.js';

const router = express.Router();

router.post('/googleSearch', googleSearchAPI);

export default router;