import express from 'express';
import { getPageContent, updatePageContent, getAllPageContents } from '../controllers/pageContentController.js';

const router = express.Router();

router.get('/', getAllPageContents);
router.get('/:page', getPageContent);
router.put('/:page', updatePageContent);

export default router;
