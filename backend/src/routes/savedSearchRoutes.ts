import express from 'express';
import {
    createSavedSearch,
    getSavedSearches,
    deleteSavedSearch,
} from '../controllers/savedSearchController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.route('/')
    .get(getSavedSearches)
    .post(createSavedSearch);

router.route('/:id')
    .delete(deleteSavedSearch);

export default router;
