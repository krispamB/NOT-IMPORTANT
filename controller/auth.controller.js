import { PrismaClient } from '@prisma/client'
import asyncHandler from 'express-async-handler'
import * as argon from 'argon2'
const prisma = new PrismaClient()
import generateToken from '../utils/generateToken.js'

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
        is_admin: true
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
      email
    }
  })

  if (user && (argon.verify(user.password_hash, password))) {
    res.status(200).json({
      status: 200,
      message: 'User authenticated successfully',
      data: {
        accessToken: generateToken(user.id),
        email,
        id: user.id,
        isAdmin: user.is_admin
      }
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }

})

export { orgSignup, orgLogin }
