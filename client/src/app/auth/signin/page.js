"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import Link from "next/link";
import FormInput from "../../../components/forms/FormInput";
import GoogleAuthButton from "../../../components/forms/GoogleAuthButton";
import { BiSearch } from "react-icons/bi";

export default function SigninPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { setUser } = useUser();

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
        }
    };

    const goToSignUp = () => {
        router.push("/auth/signup");
    };

    return (
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
    );
}