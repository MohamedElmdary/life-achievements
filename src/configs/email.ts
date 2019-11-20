import nodemailer from 'nodemailer';

async function sendEmail({
    to,
    subject,
    html
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const transporter = await nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER_NAME,
            pass: process.env.PASS
        }
    });

    await transporter.sendMail({
        from: process.env.USER_NAME,
        to,
        subject,
        html
    });
    transporter.close();
}

export { sendEmail };
