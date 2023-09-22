import { Router } from 'express'
import {
  getAllUsers,
  getProfile,
  updateBankDetails,
} from '../controller/user.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

router.route('/').get(protect, getAllUsers)
router.route('/profile').get(protect, getProfile)
router.route('/bank').patch(updateBankDetails)

export default router
