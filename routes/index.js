import { Router } from 'express'
const router = Router()
import auth from './auth.js'
import lunch from './lunch.js'
import organization from './organization.js'
import user from './user.js'
import withdrawal from './withdrawal.js'

router.use('/auth', auth)
router.use('/lunch', lunch)
router.use('/organization', organization)
router.use('/user', user)
router.use('/withdrawal', withdrawal)

export default router