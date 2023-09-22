import asyncHandler from 'express-async-handler'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const createOrg = asyncHandler(async (req, res) => {
  const { organization_name, lunch_price } = req.body

  const newOrg = await prisma.organizations.create({
    data: {
      name: organization_name,
      lunch_price,
      currency_code: 'NGN'
    }
  })


  if(!newOrg) {
    res.status(400)
    throw new Error('An error occurred while creating organization')
  }

  const updateUser = await prisma.users.update({
    where: {
      id: req.user.id
    },
    data: {
      org_id: newOrg.id
    }
  })
  if(updateUser) {
    res.status(201).json({
      status: 201,
      message: 'Organization created successfully',
      data: {
        id: newOrg.id,
        organization_name,
        lunch_price,
        user_id: updateUser.id
      }
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

const staffSignUp = asyncHandler(async () => {
  //logic goes here
})

//Admin
const invite = asyncHandler(async () => {
  // logic here
})
export { createOrg, staffSignUp, invite }
