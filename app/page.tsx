// Import necessary libraries/components
import Image from 'next/image';

const HomePage = () => {
  return (
    <div className="w-full flex flex-col items-center mt-24">
      <Image src="/logo.png" alt="Your Logo Alt Text" width={500} height={300} />
    </div>
  );
};

export default HomePage;