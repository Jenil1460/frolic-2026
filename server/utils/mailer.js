import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

const init = () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true';

  if (!host || !user || !pass) {
    console.warn('SMTP is not fully configured in .env. Emails will be logged instead of sent.');
    transporter = null;
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port: port ? Number(port) : 587,
    secure: !!secure,
    auth: {
      user,
      pass,
    },
  });

  return transporter;
};

export const sendRegistrationEmail = async ({ to, studentName, eventName, transactionId, registrationStatus }) => {
  const from = process.env.EMAIL_FROM || `no-reply@${process.env.SMTP_HOST || 'frolic.local'}`;
  const subject = 'Frolic Event Registration Successful 🎉';
  const text = `Hi ${studentName},\n\nYour registration for ${eventName} is ${registrationStatus}.\nTransaction ID: ${transactionId}\n\nThanks,\nFrolic Team`;
  const html = `<p>Hi <strong>${studentName}</strong>,</p>
    <p>Your registration for <strong>${eventName}</strong> is <strong>${registrationStatus}</strong>.</p>
    <p>Transaction ID: <code>${transactionId}</code></p>
    <p>Thanks,<br/>Frolic Team</p>`;

  const transport = init();

  if (!transport) {
    // Log to console as fallback
    console.log('Email (simulated) to:', to);
    console.log('Subject:', subject);
    console.log(text);
    return true;
  }

  try {
    await transport.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
};
