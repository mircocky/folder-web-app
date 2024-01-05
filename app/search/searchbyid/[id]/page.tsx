import { PrismaClient } from '@prisma/client'
import { Prisma } from '@prisma/client';
import WebSocketComponent from '@/components/WebSocketComponent';
import Image from 'next/image';

const IdPage = async ({
    params,
}:{
    params:{id: number};
}) => {

  const prisma = new PrismaClient()
  let job_id = params.id


  type ShipmentWhereInput = Omit<Prisma.FIS_SHIPMENTLISTWhereInput, 'CONSOL'> & {
    CONSOL?: Prisma.StringFilter;
  };


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
    } as ShipmentWhereInput,
  });

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

  return (
    <div>
      <div><WebSocketComponent job_id={job_id} job={job} SHIPMENT={SHIPMENT}/></div>
      <h1 className="rounded bg-yellow-200 mb-5 mt-5 p-2 text-center text-lg font-semibold">
        Search By ID
      </h1>
      {SHIPMENT.length > 0 ? (
      <main>
        <table  className="bg-white border border-gray-300 w-full">
        <tbody>
          <tr>
            <td className={rowHeadTextSize}>Consol#</td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.CONSOL}</td>
          </tr>
          <tr>
            <td className={rowHeadTextSize}>From</td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.POL}</td>
          </tr>
          <tr>
            <td className={rowHeadTextSize}>To</td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.POD}</td>
          </tr>
          <tr>
            <td className={rowHeadTextSize}>VESSEL</td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.VESSEL} {SHIPMENT[0]?.VOY}</td>
          </tr>
          <tr>
            <td className={rowHeadTextSize}>ETD </td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.ETD?.toLocaleDateString('en-GB')}</td>
          </tr>
          <tr>
            <td className={rowHeadTextSize}>ETA</td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.ETA?.toLocaleDateString('en-GB')}</td>
          </tr>
          <tr>
            <td className={rowHeadTextSize}>CUSTOMS CLEAR</td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.CLEAR?.toLocaleDateString('en-GB')}</td>
          </tr>
          <tr>
            <td className={rowHeadTextSize}>EST DELIVERY DATE</td>
            <td className={rowContentTextSize}>{SHIPMENT[0]?.EST_DELIVERY_DATE?.toLocaleDateString('en-GB')}</td>
          </tr>
        </tbody>
        </table>
        <table className="mt-3 bg-white border border-gray-300 w-full">
        {consol_jobs.map((job) => 
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
          </tbody>
         )}
         </table>
      </main>)
      :(<main>
        {job ? (
          <table  className="bg-white border border-gray-300 w-full">
            <tbody>
              <tr>
                <td className={rowHeadTextSize}>PNL Booking#</td>
                <td className={rowContentTextSize}>{job?.job_id}</td>
              </tr>
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
                <td className={rowContentTextSize}>{job?.POL}</td>
              </tr>
              <tr>
                <td className={rowHeadTextSize}>To</td>
                <td className={rowContentTextSize}>{job?.POD}</td>
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