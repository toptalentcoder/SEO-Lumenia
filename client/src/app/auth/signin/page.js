"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import Link from "next/link";
<<<<<<< HEAD
import FormInput from "../../../components/forms/FormInput";
import GoogleAuthButton from "../../../components/forms/GoogleAuthButton";
import { BiSearch } from "react-icons/bi";
=======
import NavbarLandingEn from "../../../components/common/Navbar-landing-En";
import FooterLandingEn from "../../../components/common/Footer-landing-En";
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c

export default function SigninPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { setUser } = useUser();
<<<<<<< HEAD
=======
    const [success, setSuccess] = useState(null);
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c

    useEffect(() => {
        const checkGoogleLogin = () => {
        const userDataString = localStorage.getItem("googleAuthUser");
        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                localStorage.setItem("authToken", userData.token);
                localStorage.setItem("user", JSON.stringify(userData.user));
                setUser(userData.user);
                localStorage.removeItem("googleAuthUser");
                router.push("/dashboard");
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
        };
        checkGoogleLogin();
        const storageListener = () => checkGoogleLogin();
        window.addEventListener("storage", storageListener);
        return () => window.removeEventListener("storage", storageListener);
    }, [router, setUser]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
<<<<<<< HEAD
        setIsLoading(true);
        try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Sign-in failed. Please try again.");
        }
        let data = await response.json();
        if (!data.user) {
            data = {
            user: {
                name: data.name,
                email: data.email,
                role: data.role,
            },
            token: data.token,
            };
        }
        if (typeof window !== "undefined") {
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        }
        try {
            setUser(data.user);
        } catch (err) {
            console.error("Error setting user in context:", err);
        }
        router.push("/dashboard");
        } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
        setIsLoading(false);
=======
        setSuccess(null);
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Sign-in failed. Please try again.");
            }
            let data = await response.json();
            if (!data.user) {
                data = {
                    user: {
                        name: data.name,
                        email: data.email,
                        role: data.role,
                    },
                    token: data.token,
                };
            }
            if (typeof window !== "undefined") {
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
            }
            try {
                setUser(data.user);
                setSuccess("Sign-in successful! Redirecting to dashboard...");
            } catch (err) {
                console.error("Error setting user in context:", err);
                setError("Error setting user in context.");
            }
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
        }
    };

    const goToSignUp = () => {
        router.push("/auth/signup");
    };

    return (
<<<<<<< HEAD
        <main className="min-h-screen bg-gray-100 w-full flex items-center justify-center text-gray-800">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 ">Sign In</h2>
            </div>
            <hr className="border-t border-gray-300 mb-6" />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form className="space-y-4" onSubmit={handleSubmit}>
            <FormInput id="email" label="Email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="w-full" />
            <FormInput id="password" label="Password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} className="w-full" />
            <div className="flex justify-center">
                <button type="submit" className="w-full max-w-md py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-md shadow-sm flex items-center gap-x-2 justify-center transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                {isLoading ? (
                    <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Signing In...</span>
                    </>
                ) : (
                    <>
                        <BiSearch />
                        <span>Sign In</span>
                    </>
                )}
                </button>
            </div>
            </form>
            <hr className="border-t border-gray-300  my-6" />
            <div className="flex justify-center">
            <GoogleAuthButton action="signin" />
            </div>
            <div className="text-center mt-4">
            <p className="text-sm text-gray-600">Don&apos;t have an account? <button onClick={goToSignUp} className="text-blue-600 font-medium hover:underline">Sign up here</button></p>
            </div>
        </div>
        </main>
=======
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
                                <h2 className="text-[37.328px] font-bold text-gray-900">Log in!</h2>
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
                                    <h4 className="text-[21.328px] font-bold text-gray-900">Log in!</h4>
                                    </div>
                                    
                                    <p className="text-gray-600 text-[16px] bg-gray-200 px-4 py-3 rounded-md">If you do not have a Lumenia account yet, {""}
                                        <Link href="/auth/signup" className="hover:text-blue-600 font-medium underline">go to the registration page to create one.</Link></p>
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
                                            <label htmlFor="email" className="block text-[16px] font-semibold text-gray-900">Email</label>
                                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border-2 border-gray-300 px-4 py-3 text-gray-900" />
                                        </div>

                                        <div className="mt-6">
                                            <label htmlFor="password" className="block text-[16px] font-semibold text-gray-900">Password</label>
                                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full border-2 border-gray-300 px-4 py-3 text-gray-900" />
                                        </div>

                                        <div className="flex items-center mt-8 justify-start text-left">
                                            <input type="checkbox" name="cgu" id="cgu" checked={formData.cgu} onChange={handleChange} value="1" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                            <label htmlFor="cgu" className="ml-2 block text-[16px] font-semibold text-[#001F3F] text-left">
                                                Remember me
                                            </label>
                                        </div>

                                        <div className="mt-6">
                                            <button 
                                                type="submit" 
                                                disabled={isLoading}
                                                className="flex justify-center py-3.5 px-10 border border-transparent text-[16px] text-white bg-[#001F3F] hover:bg-[#4517AD] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? 'Logging in...' : 'Submit'}
                                            </button>
                                        </div>

                                        <div className="mt-6">
                                            <Link href="/auth/forgot-password" className="text-blue-600 font-medium hover:underline">Forgot your password?</Link>
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

            <FooterLandingEn/>

        </div>
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
    );
}