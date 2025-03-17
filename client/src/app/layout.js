"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Navbar from '../components/common/Navbar.js'
import { ThemeProvider } from '../context/ThemeContext.js'
import { UserProvider } from '../context/UserContext.js'
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "YourText",
//   description: "Developed by Healer",
// };

export default function RootLayout({ children }) {

  const pathname = usePathname();

  // Define paths where the Navbar should NOT be shown
  const hiddenNavPaths = ["/", "/auth/signin", "/auth/signup"];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <UserProvider>
            {/* Show Navbar only if the current path is NOT in the hiddenNavPaths list */}
            {!hiddenNavPaths.includes(pathname) && <Navbar />}
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
