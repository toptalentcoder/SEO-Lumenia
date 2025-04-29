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
                        src="/images/logo.svg"
                        alt="Lumenia"
                        width={32}
                        height={32}
                        className="mr-2"
                    />
                    <div>
                        <span className="text-xl font-semibold text-[#41368D]">Lumenia</span>
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

                    {/* Language Selector */}
                    <div className="flex items-center space-x-2">
                        <div className="flex flex-col items-center text-[10px] text-gray-600 space-y-1 cursor-pointer">
                        <US className="w-5 h-3.5" title="US" />
                        <span>US</span>
                        </div>
                        <div className="flex flex-col items-center text-[10px] text-gray-600 space-y-1 cursor-pointer">
                        <FR className="w-5 h-3.5" title="FR" />
                        <span>FR</span>
                        </div>
                        <div className="flex flex-col items-center text-[10px] text-gray-600 space-y-1 cursor-pointer">
                        <ES className="w-5 h-3.5" title="ES" />
                        <span>ES</span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </nav>
        </div>
    )
}