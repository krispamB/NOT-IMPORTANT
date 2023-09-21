import { Router } from 'express'
import { getLunchById, getUserLunches, sendLunch } from '../controller/lunch.controller.js'

const router = Router()
router.route('/').post(sendLunch).get(getUserLunches)
router.route('/:id').get(getLunchById)

export default router