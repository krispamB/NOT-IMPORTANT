import asyncHandler from 'express-async-handler'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const getProfile = asyncHandler(async (req, res) => {
  const userProfile = await prisma.users.findUnique({
    where: {
      id: req.user.id,
    },
  })
  if (!userProfile) {
    res.status(404)
    throw new Error('User profile not found')
  } else {
    res.status(200).json({
      status: 200,
      message: 'Successful get request',
      data: {
        name: `${userProfile.first_name} ${userProfile.last_name}`,
        email: userProfile.email,
        profile_picture: userProfile.profile_pic,
        phone_number: userProfile.phone,
        bank_number: userProfile.bank_number,
        bank_code: userProfile.bank_code,
        bank_name: userProfile.bank_name,
        isAdmin: userProfile.is_admin,
      },
    })
  }
})
const updateBankDetails = asyncHandler(async (req, res) => {
  //logic here
})

const getAllUsers = asyncHandler(async (req, res) => {
  //logic here
})
export { getProfile, updateBankDetails, getAllUsers }
