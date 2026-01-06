import express from 'express';
import {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/travelPackageController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/').get(getPackages).post(authenticate, authorize('admin', 'super_admin'), createPackage);
router
  .route('/:id')
  .get(getPackage)
  .put(authenticate, authorize('admin', 'super_admin'), updatePackage)
  .delete(authenticate, authorize('admin', 'super_admin'), deletePackage);

export default router;


