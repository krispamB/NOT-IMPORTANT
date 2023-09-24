import sendmail from "../config/mail.config.js";
import { mailGenerator } from "../config/mailTemplate.config.js";
const { SENDER_EMAIL } = process.env;


const inviteMail = async (email, token, senderName) => {
  const html = {
    body: {
      intro:
        "Welcome to Team Cariban! We're very excited to have you on board.",
      action: {
        instructions: `You were invited by ${senderName}, this is you invitation otp`,
        button: {
          color: '#18A0FB',
          text: token,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  const template = await mailGenerator.generate(html);
  const subject = 'Team Cariban Organization Invitation';

  return await sendmail(SENDER_EMAIL, email, subject, template);
}

const resetPasswordMail = async (email, token, name) => {
  const html = {
    body: {
      name: name,
      intro:
        "We received a request to reset the password for your account on Cariban Lunch app. To complete the password reset process, please use the following One-Time Password (OTP) code:.",
      action: {
        instructions: `OTP Code:`,
        button: {
          color: '#18A0FB',
          text: token,
        },
      },
      outro:
        "If you did not request this password reset, please ignore this email. Your account's security is important to us",
    },
  };

  const template = await mailGenerator.generate(html);
  const subject = 'Password Reset for Team Cariban lunch';

  return await sendmail(SENDER_EMAIL, email, subject, template);
}

const resetSuccessMail = async (email, name) => {
  const html = {
    body: {
      name: name,
      intro:
        "Your password was updated successfully!!!",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  const template = await mailGenerator.generate(html);
  const subject = 'Password Reset for Team Cariban lunch';

  return await sendmail(SENDER_EMAIL, email, subject, template);
}

export {
  inviteMail,
  resetPasswordMail,
  resetSuccessMail
}
