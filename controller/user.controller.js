import asyncHandler from 'express-async-handler'

const getProfile = asyncHandler(async(req, res) => {
  //logic here
})
const updateBankDetails = asyncHandler(async(req, res) => {
  //logic here
})

const getAllUsers = asyncHandler(async(req, res) => {
  //logic here
})
export {
  getProfile,
  updateBankDetails,
  getAllUsers
}