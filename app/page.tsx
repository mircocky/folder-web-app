// Import necessary libraries/components
import Image from 'next/image';
import profilePic from '../public/logo.png'

const HomePage = () => {
  return (
    <div className="w-full flex flex-col items-center mt-24">
      <Image
      src={profilePic}
      alt="Picture of the author"
      width={300} 
      height={300} 
      blurDataURL="data:..."
      placeholder="blur" 
    />
    </div>
  );
};

export default HomePage;