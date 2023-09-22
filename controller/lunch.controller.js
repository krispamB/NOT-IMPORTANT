import asyncHandler from 'express-async-handler'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const sendLunch = asyncHandler(async (req, res) => {
  const { receiver_id, quantity, note } = req.body

  if(receiver_id === req.user.id) {
    return res.status(403).json({
      status: 403,
      message: 'Nice try, you cant send to yourself',
      data: null
    })
  }

  const receiver = await prisma.users.findUnique({
    where: {
      id: receiver_id
    }
  })

  if(req.user.org_id !== receiver.org_id) {
    return res.status(403).json({
      status: 403,
      message: `Can't send lunch to this user`,
      data: null
    })
  }

  const newLunch = await prisma.lunches.create({
    data: {
      sender_id: req.user.id,
      receiver_id,
      quantity,
      note,
    },
  })

  await prisma.users.update({
    where: {
      id: receiver_id
    },
    data: {
      lunch_credit_balance: receiver.lunch_credit_balance + quantity
    }
  }) 
  if (!newLunch) {
    res.status(400).json({
      status: 400,
      message: 'An error occurred while creating lunch',
      data: null,
    })
  } else {
    res.status(201).json({
      status: 201,
      message: 'Lunch created successfully',
      data: newLunch,
    })
  }
})
const getLunchById = asyncHandler(async (req, res) => {
  //logic here
})
const getUserLunches = asyncHandler(async (req, res) => {
  //logic here
})
export { sendLunch, getLunchById, getUserLunches }
