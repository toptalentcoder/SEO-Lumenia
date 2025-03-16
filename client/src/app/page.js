"use client"

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      Welcome to my YoutText
      <div className="flex space-x-12">
      <Link href="/auth/signin">
          <button className="mt-6 px-6 py-3 bg-white text-blue-500 font-bold rounded-2xl shadow-md hover:bg-gray-200 transition-all w-52">
            Signin
          </button>
        </Link>
        <Link href="/auth/signup">
          <button className="mt-6 px-6 py-3 bg-white text-blue-500 font-bold rounded-2xl shadow-md hover:bg-gray-200 transition-all w-52">
            SignUp
          </button>
        </Link>
      </div>
    </div>
  );
}
