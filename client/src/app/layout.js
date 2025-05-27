"use client"

<<<<<<< HEAD
import { Geist, Geist_Mono } from "next/font/google";
=======
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
import { Nunito } from "next/font/google";
import "../styles/globals.css";
import Navbar from '../components/common/Navbar.js'
import { ThemeProvider } from '../context/ThemeContext.js'
import { UserProvider } from '../context/UserContext.js'
import { PlanProvider } from '../context/UserPlanContext.js'
import { usePathname } from "next/navigation";

<<<<<<< HEAD
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

=======
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"], // optional: choose the weights you need
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
        className={`${nunito.variable} antialiased`}
      >
        <ThemeProvider>
          <UserProvider>
            <PlanProvider>
              {/* Show Navbar only if the current path is NOT in the hiddenNavPaths list */}
              {!hiddenNavPaths.includes(pathname) && <Navbar />}
              {children}
            </PlanProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
