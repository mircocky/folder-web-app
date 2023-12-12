'use client'
// app/contact/page.tsx
// app/contact/page.tsx
import React from 'react';
import Head from 'next/head';

const ContactPage: React.FC = () => {
  const subscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      const existingSubscription = await registration.pushManager.getSubscription();

      if (!existingSubscription) {
        // Subscribe a new push notification
        const newSubscription = await subscribeUser(registration);
        console.log('New subscription:', newSubscription);
      } else {
        console.log('Already subscribed:', existingSubscription);
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  const subscribeUser = async (registration: ServiceWorkerRegistration) => {
    try {
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BACVDg1IY5L2sGus64krTUOGMIqv3ljPqgzupCaxyhGU2x3b_rNcPPCTOqwxaAazHltJKmvi9eJRKhs_y0DKdjg',
      });

      // Send the new subscription to your server (you need a backend to handle this)
      // sendSubscriptionToServer(newSubscription);

      return newSubscription;
    } catch (error) {
      console.error('Error subscribing user:', error);
      throw error;
    }
  };

  const showNotification = () => {
    console.log('Attempting to show notification');
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Permission granted. Showing notification.');
  
          try {
            const notification = new Notification('Hello', {
              body: 'This is the body of the notification',
              icon: '/logo.png',
            });
  
            notification.onclick = () => {
              console.log('Notification clicked');
            };
  
            notification.onclose = () => {
              console.log('Notification closed');
            };
          } catch (error) {
            console.error('Error creating Notification:', error);
          }
        } else {
          console.log('Permission denied.');
        }
      });
    } else {
      console.log('Notifications not supported in this browser.');
    }
  };
  

  return (
    <div>
      <Head>
        <title>Push Notification Example</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <button onClick={subscribe}>Subscribe to Push Notifications</button>
      <button onClick={showNotification}>Show Push Notification</button>
    </div>
  );
};

export default ContactPage;
