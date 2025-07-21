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
  title: "Coney Power",
  description: "Train hard, Live fully",
  openGraph: {
    title: "Coney Power",
    description: "Train hard, Live fully",
    url: 'https://coneypower.com',
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

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
