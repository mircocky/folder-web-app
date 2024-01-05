// BottomComponent.js
const Footer = () => {
    return (
      <div className="bg-blue-100 p-4 text-center mt-auto">
        <div className="flex flex-col sm:flex-row justify-center text-gray-800">
         <p>&copy; 2024. PNL GLOBAL LOGISTICS PTY LTD</p>
         <p>ALL RIGHTS RESERVED. </p>
        </div>
        <div className="flex justify-center"><img src="/logo_iata.png" alt="Facebook Logo" className="h-10 w-10 mt-2" /></div>
        
        {/* Social media links */}
        <div className="mt-2 flex items-center justify-center">
          
  
          {/* Facebook link */}
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
          <img src="/icons_facebook.png" alt="Facebook Logo" className="h-6 w-6 mr-2" />
          </a>
  
          {/* YouTube link */}
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
          <img src="/icons_youtube.png" alt="YouTube Logo" className="h-6 w-6 mx-2" />
          </a>

          {/* Email */}
           <a href="mailto:info@pnlglobal.com.au.com" target="_blank" rel="noopener noreferrer">
          <img src="/icons_email.png" alt="email" className="h-6 w-6 mx-2" />
          </a>

          {/* Phone */}
          <a href="tel:+62297001188/" target="_blank" rel="noopener noreferrer">
          <img src="/icons_phone.png" alt="phone" className="h-6 w-6 mx-2" />
          </a>

        </div>
  
        {/* Homepage link */}
        <div className="mt-5 flex justify-center items-center text-base">
          <a href="http://www.plfreight.com//" target="_blank" rel="noopener noreferrer" className="flex flex-row text-gray-700 hover:underline">
          <img src="/icons_website.png" alt="www logo" className="h-6 w-6 mx-2" /> Official Website
          </a>
        </div>
      </div>
    );
  };
  
  export default Footer;
  