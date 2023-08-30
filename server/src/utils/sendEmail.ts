import nodeMailer from "nodemailer";

export const sendEmail = async(option: { email: string, subject: string, message: string }) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: true,
        auth: {
            user: process.env.EMAIL_user,
            pass: process.env.EMAIL_PASS,
        }
    });

    await transporter.sendMail({
        from: "Art-Gallary <motemed24@gmail.com>",
        to: option.email,
        subject: option.subject,
        text: option.message,
    });
};