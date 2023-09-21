import { Router } from 'express'
import { withdrawRequest } from '../controller/withdrawal.controller.js'
const router = Router()

router.route('request').post(withdrawRequest)
export default router