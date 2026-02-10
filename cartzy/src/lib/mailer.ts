import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // Use true for port 465, false for port 587
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,  
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"Cartzy" ${process.env.NODEMAILER_EMAIL}`,
    to,
    subject,
    html,
  });
};
