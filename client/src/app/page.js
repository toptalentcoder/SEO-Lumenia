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
import { FaRegLightbulb } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BiSolidQuoteAltRight } from "react-icons/bi";
import { FaSearch, FaGoogle, FaClone, FaFile, FaEdit, FaChartBar, FaLink, FaStopCircle, FaBrain, FaImage, FaRobot, FaSitemap, FaUsers } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";

const manrope = Manrope({ subsets: ['latin'] });

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [activeTab, setActiveTab] = useState(1);

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

      {/* Why YourText.Guru Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-[37.328px] font-bold mb-6 text-gray-900">Why YourText.Guru is the SEO tool you&apos;ve been looking for</h2>
            <div className="relative w-full h-[1px] mb-16">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[60px] h-[3px] bg-[#4517AD]"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Column 1 */}
            <div className="space-y-20">
              {/* Feature 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-[50px] h-[50px] border-4 border-[#B6E4D5] rounded-full flex items-center justify-center">
                    <div className="w-[40px] h-[40px] bg-[#4517AD] border-2 border-white rounded-full flex items-center justify-center text-white">
                      <LuNotebookPen className="text-xl" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[21.328px] font-bold mb-2 text-gray-900">An <strong>intuitive and high-performance</strong> SEO assistant</h4>
                  <p className="text-[16px] text-gray-600">You write, YourText.Guru helps optimize—with <strong>clear and actionable recommendations</strong>. No more guesswork, just real results.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-[50px] h-[50px] border-4 border-[#B6E4D5] rounded-full flex items-center justify-center">
                    <div className="w-[40px] h-[40px] bg-[#4517AD] border-2 border-white rounded-full flex items-center justify-center text-white">
                      <FaRegLightbulb className="text-xl" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[21.328px] font-bold mb-2 text-gray-900"><strong>A data-driven approach to SEO</strong></h4>
                  <p className="text-[16px] text-gray-600">No more gut feeling. YourText.Guru relies on <strong>real-world data</strong> to help you <strong>create better-performing content</strong>.</p>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-20">
              {/* Feature 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-[50px] h-[50px] border-4 border-[#B6E4D5] rounded-full flex items-center justify-center">
                    <div className="w-[40px] h-[40px] bg-[#4517AD] border-2 border-white rounded-full flex items-center justify-center text-white">
                      <RxRocket className="text-xl" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[21.328px] font-bold mb-2 text-gray-900"><strong>Built for pros, easy for everyone</strong></h4>
                  <p className="text-[16px] text-gray-600">Whether you&apos;re an <strong>agency, freelancer, e-commerce seller, or blogger</strong>, you&apos;ll get <strong>tailored recommendations</strong>—no SEO expertise required.</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-[50px] h-[50px] border-4 border-[#B6E4D5] rounded-full flex items-center justify-center">
                    <div className="w-[40px] h-[40px] bg-[#4517AD] border-2 border-white rounded-full flex items-center justify-center text-white">
                      <FaChartLine className="text-xl" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[21.328px] font-bold mb-2 text-gray-900"><strong>Stop letting competitors set the pace</strong></h4>
                  <p className="text-[16px] text-gray-600">Your content deserves the top spot. Discover <strong>what they&apos;re doing</strong>, exploit their weaknesses, and <strong>overtake them with a winning strategy</strong>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section 
        id="plans" 
        className="py-24 bg-[#F1FAFB] relative parallax"
        style={{ 
          backgroundImage: 'url(/images/welcome/section-bg2.png)',
          backgroundSize: 'auto',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-[37.328px] font-bold mb-4 text-gray-900">Plans tailored to your SEO strategy</h2>
            <p className="text-xl text-gray-600 mb-6">Whether you&apos;re a freelancer, agency, or company, choose the plan that fits you best.</p>
            <div className="relative w-full h-[1px] mb-16">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[60px] h-[3px] bg-[#4517AD]"></div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
            {/* Lite Plan */}
            <div className="bg-[#B6E4D5] shadow-lg p-8 relative">
              <div className="text-center mb-6">
                <Image
                  src="/images/welcome/prices/ptable-icon1.png"
                  alt="Lite Plan"
                  width={120}
                  height={120}
                  className="mx-auto"
                />
                <h3 className="text-[32px] font-bold text-gray-900 mt-4">Lite</h3>
                <div className="mt-4">
                  <span className="text-[60px] font-bold text-[#475668]">107$US</span>
                  <span className="text-gray-600 block">per month, excl. tax</span>
                </div>
              </div>
              <Link 
                href="/subscription/list#tab-plans"
                className="block w-2/3 mx-auto py-3 text-center bg-[#001F3F] text-white hover:bg-[#001F3F] transition-colors mb-8"
              >
                Subscribe now
              </Link>
              <ul className="space-y-4 text-lg text-gray-600 text-center">
                <li className="flex items-center justify-center"><span className="font-semibold">2 members</span></li>
                <li>Monthly allowance:</li>
                <li className="font-semibold">50 SEO guides</li>
                <li className="font-semibold">25,000 AI tokens</li>
              </ul>
            </div>

            {/* Lite+ Plan */}
            <div className="bg-[#008000] shadow-lg p-8 relative transform scale-105 z-10">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-[#28a745] px-6 py-1 rounded-full font-semibold">
                Most popular
              </div>
              <div className="text-center mb-6">
                <Image
                  src="/images/welcome/prices/ptable-icon2.png"
                  alt="Lite+ Plan"
                  width={120}
                  height={120}
                  className="mx-auto"
                />
                <h3 className="text-[32px] font-bold text-white mt-4">Lite+</h3>
                <div className="mt-4">
                  <span className="text-[60px] font-bold text-white">140$US</span>
                  <span className="text-white block">per month, excl. tax</span>
                </div>
              </div>
              <Link 
                href="/subscription/list#tab-plans"
                className="block w-2/3 mx-auto py-3 text-center bg-[#001F3F] text-white transition-colors mb-8"
              >
                Subscribe now
              </Link>
              <ul className="space-y-4 text-lg text-white text-center">
                <li className="flex items-center justify-center"><span className="font-semibold">2 members</span></li>
                <li>Monthly allowance:</li>
                <li className="font-semibold">100 SEO guides</li>
                <li className="font-semibold">50,000 AI tokens</li>
              </ul>
            </div>

            {/* Essential Plan */}
            <div className="bg-[#B6E4D5] shadow-lg p-8 relative">
              <div className="text-center mb-6">
                <Image
                  src="/images/welcome/prices/ptable-icon3.png"
                  alt="Essential Plan"
                  width={120}
                  height={120}
                  className="mx-auto"
                />
                <h3 className="text-[32px] font-bold text-gray-900 mt-4">Essential Plan</h3>
                <div className="mt-4">
                  <span className="text-[60px] font-bold text-[#4517AD]">247$US</span>
                  <span className="text-gray-600 block">per month, excl. tax</span>
                </div>
              </div>
              <Link 
                href="/subscription/list#tab-plans"
                className="block w-2/3 mx-auto py-3 text-center bg-[#001F3F] text-white hover:bg-[#001F3F] transition-colors mb-8"
              >
                Subscribe now
              </Link>
              <ul className="space-y-4 text-lg text-gray-600 text-center">
                <li className="flex items-center justify-center"><span className="font-semibold">5 members + 2 guests</span></li>
                <li>Monthly allowance:</li>
                <li className="font-semibold">375 SEO guides</li>
                <li className="font-semibold">187,500 AI tokens</li>
              </ul>
            </div>
          </div>

          {/* See All Plans Button */}
          <div className="text-center mt-16">
            <Link 
              href="/en/pricing"
              className="inline-flex items-center px-12 py-3 text-gray-900 border-2 border-gray-900 hover:bg-[#001F3F] hover:text-white transition-colors text-lg"
            >
              📜 See all our subscription plans & bundles in detail 🔍
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-[#4517AD]">
        <div className="">
          <h3 className="text-center mb-12 text-[32px] font-bold text-white">What our users are saying</h3>

          <Slider
            className="testimonial-slider"
            dots={false}
            infinite={true}
            speed={500}
            slidesToShow={3}
            slidesToScroll={1}
            autoplay = {true}
            autoplaySpeed = {3000}
            cssEase= {'linear'}
            pauseOnHover = {true}
            arrows= {false}
            centerMode={true}
            centerPadding="90px"
            responsive={[
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 2,
                  centerPadding: "60px"
                }
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                  centerPadding: "40px"
                }
              }
            ]}
          >
            {/* Testimonial 1 */}
            <div className="px-4">
              <div className="bg-white rounded-xl px-8 py-16 relative">
                <div className="mb-6">
                  <p className="text-[21px] text-gray-700 leading-relaxed">Thanks to YourTextGuru, my clients write faster and more efficiently, without having to worry about the technical SEO side.</p>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 relative mr-4 rounded-full overflow-hidden">
                    <Image
                      src="/images/welcome/people/sbertrand.jpg"
                      alt="Sandrine Bertrand"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h6 className="text-[21px] font-bold text-[#4517AD]">Sandrine Bertrand</h6>
                    <span className="text-[16px] text-gray-600">SEO Consultant</span>
                  </div>
                </div>
                <div className="text-[100px] text-[#4517AD] absolute -bottom-7 right-7">
                  <BiSolidQuoteAltRight />
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="px-4">
              <div className="bg-white rounded-xl px-8 py-16 relative">
                <div className="mb-6">
                  <p className="text-[21px] text-gray-700 leading-relaxed">YourTextGuru is a key tool in my content strategy. It helps us stay one step ahead of our competitors!</p>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 relative mr-4 rounded-full overflow-hidden">
                    <Image
                      src="/images/welcome/people/plaroche.jpg"
                      alt="Patrice Laroche"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h6 className="text-[21px] font-bold text-[#4517AD]">Patrice Laroche</h6>
                    <span className="text-[16px] text-gray-600">SEO Project Manager</span>
                  </div>
                </div>
                <div className="text-[100px] text-[#4517AD] absolute -bottom-7 right-7">
                  <BiSolidQuoteAltRight />
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="px-4">
              <div className="bg-white rounded-xl px-8 py-16 relative">
                <div className="mb-6">
                  <p className="text-[21px] text-gray-700 leading-relaxed">Visible ranking gains within weeks, and incredibly easy to use. A must-have for SEO.</p>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 relative mr-4 rounded-full overflow-hidden">
                    <Image
                      src="/images/welcome/people/osaniez.jpg"
                      alt="Olivier Saniez"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h6 className="text-[21px] font-bold text-[#4517AD]">Olivier Saniez</h6>
                    <span className="text-[16px] text-gray-600">SEO Specialist</span>
                  </div>
                </div>
                <div className="text-[100px] text-[#4517AD] absolute -bottom-7 right-7">
                  <BiSolidQuoteAltRight />
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="px-4">
              <div className="bg-white rounded-xl px-8 py-16 relative">
                <div className="mb-6">
                  <p className="text-[21px] text-gray-700 leading-relaxed">I can&apos;t work without YourTextGuru anymore. It boosts my clients&apos; visibility and supports me every single day.</p>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 relative mr-4 rounded-full overflow-hidden">
                    <Image
                      src="/images/welcome/people/pcaillaud.jpg"
                      alt="Philippe Caillaud"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h6 className="text-[21px] font-bold text-[#4517AD]">Philippe Caillaud</h6>
                    <span className="text-[16px] text-gray-600">SEO Specialist</span>
                  </div>
                </div>
                <div className="text-[100px] text-[#4517AD] absolute -bottom-7 right-7">
                  <BiSolidQuoteAltRight />
                </div>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="px-4">
              <div className="bg-white rounded-xl px-8 py-16 relative">
                <div className="mb-6">
                  <p className="text-[21px] text-gray-700 leading-relaxed">An essential tool for writing complete guides and optimizing SEO content. Every web marketer should give it a try!</p>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 relative mr-4 rounded-full overflow-hidden">
                    <Image
                      src="/images/welcome/people/sdecampou.jpg"
                      alt="Sylvain de Campou"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h6 className="text-[21px] font-bold text-[#4517AD]">Sylvain de Campou</h6>
                    <span className="text-[16px] text-gray-600">Web Marketing Consultant</span>
                  </div>
                </div>
                <div className="text-[100px] text-[#4517AD] absolute -bottom-7 right-7">
                  <BiSolidQuoteAltRight />
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section>

      {/* Lumenia Section */}
      <section id="features" className="pt-16 pb-20 bg-white">
        <div className="container mx-auto px-4 w-2/3">
          <h2 className="text-[37.328px] font-bold text-center text-gray-900">Lumenia: The SEO tool built by experts, designed for your productivity</h2>
          <p className="text-center mt-4 text-gray-600">Lumenia combines expert-level SEO precision with the simplicity of an all-in-one tool.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

            {/* Feature Item */}
            <FeatureBox
              icon="search"
              title="Which keywords should I target to boost my traffic?"
              beforeLink="The"
              link="/en/keyword-explorer"
              linkText="Keyword Explorer"
              description="highlights the best opportunities based on traffic potential, SEO difficulty, and business value."
            />

            <FeatureBox
              icon="google"
              title="How to analyze a website's Google rankings?"
              beforeLink="Use our"
              link="/en/google-rankings"
              linkText="ranking explorer"
              description="identify strengths and weaknesses and refine your SEO strategy."
            />

            <FeatureBox
              icon="clone"
              title="How to detect keyword overlaps?"
              beforeLink="Lumenia identifies SEO"
              link="/en/seo-cannibalization"
              linkText="SEO cannibalization"
              description="help you avoid wasting efforts."
            />

            <FeatureBox
              icon="file"
              title="How to write content that ranks?"
              beforeLink="Lumenia"
              link="/en/semantic-optimization"
              linkText="guides you"
              description="with a precise SEO brief, SEO score, and essential keywords to include to optimize your content."
            />

            <FeatureBox
              icon="edit"
              title="How to write efficiently without wasting time?"
              beforeLink="Chill Mode subtly guides"
              link="/en/semantic-optimization"
              linkText="your SEO writing"
              description="while PRO Mode gives you full control."
            />

            <FeatureBox
              icon="chart-bar"
              title="How to capitalize on SEO opportunities your competitors already seized?"
              beforeLink="The"
              link="/en/content-gap-analysis"
              linkText="Content Gap"
              description="highlights keywords and topics your competitors rank for—but you don't (yet)."
            />

            <FeatureBox
              icon="link"
              title="How to evaluate backlink strength?"
              beforeLink="Our algorithm analyzes the"
              link="/en/backlink-value"
              linkText="the value of a link"
              description="-existing or hypothetical-s0 you can focus on backlinks that truly move the needle."
            />

            <FeatureBox
              icon="stop-circle"
              title="What about broken links hurting my SEO?"
              beforeLink="The"
              link="/en/broken-links"
              linkText="404 recovery tool"
              description="finds dead pages that still receive backlinks."
            />

            <FeatureBox
              icon="brain"
              title="Need fresh content ideas?"
              beforeLink="The"
              link="/en/inspiration"
              linkText="Digital Brainstormer"
              description="generates relevant topics tailored to personas-perfect for building your editorial strategy."
            />

            <FeatureBox
              icon="image"
              title="How to enrich content with unique visuals?"
              beforeLink="Access a"
              link="/en/ai-images"
              linkText="curated library of AI-generated images"
              description="illustrate your content creatively and stand out."
            />

            <FeatureBox
              icon="chart-bar"
              title="How to track my Google rankings over time?"
              beforeLink="Track your keywords with our"
              link="/en/keyword-monitoring"
              linkText="monitoring tool"
              description="Spot drops and gains to fine-tune your strategy."
            />

            <FeatureBox
              icon="people-carry"
              title="How to work collaboratively on SEO?"
              beforeLink="Manage your SEO projects as a"
              link="/en/team"
              linkText="team"
              description="with lumenia. Invite collaborators, assign roles, and streamline teamwork."
            />

            <FeatureBox
              icon="robot"
              title="How to use AI to supercharge my content?"
              beforeLink="Our"
              link="/en/llm-generation"
              linkText="generative AI"
              description="helps you create and optimize SEO content for better rankings."
            />

            <FeatureBox
              icon="sitemap"
              title="How to structure my site for SEO performance?"
              beforeLink="Apply the"
              link="/en/topical-mesh"
              linkText="topical mesh method"
              description="to boost your pages' relevance and visibility."
            />

            <FeatureBox
              icon="link"
              title="How to optimize internal linking?"
              beforeLink="Boost your SEO with"
              link="/en/internal-linking"
              linkText="smart internal links"
              description=". Lumeniaanalyzes your pages and recommends the best connections."
            />
          </div>

          <div className="text-center mt-12">
            <a href="/auth/signup" className="btn btn-primary inline-block px-12 py-3 bg-[#001F3F] text-white transition">Try lumenia now!</a>
          </div>
        </div>
      </section>

      {/* SEO Strategy Section */}
      <section 
        className="py-24 bg-[#F1FAFB] relative parallax"
        style={{ 
          backgroundImage: 'url(/images/welcome/seo/section-bg1.png)',
          backgroundSize: 'auto',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[37.328px] font-bold mb-4 text-gray-900">Build an Effective SEO Strategy</h2>
            <p className="text-xl text-gray-600">4 steps to use Lumenia and boost your rankings</p>
            <div className="w-24 h-1 bg-[#28a745] mx-auto mt-4"></div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Image Column */}
            <div className="w-full md:w-1/2">
              <div className="tab-content">
                {activeTab === 1 && (
                  <Image
                    src="/images/welcome/seo/work-1.png"
                    alt="SEO Strategy Step 1"
                    width={600}
                    height={400}
                    className="w-full"
                  />
                )}
                {activeTab === 2 && (
                  <Image
                    src="/images/welcome/seo/work-2.png"
                    alt="SEO Strategy Step 2"
                    width={600}
                    height={400}
                    className="w-full"
                  />
                )}
                {activeTab === 3 && (
                  <Image
                    src="/images/welcome/seo/work-3.png"
                    alt="SEO Strategy Step 3"
                    width={600}
                    height={400}
                    className="w-full"
                  />
                )}
                {activeTab === 4 && (
                  <Image
                    src="/images/welcome/seo/work-4.png"
                    alt="SEO Strategy Step 4"
                    width={600}
                    height={400}
                    className="w-full"
                  />
                )}
              </div>
            </div>

            {/* Steps Column */}
            <div className="w-full md:w-1/2">
              <div className="space-y-6">
                {/* Step 1 */}
                <div 
                  className={`p-6 cursor-pointer transition-all ${activeTab === 1 ? 'border-2 border-[#001F3F] bg-white text-gray-900' : 'text-gray-400'}`}
                  onClick={() => setActiveTab(1)}
                >
                  <h4 className="text-[21.328px] font-semibold mb-4">1️⃣ Pick the Right Keywords</h4>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Use the <strong>Keyword Explorer</strong> to spot high-impact strategic keywords.</li>
                    <li>Uncover SEO opportunities and avoid keyword cannibalization with deep analysis.</li>
                  </ul>
                </div>

                {/* Step 2 */}
                <div 
                  className={`p-6 cursor-pointer transition-all ${activeTab === 2 ? 'border-2 border-[#001F3F] bg-white text-gray-900' : 'text-gray-400'}`}
                  onClick={() => setActiveTab(2)}
                >
                  <h4 className="text-[21.328px] font-semibold mb-4">2️⃣ Analyze the Competition</h4>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Content Gap Analysis</strong> shows you where your competitors rank and you don&apos;t.</li>
                    <li>Discover the keywords and strategies giving them the edge.</li>
                  </ul>
                </div>

                {/* Step 3 */}
                <div 
                                    className={`p-6 cursor-pointer transition-all ${activeTab === 3 ? 'border-2 border-[#001F3F] bg-white text-gray-900' : 'text-gray-400'}`}
                  onClick={() => setActiveTab(3)}
                >
                  <h4 className="text-[21.328px] font-semibold mb-4">3️⃣ Write SEO-Optimized Content</h4>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Use <strong>Chill Mode</strong> for stress-free, guided optimization.</li>
                    <li>Switch to <strong>PRO Mode</strong> for full control and advanced tweaking.</li>
                  </ul>
                </div>

                {/* Step 4 */}
                <div 
                  className={`p-6 cursor-pointer transition-all ${activeTab === 4 ? 'border-2 border-[#001F3F] bg-white text-gray-900' : 'text-gray-400'}`}
                  onClick={() => setActiveTab(4)}
                >
                  <h4 className="text-[21.328px] font-semibold mb-4">4️⃣ Track and Adjust Your Strategy</h4>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Analyze your <strong>rankings</strong>, <strong>backlinks</strong>, and the impact of your optimizations.</li>
                    <li>Manage your SEO <strong>project by project</strong> with detailed dashboards.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}


