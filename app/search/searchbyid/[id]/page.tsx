import { PrismaClient } from '@prisma/client'

const IdPage = async ({
    params,
}:{
    params:{id: number};
}) => {

  const prisma = new PrismaClient()
  const job_id = params.id

  const job = await prisma.fIS_JOBLIST.findUnique({
    where: {
      job_id: Number(job_id)
    }
  })

  return (
    <div>
      <h1 className="rounded bg-yellow-200 mb-5 mt-5 p-2 text-center text-lg font-semibold">
        Search By ID
      </h1>
      <main>

        {job ? (
          <table  className="bg-white border border-gray-300 w-full">
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b font-semibold">Consol#</td>
                <td className="py-2 px-4 border-b">{job?.consol_num}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold">Client Ref</td>
                <td className="py-2 px-4 border-b">{job?.client_ref}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold">Shipper</td>
                <td className="py-2 px-4 border-b">{job?.shipper}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold">Consignee</td>
                <td className="py-2 px-4 border-b">{job?.consignee}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold">From</td>
                <td className="py-2 px-4 border-b">{job?.POL}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b font-semibold">To</td>
                <td className="py-2 px-4 border-b">{job?.POD}</td>
              </tr>
              {job?.pickup_date ? (
                  <tr>
                    {job?.pickedup == 1 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    To be picked up on 
                    </td>
                    ):(null)}
                    {job?.pickedup == 2 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    Picked up on
                    </td>
                    ):(null)}
                    <td className="py-2 px-4 border-b">
                    {job?.pickup_date?.toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold">Pick Up Date</td>
                    <td className="py-2 px-4 border-b">Unkown</td>
                  </tr>
              )}
              {job?.in_terminal_date? (
                  <tr>
                    {job?.lodged_in_terminal == 1 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    To be lodged in CFS/CY on
                    </td>
                    ):(null)}
                    {job?.lodged_in_terminal == 2 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    Lodged in CFS/CY on
                    </td>
                    ):(null)}
                    <td className="py-2 px-4 border-b">
                    {job?.in_terminal_date?.toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold">Lodge to Terminal Date</td>
                    <td className="py-2 px-4 border-b">Unkown</td>
                  </tr>
                )}
              {job?.vessel ?(
                <tr>
                    <td className="py-2 px-4 border-b font-semibold">Vessel</td>
                    <td className="py-2 px-4 border-b">{job?.vessel} {job?.voyage}</td>
                </tr>
              ):
              (
               <tr>
                  <td className="py-2 px-4 border-b font-semibold">Vessel</td>
                  <td className="py-2 px-4 border-b">Unkown</td>
               </tr>
              )}
                {job?.ETD? (
                  <tr>
                    {job?.departed == 0 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    Deaprture Date
                    </td>
                    ):(null)}
                    {job?.departed == 1 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    To depart on
                    </td>
                    ):(null)}
                    {job?.departed == 2 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    Deaprted on
                    </td>
                    ):(null)}
                    <td className="py-2 px-4 border-b">
                    {job?.ETD?.toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td className="py-2 px-4 border-b font-semibold">Deaprture Date</td>
                    <td className="py-2 px-4 border-b">Unkown</td>
                  </tr>
                )}
                {job?.ETA? (
                  <tr>
                    {job?.arrived == 0 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    Arrival Date
                    </td>
                    ):(null)}
                    {job?.arrived == 1 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    To arrive on
                    </td>
                    ):(null)}
                    {job?.arrived == 2 ?(
                    <td className="py-2 px-4 border-b font-semibold">
                    Arrived on
                    </td>
                    ):(null)}
                    <td className="py-2 px-4 border-b">
                    {job?.ETD?.toLocaleDateString('en-GB')}
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
        ) : (
          <h1 className="text-red-500 text-xl">
            No job found. Please check again.
          </h1>
        )}
      </main>
    </div>
  );
}

export default IdPage;