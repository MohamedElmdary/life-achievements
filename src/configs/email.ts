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
            user: process.env.user,
            pass: process.env.pass
        }
    });

    await transporter.sendMail({
        from: process.env.user,
        to,
        subject,
        html
    });
    transporter.close();
}

export { sendEmail };
