// pages/api/sendingEmails.ts

import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body } = req;

    if (method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { action_type } = body;

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com', // Update with the correct Outlook SMTP server
      port: 587, // Update with the correct port (587 for TLS)
      secure: false, // Use TLS
      auth: {
        user: process.env.OUTLOOK_EMAIL,
        pass: process.env.OUTLOOK_PASSWORD,
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.OUTLOOK_EMAIL,
      to:'stevekim@pnlglobal.com.au',
      subject:"hi",
      text: action_type
    };

    // Sending email and awaiting the result
    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);

    return res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);

    // Use type assertion to inform TypeScript about the error's type
    const errorMessage = (error as Error).message;

    // Send an appropriate response to the client
    return res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
};
