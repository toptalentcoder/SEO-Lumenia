"use client"

import Image from 'next/image';
import Link from "next/link";
import { US, FR, ES } from 'country-flag-icons/react/3x2';
import { useState, useEffect } from 'react';
import { Manrope } from 'next/font/google';
import LogoCarousel from '../components/LogoCarousel';
import { RxRocket } from "react-icons/rx";
import { TbUsers } from "react-icons/tb";
import { LuNotebookPen } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa6";
import { FaRegThumbsUp } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";



const manrope = Manrope({ subsets: ['latin'] });

export default function Home() {
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

  return (
    <div className="min-h-screen bg-white">

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

      {/* Expertise Section */}
      <section 
        className="relative bg-[#F1FAFB] pt-24 pb-20"
        style={{ backgroundImage: 'url(/images/welcome/landing2-hero.svg)', backgroundPosition: 'center bottom', backgroundRepeat: 'no-repeat' }}
        id="expertise"
      >
        <div className="container mx-auto px-4 w-2/3">
          <div className="text-black">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-16">🏆 Trusted SEO Expertise for Over 9 Years 🏆</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Box 1 */}
                <div className="p-6">
                  <div className='flex justify-center'>
                    <RxRocket className="text-5xl text-gray-900 mb-4" />
                  </div>
                  <h4 className="text-[21.328px] font-bold mb-3">A Benchmark Since 2016</h4>
                  <p className="text-gray-900 text-[19.2px]">YourText.Guru is trusted by thousands of SEO professionals, agencies, and content creators.</p>
                </div>

                {/* Box 2 */}
                <div className="p-6">
                  <div className="flex justify-center">
                    <TbUsers className="text-5xl text-gray-900 mb-4" />
                  </div>
                  <h4 className="text-[21.328px] font-bold mb-3">A Team of Experts</h4>
                  <p className="text-gray-900 text-[19.2px]">12 specialists, including 6 engineers and 4 PhDs in algorithms and artificial intelligence. Some have been doing SEO since 2000.</p>
                </div>

                {/* Box 3 */}
                <div className="p-6">
                  <div className="flex justify-center">
                    <LuNotebookPen className="text-5xl text-gray-900 mb-4" />
                  </div>
                  <h4 className="text-[21.328px] font-bold mb-3">Renowned Educators</h4>
                  <p className="text-gray-900 text-[19.2px]">At yourtext.guru, the Peyronnet Brothers have trained thousands of SEO pros since 2013.</p>
                </div>

                {/* Box 4 */}
                <div className="p-6">
                  <div className="flex justify-center">
                    <FaRegHeart className="text-5xl text-gray-900 mb-4" />
                  </div>
                  <h4 className="text-[21.328px] font-bold mb-3">Scientific Excellence</h4>
                  <p className="text-gray-900 text-[19.2px]">Over 18,250 person-days of research, more than 125 scientific publications, and patented innovations.</p>
                </div>

                {/* Box 5 */}
                <div className="p-6">
                  <div className="flex justify-center">
                    <FaRegThumbsUp className="text-5xl text-gray-900 mb-4" />
                  </div>
                  <h4 className="text-[21.328px] font-bold mb-3">Trusted by SEO Pros</h4>
                  <p className="text-gray-900 text-[19.2px]">SEO agencies and freelancers have relied on yourtext.guru from day one — a true sign of our reliability and impact.</p>
                </div>

                {/* Box 6 */}
                <div className="p-6">
                  <div className="flex justify-center">
                    <FaChartLine className="text-5xl text-gray-900 mb-4" />
                  </div>
                  <h4 className="text-[21.328px] font-bold mb-3">Ongoing R&D</h4>
                  <p className="text-gray-900 text-[19.2px]">We stay on top of the latest in SEO and AI—because staying ahead of the curve is not optional.</p>
                </div>
              </div>

              <div className="mt-10 -mb-32 relative z-10">
                <Image
                  src="/images/welcome/hero.png"
                  alt="SEO Expertise"
                  width={1600}
                  height={800}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="pt-24 pb-16 bg-[#F1FAFB] relative mt-24 parallax"
        style={{ 
          backgroundImage: 'url(/images/welcome/section-bg1.png)',
          backgroundSize: 'auto',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundPositionY: '0px'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 md:w-3/4 mx-auto gap-8">
            
            {/* Feature 1 */}
            <div className="group">
              <div className="bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.1)] p-8 text-center h-full">
                <div className="flex justify-center mb-6">
                  <RxRocket className="text-[3rem] text-[#28a745]" />
                </div>
                <div className="dtr-feature-content">
                  <h3 className="text-[38px] font-bold mb-4 text-gray-900">Your truly <strong>high-performing</strong> SEO copilot</h3>
                  <p className="text-2xl font-medium mb-4 text-gray-600">All the essential SEO tools—<strong>zero hassle</strong></p>
                  <p className="text-gray-600 text-[16px]">Tired of juggling <strong>10 different tools</strong>? YourText.Guru has your entire <strong>content strategy</strong> covered: <strong>keyword research</strong>, <strong>AI-assisted writing</strong>, <strong>competitor analysis</strong>. Less stress, <strong>more results</strong>.</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.1)] p-8 text-center">
                <div className="flex justify-center mb-6">
                  <LuNotebookPen className="text-[3rem] text-[#28a745]" />
                </div>
                <div className="dtr-feature-content">
                  <h3 className="text-[38px] font-bold mb-4 text-gray-900">Write <strong>flawless</strong> SEO content</h3>
                  <p className="text-2xl font-medium mb-4 text-gray-600"><strong>Chill Mode</strong> for speed, <strong>PRO Mode</strong> for precision</p>
                  <p className="text-gray-600">No more <strong>blank page syndrome</strong>. Whether you&apos;re a <strong>beginner</strong> or an <strong>SEO pro</strong>, our AI guides you with <strong>dynamic scoring</strong> for <strong>top-tier content</strong>. <strong>Write faster, rank higher.</strong></p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.1)] p-8 text-center h-full">
                <div className="flex justify-center mb-6">
                  <FaChartLine className="text-[3rem] text-[#28a745]" />
                </div>
                <div className="dtr-feature-content">
                  <h3 className="text-[38px] font-bold mb-4 text-gray-900">Spy on your competitors<br /><strong>(and outrank them)</strong></h3>
                  <p className="text-2xl font-medium mb-4 text-gray-600"><strong>Spot their weaknesses, seize the edge, dominate!</strong></p>
                  <p className="text-gray-600">They&apos;re ahead of you on Google? <strong>Not for long.</strong> Uncover <strong>their blind spots</strong>, identify <strong>SEO gaps</strong>, and craft <strong>content that crushes theirs</strong>. SEO is a game of <strong>strategy</strong>.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section 
        className="py-24 bg-[#F1FAFB] relative parallax"
        style={{ 
          backgroundImage: 'url(/images/welcome/section-bg1.png)',
          backgroundSize: 'auto',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center'
        }}
      >
        <div className="">
          <div className="text-center mb-12">
            <h2 className="text-[37.328px] font-bold mb-6 text-gray-900">All our founders are techies!</h2>
            <div className="w-24 h-1 bg-[#28a745] mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 w-full mx-auto">
            {/* Founder 1 */}
            <div className="relative group">
              <div className="bg-white shadow-lg text-center overflow-hidden">
                <div className="relative">
                  <Image
                    src="/images/welcome/founders/gpeyronnet.jpg"
                    alt="Portrait of Guillaume Peyronnet"
                    width={200}
                    height={200}
                    className="w-full"
                  />
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <a 
                      href="https://www.linkedin.com/in/gpeyronnet" 
                      target="_blank" 
                      className="w-10 h-10 bg-[#0077b5] hover:bg-[#073C63] rounded-full flex items-center justify-center text-white"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="text-white" />
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-[21.328px] font-bold mb-1 mt-9 text-gray-900">Guillaume<br />Peyronnet</h4>
                  <p className="text-[16px] text-gray-600 mb-9">SEO Data Pioneer<br />3 academic papers</p>
                </div>
              </div>
            </div>

            {/* Founder 2 */}
            <div className="relative group">
              <div className="bg-white shadow-lg text-center overflow-hidden">
                <div className="relative">
                  <Image
                    src="/images/welcome/founders/speyronnet.jpg"
                    alt="Portrait of Sylvain Peyronnet"
                    width={200}
                    height={200}
                    className="w-full"
                  />
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <a 
                      href="https://www.linkedin.com/in/sypsyp/" 
                      target="_blank" 
                      className="w-10 h-10 bg-[#0077b5] hover:bg-[#073C63] rounded-full flex items-center justify-center text-white"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="text-white" />
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-[21.328px] font-bold mb-1 mt-9 text-gray-900">Sylvain<br />Peyronnet</h4>
                  <p className="text-[16px] text-gray-600 mb-9">PhD<br />SEO Data Pioneer<br />Former Full Professor<br />50+ academic papers</p>
                </div>
              </div>
            </div>

            {/* Founder 3 */}
            <div className="relative group">
              <div className="bg-white shadow-lg text-center overflow-hidden">
                <div className="relative">
                  <Image
                    src="/images/welcome/founders/emarchand.jpg"
                    alt="Portrait of Emmanuel Marchand"
                    width={200}
                    height={200}
                    className="w-full"
                  />
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <a 
                      href="https://www.linkedin.com/in/emmanuel-marchand-045b857b/" 
                      target="_blank" 
                      className="w-10 h-10 bg-[#0077b5] hover:bg-[#073C63] rounded-full flex items-center justify-center text-white"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="text-white" />
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-[21.328px] font-bold mb-1 mt-9 text-gray-900">Emmanuel<br />Marchand</h4>
                  <p className="text-[16px] text-gray-600 mb-9">R&D Researcher<br />4 academic papers</p>
                </div>
              </div>
            </div>

            {/* Founder 4 */}
            <div className="relative group">
              <div className="bg-white shadow-lg text-center overflow-hidden">
                <div className="relative">
                  <Image
                    src="/images/welcome/founders/gpitel.jpg"
                    alt="Portrait of Guillaume Pitel"
                    width={200}
                    height={200}
                    className="w-full"
                  />
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <a 
                      href="https://www.linkedin.com/in/guillaumepitel/" 
                      target="_blank" 
                      className="w-10 h-10 bg-[#0077b5] hover:bg-[#073C63] rounded-full flex items-center justify-center text-white"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="text-white" />
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-[21.328px] font-bold mb-1 mt-9 text-gray-900">Guillaume<br />Pitel</h4>
                  <p className="text-[16px] text-gray-600 mb-9">PhD<br />48 academic papers<br />4 patents</p>
                </div>
              </div>
            </div>

            {/* Founder 5 */}
            <div className="relative group">
              <div className="bg-white shadow-lg text-center overflow-hidden">
                <div className="relative">
                  <Image
                    src="/images/welcome/founders/tlargillier.jpg"
                    alt="Portrait of Thomas Largillier"
                    width={200}
                    height={200}
                    className="w-full"
                  />
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <a 
                      href="https://www.linkedin.com/in/thomas-largillier-3a39961a4/" 
                      target="_blank" 
                      className="w-10 h-10 bg-[#0077b5] hover:bg-[#073C63] rounded-full flex items-center justify-center text-white"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="text-white" />
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-[21.328px] font-bold mb-1 mt-9 text-gray-900">Thomas<br />Largillier</h4>
                  <p className="text-[16px] text-gray-600 mb-9">PhD<br />R&D Researcher<br />Associate Professor<br />20 academic papers</p>
                </div>
              </div>
            </div>

            {/* Founder 6 */}
            <div className="relative group">
              <div className="bg-white shadow-lg text-center overflow-hidden">
                <div className="relative">
                  <Image
                    src="/images/welcome/founders/gfouquier.jpg"
                    alt="Portrait of Geoffroy Fouquier"
                    width={200}
                    height={200}
                    className="w-full"
                  />
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <a 
                      href="https://www.linkedin.com/in/geoffroy-fouquier-93291b4/" 
                      target="_blank" 
                      className="w-10 h-10 bg-[#0077b5] hover:bg-[#073C63] rounded-full flex items-center justify-center text-white"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin className="text-white" />
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-[21.328px] font-bold mb-1 mt-9 text-gray-900">Geoffroy<br />Fouquier</h4>
                  <p className="text-[16px] text-gray-600 mb-9">PhD<br />Research Engineer<br />20 academic papers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
