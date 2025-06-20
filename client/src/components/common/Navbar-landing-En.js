"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { US, FR, ES } from 'country-flag-icons/react/3x2';

export default function NavbarLandingEn() {

    const [scrolled, setScrolled] = useState(false);
    const [parallaxOffset, setParallaxOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
          const isScrolled = window.scrollY > 20;
          setScrolled(isScrolled);
          
          // Update parallax effect
          const parallaxElements = document.querySelectorAll('.parallax');
          parallaxElements.forEach((element) => {
            const offset = window.pageYOffset;
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            if (offset > elementTop - viewportHeight && offset < elementTop + elementHeight) {
              const parallaxValue = ((offset - (elementTop - viewportHeight)) * 0.4);
              element.style.backgroundPositionY = `${parallaxValue}px`;
            }
          });
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return(
        <div>
            {/* Navbar */}
            <nav className={`fixed w-full bg-white border-b z-50 transition-all duration-300 ${
                scrolled ? 'py-3' : 'py-[38px]'
            }`}>
                <div className="container mx-auto px-56">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/images/favicon2.svg"
                            alt="Hero Image"
                            width={32} // Bigger size for a premium look
                            height={32}
                            className="h-10 w-auto text-blue-600"
                        />
                        <div>
                            <span className="text-2xl font-semibold text-[#41368D] ml-6">Lumenia</span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-8">
                    <Link href="/features" className="text-lg text-gray-900 hover:text-[#5438DC]">
                        Features
                    </Link>
                    <Link href="/pricing" className="text-lg text-gray-900 hover:text-[#5438DC]">
                        Pricing
                    </Link>
                    <Link href="/auth/signin" className="text-lg text-gray-900 hover:text-[#5438DC]">
                        Login
                    </Link>
                    
                    {/* Trial Button */}
                    <Link 
                        href="/auth/signup" 
                        className="px-10 py-2 text-[#5438DC] border-2 border-[#5438DC] hover:border-[#001F3F] hover:bg-[#001F3F] hover:text-white transition-colors text-[15px]"
                    >
                        Start your free trial!
                    </Link>

                    </div>
                </div>
                </div>
            </nav>
        </div>
    )
}