function FeatureBox({ icon, title, link, linkText, description, beforeLink }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "search":
        return <FaSearch className="text-4xl text-gray-500" />;
      case "google":
        return <FaGoogle className="text-4xl text-gray-500" />;
      case "clone":
        return <FaClone className="text-4xl text-gray-500" />;
      case "file":
        return <FaFile className="text-4xl text-gray-500" />;
      case "edit":
        return <FaEdit className="text-4xl text-gray-500" />;
      case "chart-bar":
        return <FaChartBar className="text-4xl text-gray-500" />;
      case "link":
        return <FaLink className="text-4xl text-gray-500" />;
      case "stop-circle":
        return <FaStopCircle className="text-4xl text-gray-500" />;
      case "brain":
        return <FaBrain className="text-4xl text-gray-500" />;
      case "image":
        return <FaImage className="text-4xl text-gray-500" />;
      case "robot":
        return <FaRobot className="text-4xl text-gray-500" />;
      case "sitemap":
        return <FaSitemap className="text-4xl text-gray-500" />;
      case "people-carry":
        return <FaUsers className="text-4xl text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-4xl">
        {getIcon(icon)}
      </div>
      <h4 className="text-[21.328px] font-semibold text-gray-900">{title}</h4>
      <p className="text-gray-600 text-[16px]">
        {beforeLink}{' '}
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline font-bold inline-flex items-center">
          {linkText}
          {' '}
          <FaExternalLinkAlt className="text-gray-600 ml-2 text-[16px]" />
        </a>{'  '}
        {description}
      </p>
    </div>
  );
}