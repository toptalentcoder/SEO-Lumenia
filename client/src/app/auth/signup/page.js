"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import NavbarLandingEn from "../../../components/common/Navbar-landing-En";
import FooterLandingEn from "../../../components/common/Footer-landing-En";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
        name: "",
        keycode: "",
        cgu: false,
        email_alternative: "",
        email_solo: "super"
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const router = useRouter();
    const { setUser } = useUser();

    useEffect(() => {
        const storageListener = () => {
            const userDataString = localStorage.getItem("googleAuthUser");

            if (userDataString) {
                const userData = JSON.parse(userDataString);

                console.log(userData);

                sessionStorage.setItem("authToken", JSON.stringify(userData.token));
                sessionStorage.setItem("user", JSON.stringify(userData.user));
                setUser(userData);

                router.push("/guides");
            }
        };

        window.addEventListener("storage", storageListener);

        return () => {
            window.removeEventListener("storage", storageListener);
        };
    }, [router, setUser]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match. Please make sure both passwords are identical.");
            setIsLoading(false);
            return;
        }

        if (!formData.cgu) {
            setError("Please accept the legal terms to continue.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Sign-up failed. Please try again.");
            }

            setSuccess("Account created successfully! Redirecting to login page...");
            console.log("Signup successful:", data);

            setTimeout(() => router.push("/auth/signin"), 2000);
        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <NavbarLandingEn/>

            <section id="blog" className="py-24 bg-blue-50 relative overflow-hidden" style={{
                backgroundImage: "url('/images/welcome/section-bg2.png')",
                backgroundSize: 'auto',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
                backgroundPositionY: '0px'
            }}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap mt-28">
                        {/* section intro row starts */}
                        <div className="mb-24 w-3/4 mx-auto">
                            <div className="text-left">
                                <h2 className="text-[37.328px] font-bold text-gray-900">Sign in!</h2>
                                <div className="w-24 h-1 bg-green-400 mt-4 ml-4"></div>
                            </div>
                        </div>
                        {/* section intro row ends */}
                    </div>
                    {/* row starts */}
                    <div className="flex flex-wrap">
                        {/* column 1 starts */}
                        <div className="w-3/4 justify-center mx-auto">
                            {/* blog item 1 starts */}
                            <div className="bg-white p-8">
                                {/* image */}
                                <div className="space-y-6 text-left">
                                    <div className="flex justify-start">
                                    <h4 className="text-[21.328px] font-bold text-gray-900">Sign in!</h4>
                                    </div>
                                    
                                    <p className="text-gray-600 text-[16px]">Create your account to unlock the SEO magic of Lumenia!</p>
                                    <form className="space-y-4" onSubmit={handleSubmit}>
                                        <input type="hidden" name="_token" value="KsG7xlS8al4PDbJDNKymwFr6W3QCqs0ylNGR1XyU" />

                                        {error && (
                                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-red-700">{error}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {success && (
                                            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-green-700">{success}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label htmlFor="fullName" className="block text-[16px] font-semibold text-gray-900">Name*</label>
                                            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className="mt-1 block w-full border-2 border-gray-300 px-4 py-3 text-gray-900" />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-[16px] font-semibold text-gray-900">Email (Preferably your professional email)*</label>
                                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border-2 border-gray-300 px-4 py-3 text-gray-900" />
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="block text-[16px] font-semibold text-gray-900">Password*</label>
                                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full border-2 border-gray-300 px-4 py-3 text-gray-900" />
                                        </div>

                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-[16px] font-semibold text-gray-900">Password confirmation*</label>
                                            <input type="password" name="password_confirmation" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="mt-1 block w-full border-2 border-gray-300 px-4 py-3 text-gray-900" />
                                        </div>

                                        <div>
                                            <label htmlFor="keycode" className="block text-[16px] font-semibold text-gray-900">Coupon code</label>
                                            <input type="text" id="keycode" name="keycode" value={formData.keycode} onChange={handleChange} placeholder="(not mandatory)" className="mt-1 block w-full border-2 border-gray-300 px-4 py-3 text-gray-900" />
                                        </div>

                                        <div className="flex items-center mt-24 justify-start text-left">
                                            <input type="checkbox" name="cgu" id="cgu" checked={formData.cgu} onChange={handleChange} value="1" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                            <label htmlFor="cgu" className="ml-2 block text-[16px] font-semibold text-[#001F3F] text-left">
                                                I accept the {" "}
                                                <a href="/en/legals" target="_blank" rel="noopener" className="text-[#001F3F] hover:text-[#4517AD] underline">
                                                    legals terms
                                                </a>
                                            </label>
                                        </div>

                                        <div className="mt-6">
                                            <button 
                                                type="submit" 
                                                disabled={isLoading}
                                                className="flex justify-center py-3.5 px-10 border border-transparent text-[16px] text-white bg-[#001F3F] hover:bg-[#4517AD] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? 'Creating Account...' : 'Confirm'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {/* blog item 1 ends */}
                        </div>
                        {/* column 1 ends */}
                    </div>
                    {/* row starts */}
                </div>
            </section>

            <FooterLandingEn />

        </div>
    );
}
