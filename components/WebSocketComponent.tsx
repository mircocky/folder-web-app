'use client';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { Button } from "./ui/button";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CustomToastProps {
  closeToast: () => void;
  notificationMessage: {
    hello?: string;
  };
}

interface MessageWithTime {
  username_from: string;
  message_for_web: {
    job_id?: string;
    client_ref?: string;
    shipper_name?: string;
    consignee_name?: string;
    POL?: string;
    POD?: string;
    pickup_date?: string;
    pickedup?: number;
    in_terminal_date?: string;
    lodged_in_terminal?: number;
    vessel?: string;
    voyage?: string;
    ETD?: string;
    departed?: number;
    ETA?: string;
    arrived?: number;
    // Add other properties as needed
  };
  currentTime: string;
}

const WebSocketComponent: React.FC = () => {
  const [messages, setMessages] = useState<MessageWithTime[]>([]);

  const CustomToast: React.FC<CustomToastProps> = ({ closeToast , notificationMessage }) => (
    <div>
      <h2 key={1}> {notificationMessage?.hello}</h2>
      <Button onClick={closeToast}
      className="bg-green-500 hover:bg-green-800"
      >Close</Button>
    </div>
  );

  const notify = (notificationMessage: object) => {
    toast(<CustomToast closeToast={toast.dismiss} notificationMessage={notificationMessage} />,{  
    position: 'top-left',  // Set the position of the notification
    // autoClose: 5000,     
    autoClose: false,     // Set the duration for which the notification is displayed (in milliseconds)
    hideProgressBar: false,  // Show or hide the progress bar
    closeOnClick: true,     // Close the notification when clicked
    draggable: true,        // Allow the notification to be dragged
    pauseOnHover: true,     // Pause the timer when hovered});
    style: {
      width: '500px',
      height: '200px',
    }
    })

  }
  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io('wss://port-0-folder-web-app-websocket-server-32updzt2alppbaefq.sel4.cloudtype.app/');
    // const socket = io('http://localhost:3000');
//     const socket = io('ws://localhost:3000', {
//   reconnection: true,
//   reconnectionDelay: 10000, // 1 second delay between retries
// });
    const username = '100000027'
    socket.emit('login', username);
    

    // Event listener for messages from the server
    socket.on('privateMessage', (data: { username_from: string; message_for_web: object ;}) => {
        console.log('Message from server:', data);

        const currentTime = new Date().toLocaleString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true, // Use 12-hour clock with am/pm
        });
    
        const messageWithTime = {
          ...data,
          currentTime,
        };


        setMessages((prevData) => [messageWithTime, ...prevData]);
        const notificationMessage:object = {
          hello: "Shipment Update Notification",
        }
        notify(notificationMessage)
      });

    // Cleanup function to disconnect the socket when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <ToastContainer />
    {messages?.map((message, index) => (
      <main key={index}>
      <h1 className="rounded bg-yellow-200 mb-5 mt-5 p-2 text-center text-lg font-semibold">
      Live Update - updated on {message?.currentTime}
      </h1>        
       <table  className="bg-white border border-gray-300 w-full">
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b font-semibold">PNL Booking#</td>
                <td className="py-2 px-4 border-b">{message?.message_for_web.job_id}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold">Client Ref</td>
                <td className="py-2 px-4 border-b">{message?.message_for_web?.client_ref}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold">Shipper</td>
                <td className="py-2 px-4 border-b">{message?.message_for_web?.shipper_name}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold">Consignee</td>
                <td className="py-2 px-4 border-b">{message?.message_for_web?.consignee_name}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold">From</td>
                <td className="py-2 px-4 border-b">{message?.message_for_web?.POL}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold">To</td>
                <td className="py-2 px-4 border-b">{message?.message_for_web?.POD}</td>
              </tr>
              {message?.message_for_web?.pickup_date ? (
                  <tr>
                    {message?.message_for_web?.pickedup == 1 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    To be picked up on 
                    </td>
                    ):(null)}
                    {message?.message_for_web?.pickedup == 2 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    Picked up on
                    </td>
                    ):(null)}
                    <td className="py-2 px-4 border-b">
                    {message?.message_for_web?.pickup_date}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold">Pick Up Date</td>
                    <td className="py-2 px-4 border-b">Unkown</td>
                  </tr>
              )}
              {message?.message_for_web?.in_terminal_date? (
                  <tr>
                    {message?.message_for_web?.lodged_in_terminal == 1 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    To be lodged in CFS/CY on
                    </td>
                    ):(null)}
                    {message?.message_for_web?.lodged_in_terminal == 2 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    Lodged in CFS/CY on
                    </td>
                    ):(null)}
                    <td className="py-2 px-4 border-b">
                    {message?.message_for_web?.in_terminal_date}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold">Lodge to Terminal Date</td>
                    <td className="py-2 px-4 border-b">Unkown</td>
                  </tr>
                )}
              {message?.message_for_web?.vessel ?(
                <tr>
                    <td className="py-2 px-4 border-b font-semibold">Vessel</td>
                    <td className="py-2 px-4 border-b">{message?.message_for_web?.vessel} {message?.message_for_web?.voyage}</td>
                </tr>
              ):
              (
               <tr>
                  <td className="py-2 px-4 border-b font-semibold">Vessel</td>
                  <td className="py-2 px-4 border-b">Unkown</td>
               </tr>
              )}
                {message?.message_for_web?.ETD? (
                  <tr>
                    {message?.message_for_web?.departed == 0 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    Deaprture Date
                    </td>
                    ):(null)}
                    {message?.message_for_web?.departed == 1 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    To depart on
                    </td>
                    ):(null)}
                    {message?.message_for_web?.departed == 2 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    Deaprted on
                    </td>
                    ):(null)}
                    <td className="py-2 px-4 border-b">
                    {message?.message_for_web?.ETD}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold">Deaprture Date</td>
                    <td className="py-2 px-4 border-b">Unkown</td>
                  </tr>
                )}
                {message?.message_for_web?.ETA ? (
                  <tr>
                    {message?.message_for_web?.arrived == 0 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    Arrival Date
                    </td>
                    ):(null)}
                    {message?.message_for_web?.arrived == 1 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    To arrive on
                    </td>
                    ):(null)}
                    {message?.message_for_web?.arrived == 2 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    Arrived on
                    </td>
                    ):(null)}
                    <td className="py-2 px-4 border-b">
                    {message?.message_for_web?.ETA}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold">Arrival Date</td>
                    <td className="py-2 px-4 border-b">Unkown</td>
                  </tr>
                )}
            </tbody>
          </table>
      </main>
          ))}
    </div>
  );
};

export default WebSocketComponent;