import nodemailer from 'nodemailer';

const host: any = process.env.SMTP_HOST;
const port: any = process.env.SMTP_PORT;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  }
});

export default {

  sendActivationMail: async (email: string, link: string) => {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Активация аккаунта на ${process.env.API_URL}`,
      text: '',
      html: 
      `
        <div>
          <h1>Привет. Для активации вашей учётной записи перейдите по ссылке</h1>
          <a href="${link}">${link}</a>
        </div>
      `
    })
  }
}