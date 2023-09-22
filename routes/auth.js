import { Router } from 'express'
import { orgLogin, orgSignup } from '../controller/auth.controller.js'


const router = Router()

router.route('/user/signup').post(orgSignup)
router.route('login').post(orgLogin)

export default router