import type { Metadata } from "next";
import { Inter} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight:["400","500","600","700"]
});



export const metadata: Metadata = {
  title: "CineZest",
  description: "The Watchlist & Review App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col  ">
        <Navbar/>
          <main>{children}</main>
          </body>
    </html>
  );
}
