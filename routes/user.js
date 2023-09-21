import { Router } from 'express'
import { getAllUsers, getProfile, updateBankDetails } from '../controller/user.controller.js'

const router = Router()

router.route('/').get(getAllUsers)
router.route('/profile').get(getProfile)
router.route('/bank').patch(updateBankDetails)



export default router