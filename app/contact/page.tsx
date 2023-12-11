// pages/contact.js

import WebSocketComponent from '@/components/WebSocketComponent';
import Head from 'next/head';

const ContactPage = () => {
  return (
    <div className="container mx-auto mt-8 p-8">
      <Head>
        <title>Chat With Us</title>
      </Head>
      <h1 className="text-3xl font-semibold mb-6">Contact Us</h1>
      <WebSocketComponent />
    </div>
  );
};

export default ContactPage;
