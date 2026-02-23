// app/layout.tsx
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LayoutWrapper from "./LayoutWrapper";


const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bookzy",
  description: "This is an ecommerce platform where you can sell or buy used books online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={robotoMono.className}>
        <LayoutWrapper>
      
          <main>{children}</main>

        </LayoutWrapper>
      </body>
    </html>
  );
}
