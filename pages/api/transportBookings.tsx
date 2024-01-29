import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  try {
    if (req.method === 'GET') {
      const transportBookings = await prisma.transportBooking.findMany();
      res.status(200).json(transportBookings);
    } else if (req.method === 'POST') {
      const { job_id } = req.body;
      const job_idAsInt = parseInt(job_id, 10); 
      const newTransportBooking = await prisma.transportBooking.create({
        data: {
          job_id: job_idAsInt,
          // Include other properties if needed
        },
      });
      res.status(201).json(newTransportBooking);
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}