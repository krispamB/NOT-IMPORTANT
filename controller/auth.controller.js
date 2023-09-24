import { PrismaClient } from '@prisma/client'
import asyncHandler from 'express-async-handler'
import * as argon from 'argon2'
const prisma = new PrismaClient()
import { generateOtpToken, generateToken } from '../utils/generateToken.js'
import { resetPasswordMail, resetSuccessMail } from '../mails/mails.js'

const orgSignup = asyncHandler(async (req, res) => {
  const { email, password, first_name, last_name, phone_number } = req.body
  try {
    const exists = await prisma.users.findUnique({
      where: {
        email,
      },
    })

    if (exists) {
      return res.status(400).json({
        status: 400,
        message: 'Credentials taken',
        data: null,
      })
    }

    const password_hash = await argon.hash(password)

    const newUser = await prisma.users.create({
      data: {
        email,
        password_hash,
        first_name,
        last_name,
        phone: phone_number,
        is_admin: true,
      },
    })

    return res.status(201).json({
      status: 201,
      message: 'User created successfully',
      data: newUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 500,
      message: 'An error occurred while creating user',
      data: null,
    })
  }
})

const orgLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  })

  if (user && argon.verify(user.password_hash, password)) {
    res.status(200).json({
      status: 200,
      message: 'User authenticated successfully',
      data: {
        accessToken: generateToken(user.id),
        email,
        id: user.id,
        isAdmin: user.is_admin,
        available_lunch: user.lunch_credit_balance,
      },
    })
  } else {
    res.status(401).json({
      status: 401,
      message: 'Invalid email or password',
      data: null,
    })
  }
})

const resetRequest = asyncHandler(async (req, res) => {
  const { email } = req.body
  const token = generateOtpToken(6)

  const user = await prisma.users.update({
    where: {
      email,
    },
    data: {
      refresh_token: token,
    },
  })

  if (!user) {
    return res.status(404).json({
      status: 404,
      message: 'User not found',
      data: null,
    })
  }

  await resetPasswordMail(email, token, user.first_name)
  res.status(200).json({
    status: 200,
    message: 'Mail sent successfully',
    data: null,
  })
})

const resetPassword = asyncHandler(async (req, res) => {
  const { new_password, otp_token } = req.body

  const user = await prisma.users.findFirst({
    where: {
      refresh_token: otp_token,
    },
  })

  if (!user) {
    return res.status(404).json({
      status: 404,
      message: 'Token matches no users',
      data: null,
    })
  }
  const hash = await argon.hash(new_password)

  const newUser = await prisma.users.update({
    where: {
      id: user.id,
    },
    data: {
      password_hash: hash,
      refresh_token: null,
    },
  })

  await resetSuccessMail(newUser.email, newUser.first_name)

  res.status(200).json({
    status: 200,
    message: 'Password updated successfully',
    data: null,
  })
})

export { orgSignup, orgLogin, resetRequest, resetPassword }
