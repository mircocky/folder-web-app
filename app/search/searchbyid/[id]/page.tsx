import { PrismaClient } from '@prisma/client'
import WebSocketComponent from '@/components/WebSocketComponent';
import { 
  MdCancel,
  MdCheckCircle,
 } from 'react-icons/md'; 

 import { ClipLoader } from 'react-spinners';



const IdPage = async ({
    params,
}:{
    params:{id: number};
}) => {

  const prisma = new PrismaClient()
  let job_id = params.id

  const job = await prisma.fIS_JOBLIST.findUnique({
    where: {
      job_id: Number(job_id)
    }
  })

  const SHIPMENT = await prisma.fIS_SHIPMENTLIST.findMany({
    where: {
      CONSOL: {
        equals: job?.consol_num ?? "",
      },
    },
  });

  const jobs = await prisma.fIS_JOBLIST.findMany({
    where: {
     consol_num: job?.consol_num ?? "",
    }
  })

  const containers = await prisma.fRT_CONTAINER.findMany({
    where: {
     consol_num: job?.consol_num ?? "",
    }
  })

  if (SHIPMENT.length > 0) {
    // Process the case where there is at least one matching record
    console.log(SHIPMENT[0]?.CONSOL);
    job_id = Number(job?.consol_num)
    // Other code related to handling the found records
  } else {
    // Process the case where there are no matching records
    console.log("No matching records found.");
    // Other code related to handling the absence of records
  }

  const consol_jobs = await prisma.fIS_JOBLIST.findMany({
    where: {
      consol_num: SHIPMENT[0]?.CONSOL
    }
  })

 

  const POLCodeToFind = job?.POL;
  let POL_NAME = '';
    
  if (POLCodeToFind) {
    try {
      const portDetails = await prisma.uN_PORTCODE.findUnique({
        where: {
          PORT_CODE: POLCodeToFind,
        },
      });
  
      if (portDetails) {
        POL_NAME = portDetails.PORT_NAME || ''; 
        console.log(`The PORT_NAME for POL '${POLCodeToFind}' is: ${POL_NAME}`);
      } else {
        POL_NAME = ''
        console.log(`No entry found for POL '${POLCodeToFind}'.`);
      }
    } catch (error) {
      console.error(`Error fetching data for POL '${POLCodeToFind}':`, error);
    }
  } else {
    console.log("No POL value found in the first element of SHIPMENT.");
  }
  
  const PODCodeToFind = job?.POD;
  let POD_NAME = '';
  
  if (PODCodeToFind) {
    try {
      const PODDetails = await prisma.uN_PORTCODE.findUnique({
        where: {
          PORT_CODE: PODCodeToFind,
        },
      });
  
      if (PODDetails) {
        POD_NAME = PODDetails.PORT_NAME || '';
        console.log(`The PORT_NAME for POD '${PODCodeToFind}' is: ${POD_NAME}`);
      } else {
        POD_NAME = ''
        console.log(`No entry found for POD '${PODCodeToFind}'.`);
      }
    } catch (error) {
      console.error(`Error fetching data for POD '${PODCodeToFind}':`, error);
    }
  } else {
    console.log("No POD value found in the first element of SHIPMENT.");
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

  const chkIconsSizeClass:string = "xxs:w-3 xxs:h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4"

  return (
    <div>
      <div><WebSocketComponent job_id={job_id} job={job} SHIPMENT={SHIPMENT} jobs={jobs} containers={containers}/></div>
      <h1 className="rounded bg-yellow-200 mb-5 mt-5 p-2 text-center text-lg font-semibold">
        Search By ID
      </h1>
      {SHIPMENT.length > 0 ? (
      <main>
        <table  className="bg-white border border-gray-300 w-full">
        <tbody>
          <tr>
            <td colSpan={2} className={`bg-blue-300 text-white ${rowHeadTextSize}`}>Vessel Details</td>
          </tr>
          <tr>
            <td className={rowHeadTextSize}>Vessel</td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.VESSEL} {SHIPMENT[0]?.VOY}</td>
          </tr>
          <tr>
            <td className={rowHeadTextSize}>From</td>
            <td className={rowContentTextSize}>{POL_NAME}</td>
          </tr>
          <tr>
            <td className={rowHeadTextSize}>To</td>
            <td className={rowContentTextSize}>{POD_NAME}</td>
          </tr>
          {SHIPMENT[0].departed == 0 ?( 
          <tr>
            <td className={rowHeadTextSize}>ETD</td>
            <td className={rowContentTextSize}></td>
          </tr>
          ):null}
          {SHIPMENT[0].departed == 1 ?( 
          <tr>
            <td className={`${rowHeadTextSize} underline text-orange-500`}>To depart on</td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.ETD?.toLocaleDateString('en-GB')}</td>
          </tr>
          ):null}
          {SHIPMENT[0].departed == 2 ?( 
          <tr>
            <td className={`${rowHeadTextSize} underline text-green-500`}>Departed on *</td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.ETD?.toLocaleDateString('en-GB')}</td>
          </tr>
          ):null}

          {/* <tr>
            <td className={rowHeadTextSize}>ETD </td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.ETD?.toLocaleDateString('en-GB')}</td>
          </tr> */}
      
          {SHIPMENT[0].arrived == 0 ?( 
          <tr>
            <td className={rowHeadTextSize}>ETD</td>
            <td className={rowContentTextSize}></td>
          </tr>
          ):null}
          {SHIPMENT[0].arrived  == 1 ?( 
          <tr>
            <td className={`${rowHeadTextSize} underline text-orange-500`}>To arrive on</td>
            <td className={rowContentTextSize}>{SHIPMENT[0].ETA?.toLocaleDateString('en-GB')}</td>
          </tr>
          ):null}
          {SHIPMENT[0].arrived  == 2 ?( 
          <tr>
            <td className={`${rowHeadTextSize} underline text-green-500`}>Arrived on *</td>
            <td className={rowContentTextSize}>{SHIPMENT[0].ETA?.toLocaleDateString('en-GB')}</td>
          </tr>
          ):null}

          <tr>
            <td className={rowHeadTextSize}>PNL Job#</td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.CONSOL}</td>
          </tr>

          {/* <tr>
            <td className={rowHeadTextSize}>ETA</td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.ETA?.toLocaleDateString('en-GB')}</td>
          </tr> */}

        {/*CONTENT {SHIPMENT[0].cleared == 0 ?( 
          <tr>
            <td className={rowHeadTextSize}>CUSTOMS CLEAR</td>
            <td className={rowContentTextSize}></td>
          </tr>
          ):null}
          {SHIPMENT[0].cleared  == 1 ?( 
          <tr>
            <td className={`${rowHeadTextSize} underline text-orange-500`}>To be cleared on</td>
            <td className={rowContentTextSize}>{SHIPMENT[0].CLEAR?.toLocaleDateString('en-GB')}</td>
          </tr>
          ):null}
          {SHIPMENT[0].cleared  == 2 ?( 
          <tr>
            <td className={`${rowHeadTextSize} underline text-green-500`}>Cleared on *</td>
            <td className={rowContentTextSize}>{SHIPMENT[0].CLEAR?.toLocaleDateString('en-GB')}</td>
          </tr>
          ):null} */}

          {/* <tr>
            <td className={rowHeadTextSize}>CUSTOMS CLEAR</td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.CLEAR?.toLocaleDateString('en-GB')}</td>
          </tr> */}

          
          {/* CONTENT {SHIPMENT[0].delivered == 0 ?( 
          <tr>
            <td className={rowHeadTextSize}>CUSTOMS CLEAR</td>
            <td className={rowContentTextSize}></td>
          </tr>
          ):null}
          {SHIPMENT[0].delivered  == 1 ?( 
          <tr>
            <td className={`${rowHeadTextSize} underline text-orange-500`}>To be delivered on</td>
            <td className={rowContentTextSize}>{SHIPMENT[0].EST_DELIVERY_DATE?.toLocaleDateString('en-GB')}</td>
          </tr>
          ):null}
          {SHIPMENT[0].delivered  == 2 ?( 
          <tr>
            <td className={`${rowHeadTextSize} underline text-green-500`}>Delivered on *</td>
            <td className={rowContentTextSize}>{SHIPMENT[0].EST_DELIVERY_DATE?.toLocaleDateString('en-GB')}</td>
          </tr>
          ):null} */}

          {/* <tr>
            <td className={rowHeadTextSize}>EST DELIVERY DATE</td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.EST_DELIVERY_DATE?.toLocaleDateString('en-GB')}</td>
          </tr> */}

        </tbody>
        </table>
        <table className="mt-3 bg-white border border-gray-300 w-full">
        {consol_jobs.map((job:any) => 
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
                  <span className="flex">
                    <span className={`text-blue-600`}>
                           {new Date(job?.clear).toLocaleDateString('en-GB', { dateStyle: 'short' })} (Est.)
                      </span>
                      <span className={`flex ms-1 mt-1 xxxs:w-3 xxxs:h-3 ${chkIconsSizeClass}`}>
                          <ClipLoader color={'#123abc'} loading={true} size="100%" />
                      </span>   
                  </span>
                      )}
            {job.cleared === 2 && (
                  <span className="flex">
                      <span className={`text-green-600`}>
                            {new Date(job?.clear).toLocaleDateString('en-GB', { dateStyle: 'short' })}
                      </span>
                      <span className="ms-1 flex items-center">
                      <MdCheckCircle className ={`text-green-500`} />
                      </span>
                  </span>
             )}
            </td>
            </tr>
          </tbody>
         )}
         </table>
      </main>)
      :(<main>
        {job ? (
          <table  className="bg-white border border-gray-300 w-full">
            <tbody>
              {job.job_status === 0 ?(
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
                <td className={rowHeadTextSize}>From</td>
                <td className={rowContentTextSize}>{POL_NAME}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>To</td>
                <td className={rowContentTextSize}>{POD_NAME}</td>
              </tr>
              {job?.pickup_date? (
                  <tr>
                  {job?.pickedup == 1 ?(
                    <td className={`${rowHeadTextSize} underline text-orange-500`}>
                    To be picked up on 
                    </td>
                    ):(null)}
                    {job?.pickedup == 2 ?(
                    <td className={`${rowHeadTextSize} underline text-green-500`}>
                    Picked up on *
                    </td>
                    ):(null)}
                    <td className={rowContentTextSize}>
                    {job?.pickup_date?.toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className={rowHeadTextSize}>Pick Up Date</td>
                    <td className={rowContentTextSize}>Unkown</td>
                  </tr>
              )}
              {job?.in_terminal_date? (
                  <tr>
                    {job?.lodged_in_terminal == 1 ?(
                    <td className={`${rowHeadTextSize} underline text-orange-500`}>
                    To be lodged in terminal on
                    </td>
                    ):(null)}
                    {job?.lodged_in_terminal == 2 ?(
                    <td className={`${rowHeadTextSize} underline text-green-500`}>
                    Lodged in terminal on *
                    </td>
                    ):(null)}
                    <td className={rowContentTextSize}>
                    {job?.in_terminal_date?.toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className={rowHeadTextSize}>Lodge to Terminal Date</td>
                    <td className={rowContentTextSize}>Unkown</td>
                  </tr>
                )}
              {job?.vessel ?(
                <tr>
                    <td className={rowHeadTextSize}>Vessel</td>
                    <td className={rowContentTextSize}>{job?.vessel} {job?.voyage}</td>
                </tr>
              ):
              (
               <tr>
                  <td className={rowHeadTextSize}>Vessel</td>
                  <td className={rowContentTextSize}>Unkown</td>
               </tr>
              )}
                {job?.ETD? (
                  <tr>
                    {job?.departed == 1 ?(
                    <td className={rowHeadTextSize}>
                    To depart on
                    </td>
                    ):(null)}
                    {job?.departed == 2 ?(
                    <td className={`${rowHeadTextSize} underline text-green-500`}>
                    Departed on *
                    </td>
                    ):(null)}
                    <td className={rowContentTextSize}>
                    {job?.ETD?.toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className={rowHeadTextSize}>Deaprture Date</td>
                    <td className={rowContentTextSize}>Unkown</td>
                  </tr>
                )}
                {job?.ETA? (
                  <tr>
                    {job?.arrived == 1 ?(
                    <td className={`${rowHeadTextSize} underline text-orange-500`}>
                    To arrive on
                    </td>
                    ):(null)}
                    {job?.arrived == 2 ?(
                    <td className={`${rowHeadTextSize} underline text-green-500`}>
                    Arrived on *
                    </td>
                    ):(null)}
                    <td className={rowContentTextSize}>
                    {job?.ETA?.toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className={rowHeadTextSize}>Arrival Date</td>
                    <td className={rowContentTextSize}>Unkown</td>
                  </tr>
                )}
            </tbody>
          </table>
        ) : (
          <h1 className="text-red-500 text-xl">
            No job found. Please check again.
          </h1>
        )} 
      </main>) }
    </div>
  );
}

export default IdPage;