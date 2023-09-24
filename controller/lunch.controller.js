import asyncHandler from 'express-async-handler'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const sendLunch = asyncHandler(async (req, res) => {
  const receiver_id = Number(req.params.id)
  const { quantity, note } = req.body
  if (!receiver_id) {
    return res.status(400).json({
      status: 400,
      message: 'ID must be provided in params',
      data: null,
    })
  }

  if (receiver_id === req.user.id) {
    return res.status(403).json({
      status: 403,
      message: 'Nice try, you cant send to yourself',
      data: null,
    })
  }

  const receiver = await prisma.users.findUnique({
    where: {
      id: receiver_id,
    },
  })
  if (!receiver) {
    return res.status(404).json({
      status: 400,
      message: 'Receiver not found',
      data: null,
    })
  }

  if (req.user.org_id !== receiver.org_id) {
    return res.status(403).json({
      status: 403,
      message: `Can't send lunch to this user`,
      data: null,
    })
  }

  const newLunch = await prisma.lunches.create({
    data: {
      org_id: req.user.org_id,
      sender_id: req.user.id,
      receiver_id,
      quantity,
      note,
    },
  })

  await reduceBalance(newLunch.org_id, quantity)

  await prisma.users.update({
    where: {
      id: receiver_id,
    },
    data: {
      lunch_credit_balance: receiver.lunch_credit_balance + quantity,
    },
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
      id: lunch_id,
    },
  })
  if (!lunch) {
    res.status(404).json({
      status: 404,
      message: 'Lunch not found',
      data: null,
    })
  } else {
    res.status(200).json({
      status: 200,
      message: `Lunch with id: ${lunch_id}`,
      data: lunch,
    })
  }
})
const getUserLunches = asyncHandler(async (req, res) => {
  console.log(req.user.id)
  const lunchesA = await prisma.lunches.findMany({
    where: {
      sender_id: req.user.id,
    },
  })
  const lunchesB = await prisma.lunches.findMany({
    where: {
      receiver_id: req.user.id,
    },
  })

  const lunches = lunchesA.concat(...lunchesB)

  res.status(200).json({
    status: 200,
    message: 'User lunches',
    data: lunches,
  })
})

const getReceivedLunches = asyncHandler(async (req, res) => {
  const received = await prisma.lunches.findMany({
    where: {
      receiver_id: req.user.id,
    },
  })

  res.status(200).json({
    status: 200,
    message: 'Received lunches',
    data: received,
  })
})

const getSentLunches = asyncHandler(async (req, res) => {
  const sent = await prisma.lunches.findMany({
    where: {
      sender_id: req.user.id,
    },
  })

  res.status(200).json({
    status: 200,
    message: 'Sent lunches',
    data: sent,
  })
})

const reduceBalance = async (org_id, amount) => {
  const orgWallet = await prisma.organization_lunch_wallets.findFirst({
    where: {
      org_id,
    },
  })

  const newBalance = orgWallet.balance - Number(amount)

  await prisma.organization_lunch_wallets.update({
    where: {
      id: orgWallet.id,
    },
    data: {
      balance: newBalance,
    },
  })
}

export {
  sendLunch,
  getLunchById,
  getUserLunches,
  getReceivedLunches,
  getSentLunches,
}
