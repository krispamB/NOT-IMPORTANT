import { config } from 'dotenv'
config()
import nodemailer from 'nodemailer'
import { google } from 'googleapis'


const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
)

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
})

const sendmail = async(from, to, subject, html) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken()

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SENDER_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
      tls: {
        rejectUnauthorized: false,
      }
    })

    return new Promise((resolve, reject) => {
      transport.sendMail({ from, to, subject, html }, 
      (err, info) => {
        if (err) reject(err)

        resolve(info)
      })
    })

  } catch (err) {
    return err
  }
}

export default sendmail