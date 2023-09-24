import { Router } from 'express'
import { orgLogin, orgSignup, resetRequest, resetPassword } from '../controller/auth.controller.js'


const router = Router()

router.route('/user/signup').post(orgSignup)
router.route('/login').post(orgLogin)
router.route('/reset-request').post(resetRequest)
router.route('/reset-password').post(resetPassword)

export default router