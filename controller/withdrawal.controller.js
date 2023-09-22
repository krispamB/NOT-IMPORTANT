import asyncHandler from 'express-async-handler'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const withdrawRequest = asyncHandler(async (req, res) => {
  const { amount, bank_code } = req.body
  const available = req.user.lunch_credit_balance
  console.log(available)
  if (available < Number(amount)) {
    return res.status(400).json({
      status: 400,
      message: `Max withdrawal is ${available} lunches`,
      data: null,
    })
  }

  // if(bank_code != req.user.bank_code) {
  //   return res.status(400).json({
  //     status: 401,
  //     message: `Incorrect bank code`,
  //     data: null
  //   })
  // }
  const withdrawal = await prisma.withdrawals.create({
    data: {
      user_id: req.user.id,
      status: 'redeemed',
      amount,
    },
  })


  if(!withdrawal) {
    res.status(400).json({
      status: 400,
      message: 'Withdrawal failed',
      data: null
    })
  } else {
    await prisma.users.update({
      where: {
        id: req.user.id
      },
      data: {
        lunch_credit_balance: available - Number(amount)
      }
    })
    res.status(201).json({
      status: 201,
      message: 'Withdrawal successful',
      data: withdrawal
    })
  }
})
export { withdrawRequest }
