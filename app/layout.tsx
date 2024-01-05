
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image';
import './globals.css'
import Link from 'next/link'
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PNL Tracking System',
  description: 'PNL Tracking System', 
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
         <p className="flex p-3"><Image src="/logo.png" alt="Home" width={80} height={35} /> <span className="p-2 text-blue-500 font-bold underline">PNL Tracking System</span></p>
          <nav className="flex bg-blue-500 p-4">
              <ul className="flex space-x-10">
                <li>
                  <Link href="/" passHref className="text-white hover:underline flex flex-col items-center"><Image src="/home-icon.png" alt="Home" width={30} height={30}/>Home</Link>
                </li>
                <li>
                  <Link href="/search" passHref className="text-white hover:underline flex flex-col items-center"><Image src="/search-icon.png" alt="Search"width={30} height={30}/>Search</Link>
                </li>
                <li>
                  <Link href="/contact" passHref className="text-white hover:underline flex flex-col items-center"><Image src="/contact-icon.png" alt="Contact" width={30} height={30}/>Contact</Link>
                </li>
              </ul>
            </nav>
            
            <div className="mx-2 px-1 xs:mx-2 xs:px-1 sm:mx-4 sm:px-2 md:mx-8 md:px-4">{children}</div>
            
            <div className="my-5"></div>
            <Footer />
        </body>
    </html>
  );
};

export default RootLayout;