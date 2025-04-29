"use client"

import Image from 'next/image';
import Link from "next/link";
import { FaTwitter, FaFacebook, FaYoutube } from "react-icons/fa";

export default function FooterLandingEn() {
    return(
        <div>
            {/* Footer */}
            <footer 
                className="bg-[#001F3F] bg-cover bg-no-repeat bg-center py-24"
                style={{ backgroundImage: 'url(/images/welcome/footer-bg.png)' }}
            >
                <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
                    {/* Logo and Description */}
                    <div className="lg:col-span-4">
                        <div className="flex items-center mb-6">
                            <Link href="" className="block">
                                <Image
                                    src="/images/favicon.svg"
                                    alt="Hero Image"
                                    width={32} // Bigger size for a premium look
                                    height={32}
                                    className="h-10 w-auto text-blue-600"
                                />
                            </Link>
                            <div>
                                <span className="text-2xl font-semibold text-white ml-6">Lumenia</span>
                            </div>
                        </div>

                    <p className="text-white mb-4 text-[16px]">
                        Lumenia is a SaaS tool designed to optimize web writing and content strategy. It helps you structure, analyze, and improve your texts for better SEO—while keeping full control of your content.
                    </p>
                    <p className="text-white">© 2025 Lumenia</p>
                    </div>

                    {/* Lumenia Links */}
                    <div className="lg:col-span-2">
                    <h4 className="text-gray-300 text-[21.328px] font-bold mb-6">Lumenia</h4>
                    <ul className="space-y-3 text-[16px]">
                        <li><Link href="/en#features" className="text-white hover:text-white transition-colors">Features</Link></li>
                        <li><Link href="/en/pricing#plans" className="text-white hover:text-white transition-colors">Pricing</Link></li>
                        <li><Link href="/en/legals" className="text-white hover:text-white transition-colors">Legal Notices</Link></li>
                        <li><Link href="/en/legals" className="text-white hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
                        <li><Link href="/en/coupon-code" className="text-white hover:text-white transition-colors">Coupon Code</Link></li>
                    </ul>
                    </div>

                    {/* Support Links */}
                    <div className="lg:col-span-2">
                    <h4 className="text-gray-300 text-[21.328px] font-bold mb-6">Support</h4>
                    <ul className="space-y-3 text-[16px]">
                        <li><Link href="/en/support" className="text-white hover:text-white transition-colors">Technical</Link></li>
                        <li><Link href="/en/sales" className="text-white hover:text-white transition-colors">Sales</Link></li>
                        <li>
                        <a 
                            href="https://support.Lumenia/portal/en/home" 
                            className="text-white hover:text-white transition-colors"
                            target="_blank" 
                            rel="noreferrer noopener"
                        >
                            Knowledge Base
                        </a>
                        </li>
                        <li>
                        <a 
                            href="https://www.youtube.com/@YourTextGuru/playlists" 
                            className="text-white hover:text-white transition-colors"
                            target="_blank" 
                            rel="noreferrer noopener"
                        >
                            YTG Video Tutorials
                        </a>
                        </li>
                        <li>
                        <a 
                            href="https://central.Lumenia" 
                            className="text-white hover:text-white transition-colors"
                            target="_blank" 
                            rel="noreferrer noopener"
                        >
                            AI &amp; SEO
                        </a>
                        </li>
                    </ul>
                    </div>

                    {/* Partners Links */}
                    <div className="lg:col-span-4">
                    <h4 className="text-gray-300 text-[21.328px] font-bold mb-6">Partners</h4>
                    <ul className="space-y-3 mb-8 text-[16px]">
                        <li>
                        <a 
                            href="https://www.trikaya.fr" 
                            className="text-white hover:text-white transition-colors"
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Trikaya Communication
                        </a>
                        </li>
                        <li>
                        <a 
                            href="https://freres.peyronnet.eu" 
                            className="text-white hover:text-white transition-colors"
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            SEO Training
                        </a>
                        </li>
                        <li>
                        <a 
                            href="https://divioseo.fr/" 
                            className="text-white hover:text-white transition-colors"
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Web Development
                        </a>
                        </li>
                        <li>
                        <a 
                            href="https://freres.peyronnet.eu/courses/masterclass-cocon-seo/" 
                            className="text-white hover:text-white transition-colors"
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            SEO Topical Mesh
                        </a>
                        </li>
                    </ul>
                    
                    {/* Social Links */}
                    <div className="flex items-center justify-center sm:justify-start space-x-6">
                        <a 
                        href="https://twitter.com/yourtextguru" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white/60 hover:text-white transition-colors"
                        title="twitter"
                        >
                        <FaTwitter className="text-2xl" />
                        </a>
                        <a 
                        href="https://www.facebook.com/groups/2102639773116540/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white transition-colors"
                        title="facebook"
                        >
                        <FaFacebook className="text-2xl" />
                        </a>
                        <a 
                        href="https://www.youtube.com/c/YourTextGuru" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white transition-colors"
                        title="youtube"
                        >
                        <FaYoutube className="text-2xl" />
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </footer>
        </div>
    )
}
