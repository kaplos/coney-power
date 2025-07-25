import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://coneypower.com'),
  title: "Coney Power",
  description: "Train hard, Live fully",
  openGraph: {
    title: "Coney Power",
    description: "Train hard, Live fully",
    url: 'https://www.coneypower.com',
    siteName: 'Coney Power',
    images: [
      {
        url: '/icon.jpeg', // Can be full URL or relative path from /public
        width: 1200,
        height: 630,
        alt: 'Preview Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  // icons: {
  //   icon: "/white-background-fist.png",
  //   // apple: "/apple-touch-icon.png",
  // },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
              <link rel="icon" type="image/png" sizes="32x32" href="/white-background-fist.png" />
              <title>Coney Power</title>
          <meta name="description" content="Train hard, Live fully"/>

          {/* <!-- Facebook Meta Tags --> */}
          <meta property="og:url" content="https://coneypower.com"/>
          <meta property="og:type" content="website"/>
          <meta property="og:title" content="Coney Power"/>
          <meta property="og:description" content="Train hard, Live fully"/>
          <meta property="og:image" content="http://localhost:3000/icon.jpeg"/>

          {/* <!-- Twitter Meta Tags --/> */}
          <meta name="twitter:card" content="summary_large_image"/>
          <meta property="twitter:domain" content="coneypower.com"/>
          <meta property="twitter:url" content="https://coneypower.com"/>
          <meta name="twitter:title" content="Coney Power"/>
          <meta name="twitter:description" content="Train hard, Live fully"/>
          <meta name="twitter:image" content="http://localhost:3000/icon.jpeg"/>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
