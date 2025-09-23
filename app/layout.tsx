import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AppProvider } from '../context/AppContext'

const roboto = Roboto({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Equipment Webapp",
  description: "Bariatric Equipment Choice Webapp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        
        <AppProvider>
          {children}
        </AppProvider>
          
      </body>
    </html>
  );
}
