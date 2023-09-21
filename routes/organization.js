import { Router } from 'express'
import { createOrg, invite, staffSignUp } from '../controller/organization.controller.js'
const router = Router()

router.route('/create').post(createOrg)
router.route('/staff/signup').post(staffSignUp)
router.route('/invite').post(invite)

export default router