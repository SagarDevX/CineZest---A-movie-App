"use client"
import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

const page = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSignUp, setisSignUp] = useState(false)

    const handlesubmit = async () => {
        if (isSignUp) {
            const { error } = await supabase.auth.signUp({ email, password })
            if (error) {
                console.error(error)
            }
        }
        else {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                console.error(error)
            }
        }
        window.location.href = '/'
    }

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`
            }
        })

    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="bg-[#181818] p-8 rounded-2xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-6">
                    Sign Up
                </h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#333] text-white px-4 py-3 rounded-lg mb-3 outline-none"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#333] text-white px-4 py-3 rounded-lg mb-4 outline-none"
                />
                <button
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold mb-3 cursor-pointer hover:bg-red-700"
                    onClick={handlesubmit}>
                    Sign Up
                </button>

                <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-gray-600" />
                    <span className="text-gray-400 text-sm">or</span>
                    <div className="flex-1 h-px bg-gray-600" />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 cursor-pointer flex items-center justify-center gap-2"
                >
                    <img src="https://www.google.com/favicon.ico" width={20} height={20} />
                    Continue with Google
                </button>


            </div>
        </div>)
}

export default page