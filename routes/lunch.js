import { Router } from 'express'
import {
  getLunchById,
  getUserLunches,
  sendLunch,
} from '../controller/lunch.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()
router.route('/').post(protect, sendLunch).get(protect, getUserLunches)
router.route('/:id').get(protect, getLunchById)

export default router
