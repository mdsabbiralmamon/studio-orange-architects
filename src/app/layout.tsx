import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Import the new fonts
const josefinSans = localFont({
  src: "/fonts/JosefinSans.ttf",
  variable: "--font-josefin-sans",
  weight: "100 900",
});

const afacad = localFont({
  src: "/fonts/afacad.ttf",
  variable: "--font-afacad",
  weight: "100 900",
});

const montserrat = localFont({
  src: "/fonts/Montserrat.ttf",
  variable: "--font-montserrat",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Studio Orange",
  description: "An Architect and Interior Design Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${josefinSans.variable} ${afacad.variable} ${montserrat.variable} antialiased font-[family-name:var(--font-afacad)]`}
      >
        {children}
      </body>
    </html>
  );
}
