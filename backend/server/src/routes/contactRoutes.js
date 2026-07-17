import express from 'express';
import { submitContactForm, getAllContacts } from '../controllers/contactController.js';

const router = express.Router();

router.post('/submit', submitContactForm);
router.get('/all', getAllContacts);

export default router;
