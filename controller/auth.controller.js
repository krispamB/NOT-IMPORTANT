import { PrismaClient } from "@prisma/client";
import asyncHandler from 'express-async-handler'
const prisma = new PrismaClient()

const orgSignup = asyncHandler(async(req, res) => {
  return res.status(200).json('Org Signup')
})

const orgLogin = asyncHandler(async(req, res) => {
  return res.status(200).json('Org Login')
})

export {
  orgSignup,
  orgLogin
}