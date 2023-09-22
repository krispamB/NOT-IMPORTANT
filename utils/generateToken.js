import Jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return Jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: '1d',
  })
}

export default generateToken