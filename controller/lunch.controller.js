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
  if(!receiver) {
    return res.status(404).json({
      status: 400,
      message: 'Receiver not found',
      data: null
    })
  }

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
  const lunch_id = Number(req.params.id)
  console.log(lunch_id)
  const lunch = await prisma.lunches.findUnique({
    where: {
      id: lunch_id
    }
  })
  if(!lunch) {
    res.status(404).json({
      status: 404,
      message: 'Lunch not found',
      data: null
    })
  } else {
    res.status(200).json({
      status: 200,
      message: `Lunch with id: ${lunch_id}`,
      data: lunch
    })
  }
  
})
const getUserLunches = asyncHandler(async (req, res) => {
  console.log(req.user.id)
  const lunchesA = await prisma.lunches.findMany({
    where: {
      sender_id: req.user.id,
    }
  })
  const lunchesB = await prisma.lunches.findMany({
    where: {
      receiver_id: req.user.id,
    }
  })
  
  const lunches = lunchesA.concat(...lunchesB)

  res.status(200).json({
    status: 200,
    message: 'User lunches',
    data: lunches
  })
})
export { sendLunch, getLunchById, getUserLunches }
