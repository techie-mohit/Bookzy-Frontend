import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";



const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bookzy",
  description: "this is ecommerce platform where you can sell  or buy used books online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={robotoMono.className}
      >
        {children}
      </body>
    </html>
  );
}
