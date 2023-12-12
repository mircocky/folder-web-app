// pages/api/send-notification.ts
import { NextApiRequest, NextApiResponse } from 'next';
import webPush from 'web-push';

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  'BACVDg1IY5L2sGus64krTUOGMIqv3ljPqgzupCaxyhGU2x3b_rNcPPCTOqwxaAazHltJKmvi9eJRKhs_y0DKdjg',
  'Kihg5uhl9ra805cZ6qlWffmqxEueI139ECcOesg7ghE'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const subscription = req.body.subscription as webPush.PushSubscription;

  try {
    await webPush.sendNotification(subscription, JSON.stringify({
      title: 'Push Notification',
      text: 'This is a push notification.',
    }));
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending push notification:', error);
    res.status(500).json({ success: false, error: 'Error sending push notification.' });
  }
}
