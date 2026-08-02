'use client'
import { supabase } from '../lib/supabase'
import { useState } from 'react'
import { IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  const handleEmailAuth = async () => {
    setLoading(true)
    setError('')
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Check your email to verify your account!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push("/")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    })
    if (error) setError(error.message)
  }
  const handleGithubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    })
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#181818] p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6">
          {isSignUp ? 'Sign Up' : 'Login'}
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

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
          onClick={handleEmailAuth}
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold mb-3 hover:bg-red-700 cursor-pointer"
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Login'}
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-gray-600" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-600" />
        </div>

        <div className='flex flex-col gap-2'>
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <IconBrandGoogle size={20} className="text-[#4285F4]"/>
            Continue with Google
          </button>

          <button
            onClick={handleGithubLogin}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <IconBrandGithub size={20} />
            Continue with GitHub
          </button>
        </div>


        <p className="text-gray-400 text-center mt-4">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white ml-1 underline cursor-pointer"
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}