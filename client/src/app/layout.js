import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Navbar from '../components/common/Navbar.js'
import { ThemeProvider } from '../context/ThemeContext.js'
import { UserProvider } from '../context/UserContext.js'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "YourText",
  description: "Developed by Healer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <UserProvider>
            <Navbar/>
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
