import { PrismaClient } from '@prisma/client'
import asyncHandler from 'express-async-handler'
import * as argon from 'argon2'
const prisma = new PrismaClient()

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
})

export { orgSignup, orgLogin }
