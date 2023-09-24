import { Router } from 'express'
import {
  createOrg,
  invite,
  staffSignUp,
  getWalletBalance
} from '../controller/organization.controller.js'
const router = Router()
import { protect, admin } from '../middleware/auth.middleware.js'

router.route('/create').post(protect, admin, createOrg)
router.route('/staff/signup').post(staffSignUp)
router.route('/invite').post(protect, admin, invite)
router.route('/wallet').get(protect, admin, getWalletBalance)

export default router
