"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import GoogleSigninButton from "./GoogleSigninButton";
import SigninWithPassword from "./SigninWithPassword";

export default function AuthScreen() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const fillCredentials = (email: string, password: string) => {
    setCredentials({ email, password });
  };

  return (
    <div className="flex h-screen bg-gray-2 dark:bg-[#020d1a]">
      {/* Left side - Welcome content with unsplash background (hidden on mobile) */}
      <div className="relative hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center overflow-hidden h-full">
        {/* Unsplash background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')`
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 max-w-md px-8 text-center text-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">RAW-DATA</h1>
          </div>

          <h1 className="mb-6 text-3xl font-bold text-white">
            Demo Credentials
          </h1>

          <div className="space-y-3">
            <div
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => fillCredentials('admin@raw.com', '123456')}
            >
              <div className="text-sm font-semibold text-white">Admin</div>
              <div className="text-xs text-white/80">admin@raw.com - 123456</div>
            </div>

            <div
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => fillCredentials('analysts@raw.com', '123456')}
            >
              <div className="text-sm font-semibold text-white">Analysts</div>
              <div className="text-xs text-white/80">analysts@raw.com - 123456</div>
            </div>

            <div
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => fillCredentials('branch1@raw.com', '123456')}
            >
              <div className="text-sm font-semibold text-white">Branch Users</div>
              <div className="text-xs text-white/80">branch1@raw.com - 123456</div>
            </div>
          </div>

          <p className="mt-6 text-sm text-white/70">
            Click any credential above to auto-fill login fields
          </p>
        </div>
      </div>

      {/* Right side - Sign in form */}
      <div className="flex w-full items-center justify-center px-4 lg:w-1/2 h-full">
        <div className="w-full max-w-md">
          <div className="rounded-[10px] bg-white p-8 shadow-lg sm:p-12" style={{ backgroundColor: '#ffffff' }}>
            <div className="mb-6 text-center lg:hidden">
              <h1 className="text-2xl font-bold text-primary mb-2">RAW-DATA</h1>
              <Link className="inline-block" href="/">
                <Image
                  className="dark:hidden mx-auto"
                  src={"/images/logo/logo-dark.svg"}
                  alt="Logo"
                  width={140}
                  height={25}
                />
                <Image
                  className="hidden dark:block mx-auto"
                  src={"/images/logo/logo.svg"}
                  alt="Logo"
                  width={140}
                  height={25}
                />
              </Link>
            </div>

            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-dark dark:text-white">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-dark-4 dark:text-dark-6">
                Enter your credentials to access your account
              </p>
            </div>

            <div className="space-y-4">
              <SigninWithPassword credentials={credentials} />

              <div className="mt-6 text-center">
                <p>
                  Don&apos;t have any account?{" "}
                  <Link href="/auth/sign-up" className="text-primary">
                    Sign Up
                  </Link>
                </p>
              </div>

              {/* Developed by text */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Developed by AL RAWABI IT DEPARTMENT
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}