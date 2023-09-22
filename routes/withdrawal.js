import { Router } from 'express'
import { withdrawRequest } from '../controller/withdrawal.controller.js'
const router = Router()
import { protect } from '../middleware/auth.middleware.js'

router.route('/request').post(protect, withdrawRequest)
export default router
