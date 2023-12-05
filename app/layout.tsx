
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image';
import './globals.css'

import Link from 'next/link'

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
      <body className={inter.className}>
          <nav className="flex bg-blue-500 p-4">
              <ul className="flex space-x-10">
              <link rel="icon" href="/home.png"/>
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
            <div className="m-5 md:w-1/2">{children}</div>
        </body>
    </html>
  );
};

export default RootLayout;