
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import QRCodeHolder from '@/components/QrCodeHolder'
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"




export default async function PublicRootLayout({ children }) {
   const session = await getServerSession(authOptions);
  //  console.log(session)
  return (
    <html lang="en">
       

      <body
      >
        <Providers> 
          <Header session={session}/>
          {children}
          {
            session?.user?.id &&
            <QRCodeHolder memberId={session?.user?.id} />
          }
          <Footer/>
          </Providers>
      </body>
    </html>
  );
}
