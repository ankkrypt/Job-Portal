import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Router from 'next/router';
import { login_me } from '@/Services/auth';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setUserData } from '@/Utils/UserSlice';
import NavBar from '@/components/NavBar';
import { FiBriefcase, FiHeart, FiCheckCircle } from 'react-icons/fi';


export default function Login() {
  const dispatch = useDispatch()


  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!formData.email) {
      setError({ ...error, email: "Email Field is Required" })
      return;
    }
    if (!formData.password) {
      setError({ ...error, password: "Password Field is required" })
      return;
    }

    setIsLoading(true);
    const res = await login_me(formData);
    setIsLoading(false);
    
    if(res.success)
    {
      Cookies.set('token', res?.finalData?.token);
      localStorage.setItem('user', JSON.stringify(res?.finalData?.user));
      dispatch(setUserData(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null));
      Router.push('/');
    }
    else
    {
      toast.error(res.message);
    }
  }


  useEffect(() => {
    if (Cookies.get('token')) {
      Router.push('/');
    }

    if (Router.isReady) {
      const { error: urlError } = Router.query;
      if (urlError) {
        const errorMessages = {
          'access_denied': 'You denied access to your Google account.',
          'processing': 'Error processing your login. Please try again.',
          'auth': 'Authentication failed. Please try again.',
          'no_data': 'No authentication data received. Please try again.',
        };
        toast.error(errorMessages[urlError] || 'An error occurred during authentication.');
      }
    }
  },[])


  return (
    <>
    <NavBar />
    <div className='w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center pt-20 pb-12 px-4'>
      <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-12 lg:gap-16 items-center">
        
        {/* Left side - Info */}
        <div className="flex-1 text-center lg:text-left flex flex-col justify-center max-w-xl">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">Welcome Back!</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Sign In to Your <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Account</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">Access your personalized job portal and discover your next career opportunity.</p>
          
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">
                <FiBriefcase className="text-blue-600 text-2xl" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Exclusive Job Listings</p>
                <p className="text-gray-600 text-sm">Access premium job opportunities</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-xl flex-shrink-0">
                <FiHeart className="text-purple-600 text-2xl" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Save Your Favorites</p>
                <p className="text-gray-600 text-sm">Bookmark jobs for later</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-xl flex-shrink-0">
                <FiCheckCircle className="text-green-600 text-2xl" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Track Applications</p>
                <p className="text-gray-600 text-sm">Monitor your job applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:flex-1">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100 h-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-600 mb-8">Enter your credentials to access your account</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  type="email" 
                  placeholder="you@example.com" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                />
                {error.email && <p className="text-sm text-red-500 mt-1">⚠️ {error.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <Link href="/auth/forget-password" className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                    Forgot?
                  </Link>
                </div>
                <input 
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                />
                {error.password && <p className="text-sm text-red-500 mt-1">⚠️ {error.password}</p>}
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-3 cursor-pointer py-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-blue-600" />
                <span className="text-gray-700 font-medium">Keep me signed in</span>
              </label>

              {/* Sign In Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-xs text-gray-500 font-medium">OR CONTINUE WITH</span>
                </div>
              </div>

              {/* Google Button */}
              <a 
                href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`} 
                className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 font-medium text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </a>

              {/* Sign Up Link */}
              <p className="text-center text-gray-700 text-sm pt-2">
                New to JobPortal? <Link href="/auth/register" className="font-bold text-blue-600 hover:text-purple-600 transition-colors">
                  Create account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
    </>
  )
}
