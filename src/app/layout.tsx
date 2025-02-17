import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Auth from "@/compon/auth/Auth";
import NavBar from "@/compon/NavBar/NavBar";
import { isAuthenticated } from "@/utils/amplify-utils";
// import { Amplify } from 'aws-amplify';
// import outputs from '../../amplify_outputs.json';

// Amplify.configure(outputs);

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bike Akinator",
  description: "Bike Information Storing App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar isSignedIn={await isAuthenticated()}></NavBar>
        <Auth>
          {children}
        </Auth>
      </body>
    </html>
  );
}
