import asyncHandler from 'express-async-handler'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import argon from 'argon2'
import { generateOtpToken } from '../utils/generateToken.js'

const createOrg = asyncHandler(async (req, res) => {
  const { organization_name, lunch_price } = req.body

  const newOrg = await prisma.organizations.create({
    data: {
      name: organization_name,
      lunch_price,
      currency_code: 'NGN',
    },
  })

  if (!newOrg) {
    res.status(400)
    throw new Error('An error occurred while creating organization')
  }

  const updateUser = await prisma.users.update({
    where: {
      id: req.user.id,
    },
    data: {
      org_id: newOrg.id,
    },
  })
  if (updateUser) {
    res.status(201).json({
      status: 201,
      message: 'Organization created successfully',
      data: {
        id: newOrg.id,
        organization_name,
        lunch_price,
        user_id: updateUser.id,
      },
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

const staffSignUp = asyncHandler(async (req, res) => {
  const { email, password, otp_token, first_name, last_name, phone_number } =
    req.body

  const invite = await prisma.organization_invites.findFirst({
    where: {
      token: otp_token,
    },
  })

  if (!invite) {
    res.status(404)
    throw new Error('Invite not found')
  }

  const password_hash = await argon.hash(password)

  const newStaff = await prisma.users.create({
    data: {
      email,
      password_hash,
      first_name,
      last_name,
      phone: phone_number,
      org_id: invite.org_id,
      lunch_credit_balance: 0
    },
  })

  if (newStaff)
    [
      res.status(201).json({
        status: 201,
        message: 'User created successfully',
        data: newStaff,
      }),
    ]
})

//Admin
const invite = asyncHandler(async (req, res) => {
  const { email } = req.body
  const token = generateOtpToken(6)
  const ttl = new Date()

  if (!req.user.org_id) {
    return res.status(400).json({
      status: 400,
      message: 'Organization must be created before invites are sent',
    })
  }

  const newInvite = await prisma.organization_invites.create({
    data: {
      email,
      token,
      ttl,
      org_id: req.user.org_id,
    },
  })

  if (newInvite) {
    // sendmail(token)
    res.status(201).json({
      message: 'Invite created successfully',
      statusCode: 200,
      data: null,
    })
  } else {
    res.status(400)
    throw new Error('An error occurred while sending invite')
  }
})
export { createOrg, staffSignUp, invite }
