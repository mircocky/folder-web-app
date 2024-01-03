const ContactPage: React.FC = () => {

interface ContactDetails {
  name: string;
  address: string;
  landline: string;
  email : string;
  fax : string;

}

const contactDetails : ContactDetails = {
  name: "PNL GLOBAL LOGISTICS PTY LTD",
  address: `87 Egerton Street, 
Silverwater NSW 2128`,
  landline: "61-2-9700-1188",
  fax: "61-2-9700-0001",
  email: "info@pnlglobal.com.au",
}


return (
  <div className="border p-4 my-4 bg-white shadow-md rounded-md custom-text-kind">
  <ul>
    <li className="flex flex-col space-y-3">
      <span className="font-bold text-xl">{contactDetails.name}</span>
      <pre className="text-gray-600 font-bold">{contactDetails.address}</pre>
      <span className="text-gray-600">PHONE: {contactDetails.landline}</span>
      <span className="text-gray-600">FAX: {contactDetails.fax}</span>
      <span>
        Email: 
        <a href={`mailto:${contactDetails.email}`} className="text-blue-600 underline">
          {contactDetails.email}
        </a>
      </span>
    </li>
  </ul>
</div>
  );
};

export default ContactPage;
