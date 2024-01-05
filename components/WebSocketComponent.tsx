'use client';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { Button } from "./ui/button";
import Image from 'next/image';

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
    CONSOL?: string;
    VESSEL?: string;
    CLEAR?: string;
    EST_DELIVERY_DATE?: string;
    VOY?: string;

    // Add other properties as needed
  };
  currentTime: string;
}

interface ShipmentUpdate {
  job_id: string;
  shipper_name: string;
  CONSOL: string;
}

const showNotification = (shipmentUpdate: ShipmentUpdate) => {
  console.log('Attempting to show notification');
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Permission granted. Showing notification.');

        try {
          
          if (shipmentUpdate.CONSOL) {
          const notification = new Notification('Shipment Update', {
            body : `Job ID: ${shipmentUpdate.CONSOL}, Shipper: ${shipmentUpdate.shipper_name}`,
            icon: '/logo.png',
          }
          
          );
          notification.onclick = () => {
            console.log('Notification clicked');
          };

          notification.onclose = () => {
            console.log('Notification closed');
          };
        }
        else {

          const notification = new Notification('Shipment Update', {
            body : `Job ID: ${shipmentUpdate.job_id}\n\Shipper: ${shipmentUpdate.shipper_name}`,
            icon: '/logo.png',
          }
          
          );
          notification.onclick = () => {
            console.log('Notification clicked');
          };

          notification.onclose = () => {
            console.log('Notification closed');
          };

        }

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


const WebSocketComponent: React.FC <{ job_id: number, job:any, SHIPMENT:any }> = ({ job_id, job, SHIPMENT}) => {
  const [messages, setMessages] = useState<MessageWithTime[]>([]);
  const [messages1, setMessages1] = useState<MessageWithTime[]>([]);
  const [messages2, setMessages2] = useState(job);
  const [messages3, setMessages3] = useState(SHIPMENT[0]);
  const [isConnected, setIsConnected] = useState(false);



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

     socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('login', channel);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });


//     const socket = io('ws://localhost:3000', {
//   reconnection: true,
//   reconnectionDelay: 10000, // 1 second delay between retries
// });
    const channel = job_id.toString(); // Ensure job_id is a string
    // socket.emit('login', {job_id,job_id});
    

    // Event listener for messages from the server
    socket.on('privateMessage', (data:{username_from: string; message_for_web: object ;}) => {
      

        showNotification(data.message_for_web as ShipmentUpdate)

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
        setMessages2(data.message_for_web);
      });


      socket.on('privateMessage1', (data:{username_from: string; message_for_web: object ;}) => {
      

        showNotification(data.message_for_web as ShipmentUpdate)

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

        setMessages1((prevData) => [messageWithTime, ...prevData]);
        const notificationMessage:object = {
          hello: "Shipment Update Notification",
        }
        notify(notificationMessage)
        setMessages3(data.message_for_web)
     
      });

    // Cleanup function to disconnect the socket when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []);

  type inconSizeType = {
    widthSize:number,
    heightSize:number 
  }
   
  // sizes of the progress bar
  const iconsSizeClass:string = "xxs:w-8 xxs:h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12"
  const textSizeClass:string = "text-[0.4rem] xxs:text-xxs xs:text-xs sm:text-sm"

  const iconSize: inconSizeType = {
    widthSize : 25,
    heightSize : 0
  }

  const arrowSize: inconSizeType = {
    widthSize : 20,
    heightSize : 0
  }

  // sizes of the main table
  const rowHeadTextSize: string = "text-[0.8rem] py-1 px-2 w-36\
    xxs:text-base xxs:py-1 xxs:px-2 xxs:w-42\
    xs:text-lg xs:py-2 xs:px-4 xs:w-48\
    sm:text-lg sm:py-3 sm:px-5 sm:w-72\
    md:w-80\
    font-semibold border-b";
     

  const rowContentTextSize: string = "text-[0.8rem] py-1 px-2\
       xxs:text-base xxs:py-1 xxs:px-2\
       xs:text-lg xs:py-2 xs:px-4\
       sm:text-lg sm:py-2 sm:px-4\
       border-b";

  // <td className="py-2 px-4 border-b font-semibold w-48">Client Ref</td>
  // <td className="py-2 px-4 border-b">{message?.message_for_web?.client_ref}</td>

  return (
    <div>
    {isConnected ? (
        <div className="flex m-3"> <Image src='/connected.png' alt='Connected' width={20} height={20} /><div className="ml-3">Live update connected</div></div>
        // Add your logic for handling socket events here
      ) : (
    <div className="flex m-3"> <Image src='/disconnected.png' alt='Disconnected' width={20} height={20} /><div className="ml-3">Live update disconnected</div></div>
      )}

{/* Progress Bar */}


{messages3?.CONSOL?(

    <div className="px-1 py-2 xxs:px-1.5 py-2.5 xs:px-2.5 py-4 sm:p-4 md:p-8 border">

      <div className="flex justify-between">

      {messages3.departed == 0 || messages3.arrived == 0? (
                <div className="flex flex-col items-center"> 
                  <Image
                    src="/vessel_to_depart.png"
                    alt="vessel to depart"
                    className={iconsSizeClass}
                    width={iconSize.widthSize}
                    height={iconSize.heightSize}
                  />
                </div>
        ):null}  

      {messages3.departed == 1 && messages3.arrived == 1? (
                  <div className="flex flex-col items-center"> 
                  <Image
                    src="/vessel_to_depart.png"
                    alt="vessel to depart"
                    className={iconsSizeClass}
                    width={iconSize.widthSize}
                    height={iconSize.heightSize}
                  />
                <span className="flex flex-col items-start">
                      <span className={`mt-1 ${textSizeClass}`}>
                        {new Date(messages3.ETD).toLocaleDateString('en-GB') === "Invalid Date" ? (
                        `ETD ${messages3.ETD}`
                        ): `ETD ${new Date(messages3.ETD).toLocaleDateString('en-GB')}`}
                      </span>

                      <span className={`mt-1 ${textSizeClass}`}>
                        {new Date(messages3.ETA).toLocaleDateString('en-GB') === "Invalid Date" ? (
                         `ETA ${messages3.ETA}`
                        ):`ETA ${new Date(messages3.ETA).toLocaleDateString('en-GB')}`}
                      </span>
                  </span>

                </div>
        ):null}  
     
      {messages3.departed == 2 && messages3.arrived !== 2 ? (
                  <div className="flex flex-col items-center"> 
                  <Image
                    src="/vessel_in_transit.gif"
                    alt="vessel to depart"
                    className={iconsSizeClass}
                    width={iconSize.widthSize}
                    height={iconSize.heightSize}
                  />
                <span className={`mt-1 ${textSizeClass}`}>In transit</span>  
                <span className="flex flex-col items-start">
                      <span className={`mt-1 ${textSizeClass} underline text-green-500`}>
                        ATD {new Date(messages3.ETD).toLocaleDateString('en-GB') === "Invalid Date" ? (
                        messages3.ETD
                        ):new Date(messages3.ETD).toLocaleDateString('en-GB')}
                      </span>

                      <span className={`mt-1 ${textSizeClass}`}>
                        ETA {new Date(messages3.ETA).toLocaleDateString('en-GB') === "Invalid Date" ? (
                        messages3.ETA
                        ):new Date(messages3.ETA).toLocaleDateString('en-GB')}
                      </span>
                  </span>

                </div>
        ):null}

    {messages3.departed == 2 && messages3.arrived == 2 ? (
      <div className="flex flex-col items-center"> 
                <Image
                  src="/vessel_arrived.png"
                  alt="vessel_arrived"
                  className={iconsSizeClass}
                  width={iconSize.widthSize}
                  height={iconSize.heightSize}
                />
          <span className={`mt-1 ${textSizeClass}`}>Arrived</span>

            <span className="flex flex-col items-start">

              <span className={`mt-1 ${textSizeClass} underline text-green-500`}>
                ATD {new Date(messages3.ETD).toLocaleDateString('en-GB') === "Invalid Date" ? (
                messages3.ETD
                ):new Date(messages3.ETD).toLocaleDateString('en-GB')}
              </span>

              <span className={`mt-1 ${textSizeClass} underline text-green-500`}>
                ATA {new Date(messages3.ETA).toLocaleDateString('en-GB') === "Invalid Date" ? (
                messages3.ETA
                ):new Date(messages3.ETA).toLocaleDateString('en-GB')}
              </span>
            </span>
      </div>
        ):null}
      {/* messages3.arrived == 2 && messages3.cleared ! == 2 */}
      {messages3.arrived == 2 && messages3.cleared == 1? (
                <div className="flex flex-col items-center"> 
                        <Image
                          src="/arrow_active.gif"
                          alt="active arrow"
                          className={iconsSizeClass}
                          width={arrowSize.widthSize}
                          height={arrowSize.heightSize}
                        />
                </div>
                ):(
                  <div className="flex flex-col items-center"> 
                  <Image
                    src="/arrow_inactive.png"
                    alt="inactive arrow"
                    className={iconsSizeClass}
                    width={arrowSize.widthSize}
                    height={arrowSize.heightSize}
                  />
                </div>
                )}

                  
      {(messages3.cleared == 0 || messages3.cleared == 1 && messages3.arrived ==1) ? (<div className="flex flex-col items-center"> 
                      <Image
                        src="/customs_clear.png"
                        alt="customs_clear"
                        className={iconsSizeClass}
                        width={iconSize.widthSize}
                        height={iconSize.heightSize}
                      />
                <span className={`mt-1 ${textSizeClass}`}>Customs</span>

                    <span className={`mt-1 ${textSizeClass}`}>
                      Est {new Date(messages3.CLEAR).toLocaleDateString('en-GB') === "Invalid Date" ? (
                      messages3.CLEAR
                      ):new Date(messages3.CLEAR).toLocaleDateString('en-GB')}
                    </span>

            </div>
              ):null}


                        

      { messages3.arrived == 2 && messages3.cleared == 1 ? (<div className="flex flex-col items-center"> 
                      <Image
                        src="/customs_clearing.gif"
                        alt="customs_clearing"
                        className={iconsSizeClass}
                        width={iconSize.widthSize}
                        height={iconSize.heightSize}
                      />
                <span className={`mt-1 ${textSizeClass}`}>Customs clearing...</span>

                    <span className={`mt-1 ${textSizeClass}`}>
                      Est {new Date(messages3.CLEAR).toLocaleDateString('en-GB') === "Invalid Date" ? (
                      messages3.CLEAR
                      ):new Date(messages3.CLEAR).toLocaleDateString('en-GB')}
                    </span>

            </div>
              ):null}


      
       {messages3.cleared == 2? (<div className="flex flex-col items-center"> 
                      <Image
                        src="/customs_cleared.png"
                        alt="customs_cleared"
                        className={iconsSizeClass}
                        width={iconSize.widthSize}
                        height={iconSize.heightSize}
                      />
                <span className={`mt-1 ${textSizeClass}`}>Customs cleared</span>

                    <span className={`mt-1 ${textSizeClass} underline text-green-500`}>
                      {new Date(messages3.CLEAR).toLocaleDateString('en-GB') === "Invalid Date" ? (
                      messages3.CLEAR
                      ):new Date(messages3.CLEAR).toLocaleDateString('en-GB')}
                    </span>

            </div>
              ):null}   

          {messages3.cleared == 2 && messages3.delivered == 0? (
                          <div className="flex flex-col items-center"> 
                                  <Image
                                    src="/arrow_active.gif"
                                    alt="active arrow"
                                    className={iconsSizeClass}
                                    width={arrowSize.widthSize}
                                    height={arrowSize.heightSize}
                                  />
                          </div>
                          ):(
                            <div className="flex flex-col items-center"> 
                            <Image
                              src="/arrow_inactive.png"
                              alt="inactive arrow"
                              className={iconsSizeClass}
                              width={arrowSize.widthSize}
                              height={arrowSize.heightSize}
                            />
                          </div>
                          )}



            {messages3.delivered == 0? (<div className="flex flex-col items-center"> 
                      <Image
                        src="/truck_inactive.png"
                        alt="truck_inactive"
                        className={iconsSizeClass}
                        width={iconSize.widthSize}
                        height={iconSize.heightSize}
                      />
                <span className={`mt-1 ${textSizeClass}`}>Booking delivery</span>

                    <span className={`mt-1 ${textSizeClass}`}>
                      {new Date(messages3.EST_DELIVERY_DATE).toLocaleDateString('en-GB') === "Invalid Date" ? (
                      messages3.ETD
                      ):new Date(messages3.EST_DELIVERY_DATE).toLocaleDateString('en-GB')}
                    </span>

            </div>



          ):null} 
                  {messages3.delivered == 1? (<div className="flex flex-col items-center"> 
                      <Image
                        src="/pickup_booked.gif"
                        alt="delivery_booked"
                        className={iconsSizeClass}
                        width={iconSize.widthSize}
                        height={iconSize.heightSize}
                      />
                <span className={`mt-1 ${textSizeClass}`}>Delivery booked</span>
            </div>
              ):null} 
                     {messages3.delivered == 2? (<div className="flex flex-col items-center"> 
                      <Image
                        src="/pickup_done.png"
                        alt="delivery_done"
                      className={iconsSizeClass}
                        width={iconSize.widthSize}
                        height={iconSize.heightSize}
                      />
                    <span className={`mt-1 ${textSizeClass}`}>Delivered*</span>
            </div>
              ):null} 


                       
          {messages3.cleared == 2 && messages3.delivered == 1 && messages3.arrived == 2? (
                          <div className="flex flex-col items-center"> 
                                  <Image
                                    src="/arrow_active.gif"
                                    alt="active arrow"
                                    className={iconsSizeClass}
                                    width={arrowSize.widthSize}
                                    height={arrowSize.heightSize}
                                  />
                          </div>
                          ):(
                            <div className="flex flex-col items-center"> 
                            <Image
                              src="/arrow_inactive.png"
                              alt="inactive arrow"
                              className={iconsSizeClass}
                              width={arrowSize.widthSize}
                              height={arrowSize.heightSize}
                            />
                          </div>
                          )}
            
            {messages3.delivered == 2? (<div className="flex flex-col items-center"> 

                      <Image
                        src="/box_delivered.gif"
                        alt="delivery_done"
                        className={iconsSizeClass}
                        width={iconSize.widthSize}
                        height={iconSize.heightSize}
                      />
                <span className={`mt-1 ${textSizeClass}`}>Delivery confirmed*</span>

                    <span className={`mt-1 ${textSizeClass} underline text-green-500`}>
                      {new Date(messages3.EST_DELIVERY_DATE).toLocaleDateString('en-GB') === "Invalid Date" ? (
                      messages3.ETD
                      ):new Date(messages3.EST_DELIVERY_DATE).toLocaleDateString('en-GB')}
                    </span>

            </div>
              ):<div className="flex flex-col items-center"> 
                <Image
                src="/client_warehouse.png"
                alt="delivery_done"
                className={iconsSizeClass}
                width={iconSize.widthSize}
                height={iconSize.heightSize}
              />
               <span className={`mt-1 ${textSizeClass}`}>Client depot</span>

            <span className={`mt-1 ${textSizeClass}`}>
              Est {new Date(messages3.EST_DELIVERY_DATE).toLocaleDateString('en-GB') === "Invalid Date" ? (
              messages3.ETD
              ):new Date(messages3.EST_DELIVERY_DATE).toLocaleDateString('en-GB')}
            </span>
            </div>
              } 

                  
       </div>
   </div>

) : null}


{ messages2 && !messages3?.CONSOL ? (
    <div className="px-1 py-2 xxs:px-1.5 py-2.5 xs:px-2.5 py-4 sm:p-4 md:p-8 border">
      <div className="flex justify-between">
        <div className="flex flex-col items-center"> 
              <Image
                src="/registered.png"
                alt="registered"
                className={iconsSizeClass}
                width={iconSize.widthSize}
                height={iconSize.heightSize}
              />
              <span className={`mt-1 ${textSizeClass}`}>Registered</span>
              <span className={`mt-1 ${textSizeClass}`}>IS{messages2.job_id}</span>
        </div>

      {messages2.pickedup == 1 ? (
          <div className="flex flex-col items-center"> 
                  <Image
                    src="/arrow_active.gif"
                    alt="active arrow"
                    className={iconsSizeClass}
                    width={arrowSize.widthSize}
                    height={arrowSize.heightSize}
                  />
          </div>
          ):(
            <div className="flex flex-col items-center"> 
            <Image
              src="/arrow_inactive.png"
              alt="active arrow"
              className={iconsSizeClass}
              width={arrowSize.widthSize}
              height={arrowSize.heightSize}
            />
          </div>
          )}

      {messages2.pickedup == 0 ? (
            <div className="flex flex-col items-center"> 
            <Image
              src="/truck_inactive.png"
              alt="Example GIF"
              className={iconsSizeClass}
              width={iconSize.widthSize}
              height={iconSize.heightSize}
            />
            <span className={`mt-1 ${textSizeClass}`}>Pickup</span>
            </div>
      ):null}

      {messages2.pickedup == 1 ? (
            <div className="flex flex-col items-center"> 
            <Image
              src="/pickup_booked.gif"
              alt="Example GIF"
              className={iconsSizeClass}
              width={iconSize.widthSize}
              height={iconSize.heightSize}
            />
            <span className={`mt-1 ${textSizeClass}`}>Truck booked</span>
            <span className={`mt-1 ${textSizeClass}`}>Est. {new Date(messages2.pickup_date).toLocaleDateString('en-GB')}</span>
            </div>
      ):null}
   
     {messages2.pickedup == 2 ? (
      <div className="flex flex-col items-center"> 
              <Image
                src="/pickup_done.png"
                alt="Example GIF"
                className={iconsSizeClass}
                width={iconSize.widthSize}
                height={iconSize.heightSize}
              />
          <span className={`mt-1 ${textSizeClass}`}>Pickup done</span>
          <span className={`mt-1 ${textSizeClass} underline text-green-500`}>{new Date(messages2.pickup_date).toLocaleDateString('en-GB')}</span>
      </div>
      ):null}


      {messages2.pickedup == 2 && messages2.lodged_in_terminal == 1 ? (
          <div className="flex flex-col items-center"> 
                  <Image
                    src="/arrow_active.gif"
                    alt="active arrow"
                    className={iconsSizeClass}
                    width={arrowSize.widthSize}
                    height={arrowSize.heightSize}
                  />
          </div>
          ):(
            <div className="flex flex-col items-center"> 
            <Image
              src="/arrow_inactive.png"
              alt="active arrow"
              className={iconsSizeClass}
              width={arrowSize.widthSize}
              height={arrowSize.heightSize}
            />
          </div>
          )}
      {messages2.lodged_in_terminal == 0? (
            <div className="flex flex-col items-center"> 
            <Image
              src="/warehouse_inactive.png"
              alt="Example GIF"
              className={iconsSizeClass}
              width={iconSize.widthSize}
              height={iconSize.heightSize}
            />
            <span className={`mt-1 ${textSizeClass}`}>Origin terminal</span>
            </div>
      ):null}

    {messages2.lodged_in_terminal == 1 ? (
            <div className="flex flex-col items-center"> 
            <Image
              src="/warehouse_est.gif"
              alt="Example GIF"
              className={iconsSizeClass}
              width={iconSize.widthSize}
              height={iconSize.heightSize}
            />
            <span className={`mt-1 ${textSizeClass}`}>To origin terminal</span>
            <span className={`mt-1 ${textSizeClass}`}>Est. {new Date(messages2.in_terminal_date).toLocaleDateString('en-GB')}</span>
            </div>
      ):null}
   
     {messages2.lodged_in_terminal == 2 ? (
      <div className="flex flex-col items-center"> 
              <Image
                src="/lodged_in_terminal.png"
                alt="Example GIF"
                className={iconsSizeClass}
                width={iconSize.widthSize}
                height={iconSize.heightSize}
              />
          <span className={`mt-1 ${textSizeClass}`}>In origin terminal</span>
          <span className={`mt-1 ${textSizeClass} underline text-green-500`}>{new Date(messages2?.in_terminal_date).toLocaleDateString('en-GB')}</span>
      </div>
      ):null}
      
      {messages2.lodged_in_terminal == 2 && messages2.departed == 1 ? (
          <div className="flex flex-col items-center"> 
                  <Image
                    src="/arrow_active.gif"
                    alt="active arrow"
                    className={iconsSizeClass}
                    width={arrowSize.widthSize}
                    height={arrowSize.heightSize}
                  />
          </div>
          ):(
            <div className="flex flex-col items-center"> 
            <Image
              src="/arrow_inactive.png"
              alt="active arrow"
              className={iconsSizeClass}
              width={arrowSize.widthSize}
              height={arrowSize.heightSize}
            />
          </div>
          )}

          {messages2.departed == 0 ? (
                  <div className="flex flex-col items-center"> 
                  <Image
                    src="/vessel_inactive.png"
                    alt="vessel inactive"
                    className={iconsSizeClass}
                    width={iconSize.widthSize}
                    height={iconSize.heightSize}
                  />
                  <span className={`mt-1 ${textSizeClass}`}>Departure</span>

                <span className="mt-5 mb-5">
                  <Image
                      className={`transform rotate-90 ${iconsSizeClass}`}
                      src="/arrow_inactive.png"
                      alt="vessel in transit"
                      width={iconSize.widthSize}
                      height={iconSize.heightSize}
                    />
                 </span> 

                  </div>
            ):null}

      {messages2.departed == 1 ? (
                  <div className="flex flex-col items-center"> 
                  <Image
                    src="/vessel_to_depart.png"
                    alt="vessel to depart"
                    className={iconsSizeClass}
                    width={iconSize.widthSize}
                    height={iconSize.heightSize}
                  />
                  <span className={`mt-1 ${textSizeClass}`}>ETD {new Date(messages2.ETD).toLocaleDateString('en-GB')}</span>
                  {messages2.arrived == 1?(
                   <span className={`mt-1 ${textSizeClass}`}>ETA {new Date(messages2?.ETA).toLocaleDateString('en-GB')}</span>
                  ):null}

                    <span className="mt-5 mb-5">
                        <Image
                              className={`transform rotate-90 ${iconsSizeClass}`}
                              src="/arrow_inactive.png"
                              alt="vessel in transit"
                              width={arrowSize.widthSize}
                              height={arrowSize.heightSize}
                            />
                    </span> 

                  </div>
            ):null}
        
          {messages2.departed == 2 ? (
            <div className="flex flex-col items-center"> 
                    <Image
                      src="/vessel_in_transit.gif"
                      alt="vessel in transit"
                      className={iconsSizeClass}
                      width={iconSize.widthSize}
                      height={iconSize.heightSize}
                    />
                <span className={`mt-1 ${textSizeClass}`}>In transit</span>
                <span className={`mt-1 ${textSizeClass} underline text-green-500`}>ATD {new Date(messages2?.ETD).toLocaleDateString('en-GB')}</span>

            <span className="mt-5 mb-5">
                <Image
                      className={`transform rotate-90 ${iconsSizeClass}`}
                      src="/arrow_active.gif"
                      alt="vessel in transit"
                      width={arrowSize.widthSize}
                      height={arrowSize.heightSize}
                    />
            </span> 
            </div>
            ):null}
        </div>

       {/* bottom container */}


        <div className="flex justify-between">

                <div className="flex flex-col items-center">
                  <span>
                      <Image
                            src="/delivered.png"
                            alt="vessel in transit"
                            className={iconsSizeClass}
                            width={iconSize.widthSize}
                            height={iconSize.heightSize}
                          />
                    </span>
                    <span className={`mt-1 ${textSizeClass}`}>
                      Delivered
                    </span>
                </div>

                <span>
                  <Image
                        className={`transform rotate-180 ${iconsSizeClass}`}
                        src="/arrow_inactive.png"
                        alt="vessel in transit"
                        width={arrowSize.widthSize}
                        height={arrowSize.heightSize}
                      />
                </span>

                <div className= "flex flex-col items-center">
                  <span>
                      <Image
                            src="/pickup_done.png"
                            alt="vessel in transit"
                            className={iconsSizeClass}
                            width={iconSize.widthSize}
                            height={iconSize.heightSize}
                            style={{ transform: 'scaleX(-1)' }}
                          />
                    </span>
                    <span className={`mt-1 ${textSizeClass}`}>
                      Delivery
                    </span>
                    {messages2.arrived == 1?(
                   <span className={`mt-1 ${textSizeClass}`}>Est {new Date(new Date(messages2?.ETA).getTime()+6*24*60*60*1000).toLocaleDateString('en-GB')}</span>
                  ):null}
                </div>
                
                <span>
                  <Image
                        className={`transform rotate-180 ${iconsSizeClass}`}
                        src="/arrow_inactive.png"
                        alt="vessel in transit"
                        width={arrowSize.widthSize}
                        height={arrowSize.heightSize}
                      />
                </span>

                <div className= "flex flex-col items-center">
                  <span>
                      <Image
                            src="/customs_clear.png"
                            alt="vessel in transit"
                            className={iconsSizeClass}
                            width={iconSize.widthSize}
                            height={iconSize.heightSize}
                          />
                    </span>
                    <span className={`mt-1 ${textSizeClass}`}>
                      Customs
                    </span>
                    {messages2.arrived == 1?(
                   <span className={`mt-1 ${textSizeClass}`}>Est {new Date(new Date(messages2?.ETA).getTime()+3*24*60*60*1000).toLocaleDateString('en-GB')}</span>
                  ):null}
                </div>

                <span>
                  <Image
                        className={`transform rotate-180 ${iconsSizeClass}`}
                        src="/arrow_inactive.png"
                        alt="vessel in transit"
                        width={arrowSize.widthSize}
                        height={arrowSize.heightSize}
                      />
                </span>

                <div className= "flex flex-col items-center">
                  <span>
                      <Image
                            src="/vessel_arrived.png"
                            alt="vessel arrived"
                            className={iconsSizeClass}
                            width={iconSize.widthSize}
                            height={iconSize.heightSize}
                          />
                    </span>
                    <span className={`mt-1 ${textSizeClass}`}>
                      Dest port
                    </span>
                    {messages2.arrived == 1?(
                   <span className={`mt-1 ${textSizeClass}`}>ETA {new Date(messages2?.ETA).toLocaleDateString('en-GB')}</span>
                  ):null}
                </div>
         </div>
         {/* bottom container */}

    </div> 
    // progress bar


    ):null}
     
    <ToastContainer />
    {messages1?.map((message, index) => (
      <main key={index}>
      <h1 className="rounded bg-yellow-200 mb-5 mt-5 p-2 text-center text-lg font-semibold">
      Live Update - updated on {message?.currentTime}
      </h1>        
       <table  className="bg-white border border-gray-300 w-full">
            <tbody>
              <tr>
                <td className={rowHeadTextSize}>Consol#</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.CONSOL}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>From</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.POL}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>To</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.POD}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>VESSEL</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.VESSEL} {message?.message_for_web?.VOY}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>ETD</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.ETD}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>ETA</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.ETA}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>CUSTOMS CLEAR</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.CLEAR}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>EST DELIVERY DATE</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.EST_DELIVERY_DATE}</td>
              </tr>
            </tbody>
         </table>
      </main>
    ))}

    {messages?.map((message, index) => (
      <main key={index}>
      <h1 className="rounded bg-yellow-200 mb-5 mt-5 p-2 text-center text-lg font-semibold">
      Live Update - updated on {message?.currentTime}
      </h1>
       <table  className="bg-white border border-gray-300 w-full">
            <tbody>
              <tr>
              {/* const rowHeadTextSize: string ="xxs:w-8 xxs:h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12"
              const rowContentTextSize: string ="xxs:w-8 xxs:h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12" */}
                <td className={rowHeadTextSize}>PNL Booking#</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.job_id}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>Client Ref</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.client_ref}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>Shipper</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.shipper_name}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>Consignee</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.consignee_name}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>From</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.POL}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>To</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.POD}</td>
              </tr>
              {message?.message_for_web?.pickup_date?(
                  <tr>
                    {message?.message_for_web?.pickedup == 0 ?(
                    <td className={rowHeadTextSize}>
                    Pickup date
                    </td>
                    ):(null)}
                    {message?.message_for_web?.pickedup == 1 ?(
                    <td className={`${rowHeadTextSize} underline text-orange-500`}>
                    To be picked up on 
                    </td>
                    ):(null)}
                    {message?.message_for_web?.pickedup == 2 ?(
                    <td className={`${rowHeadTextSize} underline text-green-500`}>
                    Picked up on *
                    </td>
                    ):(null)}
                    {message?.message_for_web?.pickedup == 0 ?(
                    <td className={rowContentTextSize}>
                    Unkown
                    </td>
                    ): (<td className={rowContentTextSize}>{new Date(message?.message_for_web?.pickup_date).toLocaleDateString('en-GB')}</td>)}
                  </tr>
                ) : (
                  <tr>
                    <td className={rowHeadTextSize}>Pickup date</td>
                    <td className={rowContentTextSize}>Unkown</td>
                  </tr>
              )}
              {message?.message_for_web?.in_terminal_date?(
                  <tr>
                    {message?.message_for_web?.lodged_in_terminal == 0 ?(
                    <td className={rowHeadTextSize}>
                    In terminal date
                    </td>
                    ):(null)}
                    {message?.message_for_web?.lodged_in_terminal == 1 ?(
                    <td className={`${rowHeadTextSize} underline text-orange-500`}>
                    To be lodged in terminal on
                    </td>
                    ):(null)}
                    {message?.message_for_web?.lodged_in_terminal == 2 ?(
                    <td className={`${rowHeadTextSize} underline text-green-500`}>
                    Lodged in terminal on *
                    </td>
                    ):(null)}
                    {message?.message_for_web?.lodged_in_terminal == 0 ?(
                    <td className={rowContentTextSize}>
                    Unkown
                    </td>
                    ): (<td className={rowContentTextSize}>{new Date(message?.message_for_web?.in_terminal_date).toLocaleDateString('en-GB')}</td>)}
                  </tr>
                ) : (
                  <tr>
                    <td className={rowHeadTextSize}>Pick Up Date</td>
                    <td className={rowContentTextSize}>Unkown</td>
                  </tr>
              )}
              {message?.message_for_web?.vessel ?(
                <tr>
                    <td className={rowHeadTextSize}>Vessel</td>
                    <td className={rowContentTextSize}>{message?.message_for_web?.vessel} {message?.message_for_web?.voyage}</td>
                </tr>
              ):
              (
               <tr>
                  <td className={rowHeadTextSize}>Vessel</td>
                  <td className={rowContentTextSize}>Unkown</td>
               </tr>
              )}
                {message?.message_for_web?.ETD?(
                  <tr>
                    {message?.message_for_web?.departed == 0 ?(
                    <td className={rowHeadTextSize}>
                    Departure date
                    </td>
                    ):(null)}
                    {message?.message_for_web?.departed == 1 ?(
                    <td className={`${rowHeadTextSize} underline text-orange-500`}>
                    To depart on
                    </td>
                    ):(null)}
                    {message?.message_for_web?.departed == 2 ?(
                    <td className={`${rowHeadTextSize} underline text-green-500`}>
                    Departed on *
                    </td>
                    ):(null)}
                    {message?.message_for_web?.departed == 0 ?(
                    <td className={rowContentTextSize}>
                    Unkown
                    </td>
                    ): (<td className={rowContentTextSize}>{new Date(message?.message_for_web?.ETD).toLocaleDateString('en-GB')}</td>)}
                  </tr>
                ) : (
                  <tr>
                    <td className={rowHeadTextSize}>Departure date</td>
                    <td className={rowContentTextSize}>Unkown</td>
                  </tr>
                 )}
                {message?.message_for_web?.ETA ?(
                  <tr>
                    {message?.message_for_web?.arrived == 0 ?(
                    <td className={rowHeadTextSize}>
                    Arrival date
                    </td>
                    ):(null)}
                    {message?.message_for_web?.arrived == 1 ?(
                    <td className={`${rowHeadTextSize} underline text-orange-500`}>
                    To arrive on
                    </td>
                    ):(null)}
                    {message?.message_for_web?.arrived == 2 ?(
                    <td className={`${rowHeadTextSize} underline text-green-500`}>
                    Arrived on *
                    </td>
                    ):(null)}
                    {message?.message_for_web?.arrived == 0 ?(
                    <td className={rowContentTextSize}>
                    Unkown
                    </td>
                    ): (<td className={rowContentTextSize}>{new Date(message?.message_for_web?.ETA).toLocaleDateString('en-GB')}</td>)}
                  </tr>
                ) : (
                  <tr>
                    <td className={rowHeadTextSize}>Arrival Date</td>
                    <td className={rowContentTextSize}>Unkown</td>
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