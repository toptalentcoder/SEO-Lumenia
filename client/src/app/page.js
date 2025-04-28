"use client"

import Image from 'next/image';
import Link from "next/link";
import { US, FR, ES } from 'country-flag-icons/react/3x2';
import { useState, useEffect } from 'react';
import { Manrope } from 'next/font/google';
import LogoCarousel from '../components/LogoCarousel';

const manrope = Manrope({ subsets: ['latin'] });

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">

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
                alt="Yourtext.Guru"
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
                className="px-10 py-2 text-[#5438DC] border border-[#5438DC] hover:border-[#001F3F] hover:bg-[#001F3F] hover:text-white transition-colors text-[15px]"
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

      {/* Hero Section */}
      <section className="relative bg-black pt-28">
        {/* Blue Overlay */}
        <div className="absolute inset-0 bg-[#073C63] opacity-80"></div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 pt-24 pb-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            {/* Left Column */}
            <div className="w-full md:w-[35%] z-10">
              <h1 className="text-5xl font-bold text-white mb-8 font-['Manrope'],sans-serif">
                The SEO tool built by experts—accessible to everyone
              </h1>
              <p className="text-[20.8px] leading-relaxed text-white mb-8 font-['Manrope'],sans-serif">
                You create great content, but <strong>Google</strong>, <strong>Bing</strong>, and{' '}
                <strong>SearchGPT</strong> barely notice? Your traffic just won&apos;t take off? Stop wasting time guessing what search engines want.
                <br /><br />
                <strong>Switch to yourtext.guru</strong>
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/auth/signup" 
                  className="px-12 py-3 bg-white hover:bg-[#001F3F] text-[#4517BC] hover:text-white transition-colors font-medium cursor-pointer font-['Manrope'],sans-serif"
                >
                  Try it now!
                </Link>
                <Link 
                  href="mailto:demo@yourtext.guru?subject=Request%20a%20demo&body=Instructions%20for%20your%20demo%20request%0D%0A%0D%0ATo%20help%20us%20tailor%20the%20demo%20to%20your%20needs%2C%20please%20include%20the%20following%20information%3A%0D%0A%0D%0A1%EF%B8%8F%E2%83%A3%20Your%20company%20and%20industry%0D%0A%0D%0A2%EF%B8%8F%E2%83%A3%20Your%20main%20goal%3A%20What%20problem%20are%20you%20trying%20to%20solve%20with%20our%20solution%3F%0D%0A%0D%0A3%EF%B8%8F%E2%83%A3%20Approximate%20number%20of%20users%20involved%0D%0A%0D%0A4%EF%B8%8F%E2%83%A3%20Any%20specific%20features%20you%27d%20like%20us%20to%20focus%20on%0D%0A%0D%0A5%EF%B8%8F%E2%83%A3%20Your%20availability%20for%20the%20demo%20%28please%20propose%20multiple%20time%20slots%29%0D%0A%0D%0AWith%20these%20details%2C%20we%20can%20prepare%20a%20targeted%20demo%20and%20respond%20precisely%20to%20your%20expectations.%0D%0A%0D%0AThank%20you%21"
                  className="px-12 py-3 bg-[#001F3F] text-white font-medium font-['Manrope'],sans-serif"
                >
                  Request a demo
                </Link>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-[35%] mt-12 md:mt-0 z-10">
              <Image
                src="/images/welcome/hero-img.png"
                alt="yourtext.guru: SEO tool"
                width={600}
                height={400}
                className="transform -mb-12 animate-float"
              />
            </div>
          </div>
        </div>

        {/* SVG Background */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[200px] bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/welcome/landing-hero.svg)' }}
        ></div>
      </section>

      {/* Client Logo Carousel Section */}
      <section className="md:mx-20">
        <div className="container mx-auto">
          <div className="text-center">
            <LogoCarousel />
          </div>
        </div>
      </section>

      {/* Add animation keyframes for floating effect */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for SEO Success</h2>
            <p className="text-xl text-gray-600">Everything you need to optimize your website and content</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#5438DC] rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Keyword Tracking</h3>
              <p className="text-gray-600">Monitor your rankings for thousands of keywords in real-time</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#5438DC] rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Competitor Analysis</h3>
              <p className="text-gray-600">Track your competitors and uncover their SEO strategies</p>
            </div>
            <div className="p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#5438DC] rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Content Optimization</h3>
              <p className="text-gray-600">AI-powered suggestions to improve your content&apos;s performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">What our clients say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-bold">Client Name</h4>
                    <p className="text-gray-600 text-sm">Position, Company</p>
                  </div>
                </div>
                <p className="text-gray-600">&ldquo;The insights and recommendations provided by YourText.Guru have been invaluable for our SEO strategy.&rdquo;</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#5438DC] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to improve your SEO?</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">Join thousands of satisfied users who have transformed their SEO strategy with YourText.Guru</p>
          <button className="px-8 py-3 bg-white text-[#5438DC] rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold">
            Start your free trial
          </button>
        </div>
      </section>
    </div>
  );
}
