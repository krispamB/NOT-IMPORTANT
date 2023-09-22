import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const protect = asyncHandler(async(req, res, next) => {
  let token

  if(
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ){
    try {
      token = req.headers.authorization.split(' ')[1]
    


      const decoded = jwt.verify(token, process.env.SECRET_KEY)

      req.user = await prisma.users.findUnique({
        where: {
          id: decoded.id
        },
        select: {
          id: true,
          email: true,
          is_admin: true,
          lunch_credit_balance: true,
          org_id: true,
        }
      })

      next()
    } catch (error) {
      console.error(error)
      res.status(401).json({
        status: 401,
        message: 'There was an issue authorizing token',
        data: null
      })
    }
  } else {
    res.status(401).json({
      status: 401,
      message: 'Unauthorized',
      data: null
    })
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

export { protect, admin }