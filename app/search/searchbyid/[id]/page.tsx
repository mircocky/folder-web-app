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
            <td className="py-2 px-4 border-b font-semibold w-48">Consol#</td>
            <td className="py-2 px-4 border-b ">{SHIPMENT[0]?.CONSOL}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b font-semibold w-48">From</td>
            <td className="py-2 px-4 border-b">{SHIPMENT[0]?.POL}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b font-semibold w-48">To</td>
            <td className="py-2 px-4 border-b">{SHIPMENT[0]?.POD}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b font-semibold w-48">VESSEL</td>
            <td className="py-2 px-4 border-b">{SHIPMENT[0]?.VESSEL} {SHIPMENT[0]?.VOY}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b font-semibold w-48">ETD </td>
            <td className="py-2 px-4 border-b">{SHIPMENT[0]?.ETD?.toLocaleDateString()}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b font-semibold w-48">ETA</td>
            <td className="py-2 px-4 border-b">{SHIPMENT[0]?.ETA?.toLocaleDateString()}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b font-semibold w-48">CUSTOMS CLEAR</td>
            <td className="py-2 px-4 border-b">{SHIPMENT[0]?.CLEAR?.toLocaleDateString()}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b font-semibold w-48">EST DELIVERY DATE</td>
            <td className="py-2 px-4 border-b">{SHIPMENT[0]?.EST_DELIVERY_DATE?.toLocaleDateString()}</td>
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
          <td className="py-2 px-4 border-b font-semibold w-36">House# {job.job_seq}</td>
          <td className="py-2 px-4 border-b text-red-500 ">{job?.house_num}</td>
          </tr>
          <tr>
          <td className="py-2 px-4 border-b font-semibold w-36">Job ID</td>
          <td className="py-2 px-4 border-b">{job?.job_id}</td>
          </tr>
          <tr>
          <td className="py-2 px-4 border-b font-semibold w-36">Client_ref#</td>
          <td className="py-2 px-4 border-b">{job?.client_ref}</td>
          </tr>
          <tr>
          <td className="py-2 px-4 border-b font-semibold w-36">Shipper</td>
          <td className="py-2 px-4 border-b">{job?.shipper_name}</td>
          </tr>
          <tr>
          <td className="py-2 px-4 border-b font-semibold w-36">Consignee</td>
          <td className="py-2 px-4 border-b">{job?.consignee_name}</td>
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
                <td className="py-2 px-4 border-b font-semibold w-48">PNL Booking#</td>
                <td className="py-2 px-4 border-b">{job?.job_id}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold w-48">Client Ref</td>
                <td className="py-2 px-4 border-b">{job?.client_ref}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold w-48">Shipper</td>
                <td className="py-2 px-4 border-b">{job?.shipper_name}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold w-48">Consignee</td>
                <td className="py-2 px-4 border-b">{job?.consignee_name}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold w-48">From</td>
                <td className="py-2 px-4 border-b">{job?.POL}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold w-48">To</td>
                <td className="py-2 px-4 border-b">{job?.POD}</td>
              </tr>
              {job?.pickup_date? (
                  <tr>
                  {job?.pickedup == 1 ?(
                    <td className="py-2 px-4 border-b font-semibold  underline text-orange-500 w-48">
                    To be picked up on 
                    </td>
                    ):(null)}
                    {job?.pickedup == 2 ?(
                    <td className="py-2 px-4 border-b font-semibold  underline text-green-500 w-48">
                    Picked up on *
                    </td>
                    ):(null)}
                    <td className="py-2 px-4 border-b">
                    {job?.pickup_date?.toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold w-48">Pick Up Date</td>
                    <td className="py-2 px-4 border-b">Unkown</td>
                  </tr>
              )}
              {job?.in_terminal_date? (
                  <tr>
                    {job?.lodged_in_terminal == 1 ?(
                    <td className="py-2 px-4 border-b font-semibold underline text-orange-500 w-48">
                    To be lodged in terminal on
                    </td>
                    ):(null)}
                    {job?.lodged_in_terminal == 2 ?(
                    <td className="py-2 px-4 border-b font-semibold  underline text-green-500 w-48">
                    Lodged in terminal on *
                    </td>
                    ):(null)}
                    <td className="py-2 px-4 border-b">
                    {job?.in_terminal_date?.toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold w-48">Lodge to Terminal Date</td>
                    <td className="py-2 px-4 border-b">Unkown</td>
                  </tr>
                )}
              {job?.vessel ?(
                <tr>
                    <td className="py-2 px-4 border-b font-semibold w-48">Vessel</td>
                    <td className="py-2 px-4 border-b">{job?.vessel} {job?.voyage}</td>
                </tr>
              ):
              (
               <tr>
                  <td className="py-2 px-4 border-b font-semibold w-48">Vessel</td>
                  <td className="py-2 px-4 border-b">Unkown</td>
               </tr>
              )}
                {job?.ETD? (
                  <tr>
                    {job?.departed == 1 ?(
                    <td className="py-2 px-4 border-b font-semibold w-48">
                    To depart on
                    </td>
                    ):(null)}
                    {job?.departed == 2 ?(
                    <td className="flex py-2 px-4 border-b font-semibold w-48">
                    Departed on <Image src='/vessel_departed.png' alt='departed' width={70} height={70} />
                    </td>
                    ):(null)}
                    <td className="py-2 px-4 border-b">
                    {job?.ETD?.toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold w-48">Deaprture Date</td>
                    <td className="py-2 px-4 border-b">Unkown</td>
                  </tr>
                )}
                {job?.ETA? (
                  <tr>
                    {job?.arrived == 1 ?(
                    <td className="py-2 px-4 border-b font-semibold w-48">
                    To arrive on
                    </td>
                    ):(null)}
                    {job?.arrived == 2 ?(
                    <td className="py-2 px-4 border-b font-semibold w-48">
                    Arrived on
                    </td>
                    ):(null)}
                    <td className="py-2 px-4 border-b">
                    {job?.ETA?.toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold w-48">Arrival Date</td>
                    <td className="py-2 px-4 border-b">Unkown</td>
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