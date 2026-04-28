import nodemailer from 'nodemailer';
const sendEmail = async (userEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Medic Quiz" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "كود التحقق الخاص بك - Medic",
    html: `
      <div style="direction: rtl; text-align: center; font-family: Arial;">
        <h2>أهلاً بك في منصة Medic</h2>
        <p>كود التأكيد الخاص بك هو:</p>
        <h1 style="color: #6366f1;">${otp}</h1>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;