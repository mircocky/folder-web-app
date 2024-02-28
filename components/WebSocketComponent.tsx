'use client';
import React, { useEffect, useState } from 'react';
import { PrismaClient } from '@prisma/client'
import io from 'socket.io-client';
import { 
  MdCancel,
  MdCheckCircle,
 } from 'react-icons/md'; 

 import { ClipLoader } from 'react-spinners';

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
    job_status?: number;
    job_id?: string ;
    client_ref?: string;
    shipper_name?: string;
    consignee_name?: string;
    POL?: string;
    POL_NAME?:string;
    POD?: string;
    POD_NAME?:string;
    pickup_date?: string;
    pickedup?: number;
    in_terminal_date?: string;
    lodged_in_terminal?: number;
    vessel?: string;
    voyage?: string;
    ETD?: Date | string;
    departed?: number;
    ETA?: string;
    arrived?: number;
    CONSOL?: string;
    VESSEL?: string;
    CLEAR?: string;
    cleared?: number;
    EST_DELIVERY_DATE?: string;
    delivered?: number;
    VOY?: string;
    house_jobs?:string;
    // Add other properties as needed
  };
  currentTime: string;
}

interface ShipmentUpdate {
  job_id: string;
  consol_num: string;
  shipper_name: string;
  CONSOL: string;
  house_jobs:string;
  containers_websocket:any; 
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

const WebSocketComponent: React.FC <any> = (props) => {

  const { job_id, job, SHIPMENT, jobs, containers } = props

  const [messages, setMessages] = useState<MessageWithTime[]>([]);
  const [messages1, setMessages1] = useState<MessageWithTime[]>([]);
  const [messages2, setMessages2] = useState(job);
  const [messages3, setMessages3] = useState(SHIPMENT[0]);
  const [isConnected, setIsConnected] = useState(false);
  const [jobsFromJobList, setJobsFromJobList] = useState(jobs)
  const [consFromContainerList, setConsFromContainerList] = useState(containers)




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
    
    const prisma = new PrismaClient()
    console.log(jobsFromJobList)
    // Event listener for messages from the server
    socket.on('privateMessage', async (data:{username_from: string; message_for_web: { house_jobs: any}}) => {


        showNotification(data.message_for_web as ShipmentUpdate)
        console.log('priviate')
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
        console.log('run privateMessage ')

      });


      socket.on('privateMessage1', async (data:{username_from: string; message_for_web: { house_jobs: any, containers_websocket: any}}) => {
        
        showNotification(data.message_for_web as ShipmentUpdate)
        console.log('priviate1')
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
        if (data.message_for_web?.house_jobs?.length) {
          setJobsFromJobList(data.message_for_web.house_jobs);
        } 
        if(data.message_for_web?.containers_websocket?.length) {
          console.log(data.message_for_web?.containers_websocket)
          setConsFromContainerList(data.message_for_web?.containers_websocket);
        } 

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
  const iconsSizeClass:string = "xxs:w-12 xxs:h-12 xs:w-14 xs:h-14 sm:w-14 sm:h-14"
  const textSizeClass:string = "text-sm xs:text-sm sm:text-sm md:text-lg"

  const chkIconsSizeClass:string = "xxs:w-3 xxs:h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4"


  const iconSize: inconSizeType = {
    widthSize : 40,
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

{/* IF CONSOL EXISTS */}
{messages3?.CONSOL && messages2.job_status !== 0 ? (<div className="px-1 py-2 xxs:px-1.5 py-2.5 xs:px-2.5 py-4 sm:p-4 md:p-8 border">

<div className="flex flex-col sm:flex-row sm:justify-around">
      
      {/*departure 1*/}  
      {messages3.departed == 0 || messages3.arrived == 0? (
                <div className="flex flex-col items-center lg:items-start lg:flex-row"> 
                  <Image
                    src="/vessel_to_depart.png"
                    alt="vessel to depart"
                    className={`${iconsSizeClass} lg:me-5`}
                    width={iconSize.widthSize}
                    height={iconSize.heightSize}
                  />
                  <div className="flex flex-col items-center lg:items-start">
                    <p className={`${textSizeClass} mb-2 mt-2 font-bold`}>No schedule</p>
                  </div>
                </div>
        ):null}  

      {messages3.departed == 1 && messages3.arrived == 1? (
              <div className="flex flex-col items-center lg:items-start lg:flex-row"> 
                  <Image
                    src="/vessel_to_depart.png"
                    alt="vessel to depart"
                    className={`${iconsSizeClass} lg:me-5`}
                    width={iconSize.widthSize}
                    height={iconSize.heightSize}
                  />
                 <div className="flex flex-col items-center lg:items-start">
                    <p className={`${textSizeClass} mb-2 mt-2 font-bold`}>In origin</p>
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
                  </div>

                </div>
        ):null}  
      {/*departure 1*/}  


      {/*transit 1*/}                      
      {messages3.departed == 2 && messages3.arrived !== 2 ? (
          <div className="flex flex-col items-center lg:items-start lg:flex-row"> 
                  <Image
                    src="/vessel_in_transit.gif"
                    alt="vessel to depart"
                    className={`${iconsSizeClass} lg:me-5`}
                    width={iconSize.widthSize}
                    height={iconSize.heightSize}
                  />
            <div className="flex flex-col items-center lg:items-start">
              <p className={`${textSizeClass} mb-2 mt-2 font-bold`}>In transit</p>
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

          </div>
        ):null}
    {/*transit 1*/}

    {/*arrival 1*/}
    {messages3.arrived == 2 ? (
      <div className="flex flex-col items-center lg:items-start lg:flex-row"> 
                <Image
                  src="/vessel_arrived.png"
                  alt="vessel_arrived"
                  className={`${iconsSizeClass} lg:me-5`}
                  width={iconSize.widthSize}
                  height={iconSize.heightSize}
                />
          
           <div className="flex flex-col items-center lg:items-start">
              <p className={`${textSizeClass} mb-2 mt-2 font-bold`}>Arrived</p>
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
            </div>
      </div>
        ):null}
    {/*arrival 1*/}


      {/*arrow 1*/}
      {/* {messages3.arrived == 2 && messages3.cleared == 1? (
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
                )} */}
      {/*arrow 1*/}

      {/*customs 2 flex-col justify-center items-center*/}            
       <div className="flex flex-col mt-12 items-center lg:items-start lg:flex-row sm:mt-0"> 
       {jobsFromJobList.every((job: { cleared: number })=> job.cleared === 0) && (
          <Image
            src="/customs_clear.png"
            alt="customs_clear"
            className={`${iconsSizeClass} lg:me-5`}
            width={iconSize.widthSize}
            height={iconSize.heightSize}
          />
        )}

      {!jobsFromJobList.every((job: { cleared: number }) => job.cleared === 0) && !jobsFromJobList.every((job: { cleared: number }) => job.cleared === 2) && (
        <Image
            src="/customs_clearing.gif"
            alt="customs_clearing"
            className={`${iconsSizeClass} lg:me-5`}
            width={iconSize.widthSize}
            height={iconSize.heightSize}
        />
        )}

        {jobsFromJobList.every((job: { cleared: number }) => job.cleared === 2) && (
          <Image
            src="/customs_cleared.png"
            alt="customs_cleared"
            className={`${iconsSizeClass} lg:me-5`}
            width={iconSize.widthSize}
            height={iconSize.heightSize}
          />
        )}


          <div className="flex flex-col items-center lg:items-start">
          <p className={`${textSizeClass} mb-2 mt-2 font-bold`}>Customs Entries</p>
          <ul>
          {jobsFromJobList.map((job: { cleared: number, house_num:String, clear: Date | string }, index: number)=> (
                  <li className="flex mt-1" key={index}>
                      <span className={textSizeClass}>{job.house_num}</span>
                      {job.cleared === 0 && (
                        <span className="flex items-center ms-2">
                          <span className="flex">
                              <MdCancel className ={`${chkIconsSizeClass} text-xs text-gray-500`} />
                          </span>
                          <span className={`${textSizeClass} text-xs ms-1 text-slate-400`}>
                            TBA
                          </span>
                      </span>
                      )}
                      {job.cleared === 1 && (
                          <span className="flex items-center ms-2">
                              <span className={`flex xxxs:w-2 xxxs:h-2 ${chkIconsSizeClass}`}>
                                  <ClipLoader color={'#123abc'} loading={true} size="100%" />
                              </span>
                              <span className={`${textSizeClass} text-xs ms-1 text-blue-600`}>
                                  {(job.clear instanceof Date) ? job.clear.toLocaleDateString('en-GB', { dateStyle: 'short' }) 
                                  : new Date(job.clear).toLocaleDateString('en-GB', { dateStyle: 'short' })} (Est.)
                              </span>
                          </span>
                      )}
                      {job.cleared === 2 && (
                          <span className="flex items-center ms-2">
                              <MdCheckCircle className ={`${chkIconsSizeClass} text-xs text-green-500`} />
                              <span className={`${textSizeClass} ms-1 text-xs text-green-600`}>
                                  {(job.clear instanceof Date) ? job.clear.toLocaleDateString('en-GB', { dateStyle: 'short' }) 
                                  : new Date(job.clear).toLocaleDateString('en-GB', { dateStyle: 'short' })}
                              </span>
                          </span>
                      )}
                  </li>
              ))}
          </ul>
          </div>
      </div>                 
      {/*customs 2*/} 

        {/*customs list 2*/} 

        {/* <div className="flex flex-col items-center"> 
                <span className={`mt-1 ${textSizeClass}`}>Customs cleared</span>

                    <span className={`mt-1 ${textSizeClass} underline text-green-500`}>
                      {new Date(messages3.CLEAR).toLocaleDateString('en-GB') === "Invalid Date" ? (
                      messages3.CLEAR
                      ):new Date(messages3.CLEAR).toLocaleDateString('en-GB')}
                    </span>

        </div> */}
        {/*customs list 2*/} 

        {/* arrow 2 */}      
        {/* 
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
                          )} */}



            {/* {messages3.delivered == 0? (<div className="flex flex-col items-center"> 
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
              ):null}  */}

      {/* Deliveries */}

          <div className="flex flex-col mt-12 items-center lg:items-start lg:flex-row sm:mt-0">
       
       {consFromContainerList?.every((container: { delivered: number }) => container.delivered === 0) && (
            <Image
            src="/truck_inactive.png"
            alt="truck not booked"
            className={`${iconsSizeClass} lg:me-5`}
            width={iconSize.widthSize}
            height={iconSize.heightSize}
            />
        )}

      {!consFromContainerList?.every((container: { delivered: number }) => container.delivered === 0) && !consFromContainerList?.every((container: { delivered: number }) => container.delivered=== 2) && (
        <Image
            src="/pickup_booked.gif"
            alt="delivering"
            className={`${iconsSizeClass} lg:me-5`}
            width={iconSize.widthSize}
            height={iconSize.heightSize}
        />
        )}

        {consFromContainerList.length > 0 && consFromContainerList?.every((container: { delivered: number }) => container.delivered === 2) && (
            <Image
            src="/box_delivered.gif"
            alt="delivery_done"
            className={`${iconsSizeClass} lg:me-5`}
            width={iconSize.widthSize}
            height={iconSize.heightSize}
            />
        )}
           
              <div className="flex flex-col items-center lg:items-start">
                <p className={`${textSizeClass} mb-2 mt-2 font-bold`}>Deliveries</p>
                  <ul>
                  {consFromContainerList?.map((container: { 
                    container_id: number, 
                    c_number:string, 
                    delivered:number, 
                    delivery_date:Date
                    load:string,
                    packs:number, 
                    pack_type:string, 
                    weight:number, 
                    container_type:string
                  }) => (
                      <div  key={container.container_id}>
                                {/* Render content for each container */}
                        <li className="flex mt-1">
                              {container.load === "FCL" && (
                              <span className={textSizeClass}>{container.c_number}/{container.container_type}</span>
                               )}
                              {container.load === "LCL" && (
                              <span className={textSizeClass}>{container.packs}{container.pack_type} / {Number(container.weight).toFixed(2)}KG</span>
                               )}
                                      
                            {container.delivered === 0 && (
                              <span className="flex items-center ms-2">
                                <span className="flex2">
                                    <MdCancel className ={`${chkIconsSizeClass} text-xs text-gray-500`} />
                                </span>
                                <span className={`${textSizeClass} text-xs ms-1 text-slate-400`}>
                                    TBA
                                </span>
                            </span>
                                
                            )}
                            {container.delivered === 1 && (
                                <span className="flex items-center ms-2">
                                    <span className={`flex xxxs:w-2 xxxs:h-2 ${chkIconsSizeClass}`}>
                                        <ClipLoader color={'#123abc'} loading={true} size="100%" />
                                    </span>
                                    <span className={`${textSizeClass} text-xs ms-1 text-blue-600`}>
                                        {(container.delivery_date instanceof Date) ? container.delivery_date.toLocaleDateString('en-GB', { dateStyle: 'short' }) 
                                        : new Date(container.delivery_date).toLocaleDateString('en-GB', { dateStyle: 'short' })} (Est.)
                                    </span>
                                </span>
                            )}
                            {container.delivered === 2 && (
                                <span className="flex items-center ms-2">
                                    <MdCheckCircle className ={`${chkIconsSizeClass} text-xs text-green-500`} />
                                    <span className={`${textSizeClass} ms-1 text-xs text-green-600`}>
                                        {(container.delivery_date instanceof Date) ? container.delivery_date.toLocaleDateString('en-GB', { dateStyle: 'short' }) 
                                        : new Date(container.delivery_date).toLocaleDateString('en-GB', { dateStyle: 'short' })}
                                    </span>
                                </span>
                            )}
                          </li>
                      </div>
                  ))}
              </ul>

              </div>
          </div>
      {/* Deliveries */}                     
          {/* arrow 3 */}                  
          {/* {messages3.cleared == 2 && messages3.delivered == 1 && messages3.arrived == 2? (
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
             */}
            {/* {messages3.delivered == 2? (<div className="flex flex-col items-center"> 

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
              }     */}
       </div>
   </div>) : null } 

{messages2 && !messages3?.CONSOL && messages2.job_status !== 0 ?(
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

    ) : null }

{messages2?.job_status === 0 ? <div className="flex text-red-500 text-xl p-2"><span className='m-1 me-3'><MdCancel/></span> Job Cancelled</div> : null }

    {/* Consol Change */}
    <ToastContainer />
    {messages1?.map((message:any, index) => (
      <main key={index}>
      <h1 className="rounded bg-yellow-200 mb-5 mt-5 p-2 text-center text-lg font-semibold">
      Live Update - updated on {message?.currentTime}
      </h1>        
       <table  className="bg-white border border-gray-300 w-full">
            <tbody>
              <tr>
                <td colSpan={2} className={`bg-blue-300 text-white ${rowHeadTextSize}`}>Vessel Details</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>VESSEL</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.VESSEL} {message?.message_for_web?.VOY}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>From</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.POL}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>To</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.POD}</td>
              </tr>
              {message?.message_for_web?.departed == 0 ?( 
              <tr>
                <td className={rowHeadTextSize}>ETD</td>
                <td className={rowContentTextSize}></td>
              </tr>
              ):null}
              {message?.message_for_web?.departed == 1 ?( 
              <tr>
                <td className={`${rowHeadTextSize} underline text-orange-500`}>To depart on</td>
                <td className={rowContentTextSize}>{new Date(message?.message_for_web?.ETD).toLocaleDateString('en-GB', { dateStyle: 'short' })}</td>
              </tr>
              ):null}
              {message?.message_for_web?.departed == 2 ?( 
              <tr>
                <td className={`${rowHeadTextSize} underline text-green-500`}>Departed on *</td>
                <td className={rowContentTextSize}>{new Date(message?.message_for_web?.ETD).toLocaleDateString('en-GB', { dateStyle: 'short' })}</td>
              </tr>
              ):null}


              {/* <tr>
                <td className={rowHeadTextSize}>ETD</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.ETD}</td>
              </tr> */}

              {message?.message_for_web?.arrived == 0 ?( 
              <tr>
                <td className={rowHeadTextSize}>ETA</td>
                <td className={rowContentTextSize}></td>
              </tr>
              ):null}
              {message?.message_for_web?.arrived == 1 ?( 
              <tr>
                <td className={`${rowHeadTextSize} underline text-orange-500`}>To arrive on</td>
                <td className={rowContentTextSize}>{new Date(message?.message_for_web?.ETA).toLocaleDateString('en-GB', { dateStyle: 'short' })}</td>
              </tr>
              ):null}
              {message?.message_for_web?.arrived == 2 ?( 
              <tr>
                <td className={`${rowHeadTextSize} underline text-green-500`}>Arrived on *</td>
                <td className={rowContentTextSize}>{new Date(message?.message_for_web?.ETA).toLocaleDateString('en-GB', { dateStyle: 'short' })}</td>
              </tr>
              ):null}
              <tr>
                <td className={rowHeadTextSize}>PNL Job#</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.CONSOL}</td>
              </tr>

              {/* <tr>
                <td className={rowHeadTextSize}>ETA</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.ETA}</td>
              </tr> */}

              {/* {message?.message_for_web?.cleared == 0 ?( 
              <tr>
                <td className={rowHeadTextSize}>ETD</td>
                <td className={rowContentTextSize}></td>
              </tr>
              ):null}
              {message?.message_for_web?.cleared == 1 ?( 
              <tr>
                <td className={`${rowHeadTextSize} underline text-orange-500`}>To arrive on</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.ETA}</td>
              </tr>
              ):null}
              {message?.message_for_web?.cleared == 2 ?( 
              <tr>
                <td className={`${rowHeadTextSize} underline text-green-500`}>Arrived on *</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.ETA}</td>
              </tr>
              ):null} */}
{/* 
              <tr>
                <td className={rowHeadTextSize}>CUSTOMS CLEAR</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.CLEAR}</td>
              </tr> */}


              {/* {message?.message_for_web?.delivered == 0 ?( 
              <tr>
                <td className={rowHeadTextSize}>EST DELIVERY DATE</td>
                <td className={rowContentTextSize}></td>
              </tr>
              ):null}
              {message?.message_for_web?.delivered == 1 ?( 
              <tr>
                <td className={`${rowHeadTextSize} underline text-orange-500`}>To be delivered on</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.EST_DELIVERY_DATE}</td>
              </tr>
              ):null}
              {message?.message_for_web?.delivered == 2 ?( 
              <tr>
                <td className={`${rowHeadTextSize} underline text-green-500`}>Delivered on *</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.EST_DELIVERY_DATE}</td>
              </tr>
              ):null} */}

              {/* <tr>
                <td className={rowHeadTextSize}>EST DELIVERY DATE</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.EST_DELIVERY_DATE}</td>
              </tr> */}

            </tbody>
            </table>
            <table className="mt-3 bg-white border border-gray-300 w-full">
        {jobsFromJobList.map((job:any) => 
          <tbody className="m-2" key={job.job_id} >
          <tr>
          <td className="p-2 bg-orange-300"></td>
          <td className="p-2 bg-orange-300"></td>
          </tr>
          <tr>
          <td className={rowHeadTextSize}>House# {job.job_seq}</td>
          <td className={`${rowContentTextSize} text-red-500`}>{job?.house_num}</td>
          </tr>
          <tr>
          <td className={rowHeadTextSize}>Job ID</td>
          <td className={rowContentTextSize}>{job?.job_id}</td>
          </tr>
          <tr>
          <td className={rowHeadTextSize}>Client_ref#</td>
          <td className={rowContentTextSize}>{job?.client_ref}</td>
          </tr>
          <tr>
          <td className={rowHeadTextSize}>Shipper</td>
          <td className={rowContentTextSize}>{job?.shipper_name}</td>
          </tr>
          <tr>
          <td className={rowHeadTextSize}>Consignee</td>
          <td className={rowContentTextSize}>{job?.consignee_name}</td>
          </tr>
          <tr>
          <td className={rowHeadTextSize}>Customs Clear</td>
          <td className={rowContentTextSize}>
             {job.cleared === 0 && (
                  <span className="flex">
                    <span className={`text-slate-400`}>
                      TBA
                    </span>
                  </span>
                      )}
             {job.cleared === 1 && (
                  <span className="flex items-center">
                    <span className={`text-blue-600`}>
                           {new Date(job?.clear).toLocaleDateString('en-GB', { dateStyle: 'short' })} (Est.)
                      </span>
                      <span className={`flex xxxs:w-3 xxxs:h-3 ms-1 ${chkIconsSizeClass}`}>
                          <ClipLoader color={'#123abc'} loading={true} size="100%" />
                      </span>   
                  </span>
                      )}
            {job.cleared === 2 && (
                  <span className="flex items-center">
                      <span className={`text-green-600`}>
                            {new Date(job?.clear).toLocaleDateString('en-GB', { dateStyle: 'short' })}
                      </span>
                      <span className="flex ms-1">
                      <MdCheckCircle className ={`text-green-500`} />
                      </span>
                  </span>
             )}
            </td>
          </tr>
          </tbody>
         )}
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
              {/* const rowHeadTextSize: string ="xxs:w-8 xxs:h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12"
              const rowContentTextSize: string ="xxs:w-8 xxs:h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12" */}
              {message?.message_for_web?.job_status === 0 ?(
              <tr>
                <td className={rowHeadTextSize}>PNL Booking#</td>
                <td className={rowContentTextSize}>
                  <span  className='line-through' style={{ textDecorationColor: 'red'}}>{job?.job_id}</span><span className="text-red-500"> Cancelled</span>
                  </td>
              </tr>
              ):(
              <tr>
                <td className={rowHeadTextSize}>PNL Booking#</td>
                <td className={rowContentTextSize}>{job?.job_id}</td>
              </tr>
              )}
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
                <td className={rowContentTextSize}>{message?.message_for_web?.POL_NAME}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>To</td>
                <td className={rowContentTextSize}>{message?.message_for_web?.POD_NAME}</td>
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