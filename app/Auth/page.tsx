'use client';

import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io5";
import { signIn, signOut, useSession } from "next-auth/react";
import IconButton, { ButtonProps } from "../components/IconButton";
import { useState } from "react";

const buttonProps: ButtonProps[] = [
    {
        classNames: "text-2xl cursor-pointer hover:scale-101 transition duration-200 bg-white border-green-800 border-2 px-2 rounded hover:shadow-lg",
        icon: FcGoogle,
        onClickFunction: signIn,
        functionProps: "google"
    }
];


export default function AuthPage() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e : any) => {
        e.preventDefault();
        setLoading(true);
        await signIn("email", {
            email,
            callbackUrl: "/",
            redirect: true,
        })
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div
                className="fixed top-0 left-0 w-full h-full -z-10 bg-cover bg-center"
                style={{
                backgroundImage: "url('/apple-bg.png')",
                }}
            >
                <div
                    id="bgOverBlend"
                    className="absolute top-0 left-0 w-full h-full bg-white/70 mix-blend-lighten"
                ></div>
            </div>
            <form className="p-6 m-2 rounded shadow-md md:w-1/3 bg-white/90 text-center" onSubmit={handleSignIn}>
                <h1 className="text-xl text-green-800 font-bold">Sign in to Apple Mes wear</h1>
                {/* <h1 className="text-2xl font-semibold">Get the Link to Login</h1> */}
                <input 
                    placeholder="Enter your email" 
                    className="bg-white shadow-2xl rounded border border-green-700 focus:outline-none p-2 w-full mt-6" 
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />
                <button 
                    className="bg-green-900 hover:scale-99 hover:opacity-95 duration-200 hover:cursor-pointer font-bold w-full text-white px-4 py-2 rounded mt-4"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Get Link"}
                </button>
                <div className="flex items-center gap-4 my-5">
                    <div className="flex-1 h-px bg-gray-400"></div>
                    <span className="text-gray-600 text-sm">Other signin options</span>
                    <div className="flex-1 h-px bg-gray-400"></div>
                </div>
                <div className="w-full flex gap-8 items-center">
                    {buttonProps.map((btn, index) => (
                         <div className={btn.classNames + " justify-center py-2 w-full flex items-center gap-2"} key={index}>
                            <span className="text-sm"> Continue with </span>
                            <IconButton 
                                key={index}
                                classNames={""}
                                icon={btn.icon}
                                onClickFunction={()=>btn.onClickFunction(btn.functionProps)}
                            />
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
}