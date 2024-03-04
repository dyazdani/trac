import nodemailer from 'nodemailer'

const getNodemailerTransporter = (username: string, password: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
          user: username,
          pass: password,
        },
      });

    return transporter;
}


  export default getNodemailerTransporter;