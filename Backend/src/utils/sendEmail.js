import nodemailer from 'nodemailer';

// async await is not allowed in global scope

const sendEmail = async(email, subject, message) => {

    let transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.PORT,
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    })

    await transporter.sendMail({
        from: process.env.FROM,
        to: email,
        subject: subject,
        html: message
    })
}

export default sendEmail;