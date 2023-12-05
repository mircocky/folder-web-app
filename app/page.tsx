// Import necessary libraries/components
import Image from "next/image";

const HomePage: React.FC = () => {

return (
    <div className="w-full flex flex-col items-center mt-24">
      <Image src="/Logo.png" alt="Logo" width={500} height={300}/>
    </div>
  );
};
export default HomePage;
