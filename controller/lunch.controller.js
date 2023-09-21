import asyncHandler from 'express-async-handler'

const sendLunch = asyncHandler(async(req, res) => {
  //logic here
})
const getLunchById = asyncHandler(async(req, res) => {
  //logic here
})
const getUserLunches = asyncHandler(async(req, res) => {
  //logic here
})
export {
  sendLunch,
  getLunchById,
  getUserLunches
}