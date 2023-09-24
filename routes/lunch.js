import { Router } from 'express'
import {
  getLunchById,
  getUserLunches,
  sendLunch,
  getReceivedLunches,
  getSentLunches
} from '../controller/lunch.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()
router.route('/').get(protect, getUserLunches)
router.route('/received').get(protect, getReceivedLunches)
router.route('/sent').get(protect, getSentLunches)
router.route('/:id').get(protect, getLunchById).post(protect, sendLunch)

export default router
