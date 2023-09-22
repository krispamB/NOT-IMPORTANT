import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { config } from 'dotenv'
config()
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const opts = {}
opts.jwtFormRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.SECRET_KEY

const passportConfig = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      const user = await prisma.users.findUnique({
        where: {
          id: jwt_payload,
        },
      })

      if (!user) {
        return
      }
    })
  )
}
