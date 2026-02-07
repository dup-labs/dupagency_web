import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local'
import Footer from "@/sections/Footer";
import LenisProvider from '@/providers/LenisProvider'
import Header from "@/sections/Header";

const chillax = localFont({
  src: [
    {
      path: '../src/fonts/Chillax-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../src/fonts/Chillax-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../src/fonts/Chillax-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../src/fonts/Chillax-Medium.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../src/fonts/Chillax-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../src/fonts/Chillax-Extralight.woff2',
      weight: '100',
      style: 'normal',
    },
  ],
  variable: '--font-chillax',
  display: 'swap',
})


export const metadata: Metadata = {
  title: "dup.agency",
  description: "Especialistas em vtex focados em uma operação tranquila e escalável",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body
        className={`${chillax.variable} font-sans antialiased`}
        // style={{ fontFamily: 'var(--font-chillax)' }}
      >
        <LenisProvider>
          <Header />
          {children}
          <Footer/>
        </LenisProvider>
      </body>
    </html>
  );
}

