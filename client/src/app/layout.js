"use client"

import { Nunito } from "next/font/google";
import "../styles/globals.css";
import Navbar from '../components/common/Navbar.js'
import { ThemeProvider } from '../context/ThemeContext.js'
import { UserProvider } from '../context/UserContext.js'
import { PlanProvider } from '../context/UserPlanContext.js'
import { usePathname } from "next/navigation";
import GATracker from "../components/common/GATracker.js";
import RouteChangeTracker from "../components/common/RouteChangeTracker.js";

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
        <GATracker /> {/* 👈 Inject GA */}
        <RouteChangeTracker />  {/* Tracks route changes */}
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
