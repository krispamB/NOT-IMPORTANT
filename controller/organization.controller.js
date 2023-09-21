import asyncHandler from 'express-async-handler'

const createOrg = asyncHandler(async(req, res) => {
  // Logic goes here
})

const staffSignUp = asyncHandler(async() => {
  //logic goes here
})

//Admin
const invite = asyncHandler(async() => {
  // logic here
})
export {
  createOrg,
  staffSignUp,
  invite
}
