import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import { AppProvider } from '../context/AppContext'

const robotoFlex = Roboto_Flex({
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
    <html lang="en" className={robotoFlex.className}>
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
