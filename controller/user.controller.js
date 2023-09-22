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
  const { bank_number, bank_code, bank_name, bank_region } = req.body
  const updatedUser = await prisma.users.update({
    where: {
      id: req.user.id,
    },
    data: {
      bank_name,
      bank_number,
      bank_code,
      bank_region,
    },
  })

  if (!updatedUser) {
    res.status(400).json({
      status: 400,
      message: 'Bank details update failed',
      data: null,
    })
  } else {
    res.status(200).json({
      status: 200,
      message: 'Bank details update successful',
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        bank_name,
        bank_number,
        bank_code,
        bank_region,
      },
    })
  }
})

const getAllUsers = asyncHandler(async (req, res) => {
  const keywords = req.query.search ? req.query.search : ''

  const candidates = await prisma.users.findMany({
    where: {
      org_id: req.user.org_id,
      email: {
        contains: keywords,
      },
    },
    select: {
      first_name: true,
      last_name: true,
      profile_pic: true,
      email: true,
      id: true,
    },
  })

  res.status(200).json({
    status: 200,
    message: 'User list',
    data: candidates,
  })
})
export { getProfile, updateBankDetails, getAllUsers }