// pages/api/sendingEmails.ts

import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import fs from 'fs';
import path from 'path';

dotenv.config();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method, body } = req;

    if (method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const {action_type, complete_date, driver_id, job_id} = body;
    
    let desc = '';
    if (action_type === 'Job Pickup') {
      desc = 'The shipment has been pickedup'
    } else if (action_type === 'New Job') {
      desc = 'The booking has been made.'
    } else if (action_type === 'POD') {
      desc = 'The shipment has been delivered.'
    }

    const publicFolderPath = path.join(process.cwd(), 'public');
    const htmlFilePath = path.join(publicFolderPath, 'notice_booking.html');
    const htmlFileContent = fs.readFileSync(htmlFilePath, 'utf-8');

       // Replace placeholders in the HTML content with dynamic values
    const formattedHtml = htmlFileContent
    .replace('{{job_id}}', job_id)
    .replace('{{job_id1}}', job_id)
    .replace('{{action_type}}', action_type)
    .replace('{{desc}}', desc)
    .replace('{{complete_date}}', complete_date)
    .replace('{{driver_url}}', 'http://www.directcouriers.com.au/drivphotos/mel/' + driver_id + '.jpg')


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
      subject:"[PNL SHIPMENT_UPDATE] "+ job_id + " " + action_type,
      html: formattedHtml,
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
