import Jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return Jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: '1d',
  })
}

const generateOtpToken = (length) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Characters to choose from
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset.charAt(randomIndex);
  }

  return code;
}


export {
  generateToken,
  generateOtpToken
}