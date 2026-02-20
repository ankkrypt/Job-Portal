import React, { useState , useEffect } from 'react'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { register_me } from '@/Services/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import NavBar from '@/components/NavBar';


export default function  Register (){
  const router = useRouter();
  
  useEffect(() => {
    if (Cookies.get('token')) {
      router.push('/');
    }
  },[router])


 


  
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "", name: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError({ ...error, name: "Name is required" })
      return;
    }
    if (!formData.email) {
      setError({ ...error, email: "Email is required" })
      return;
    }
    if (!formData.password) {
      setError({ ...error, password: "Password is required" })
      return;
    }

    const data = await register_me(formData);
    if (data.success) {
      toast.success(data.message);
      setFormData({ name: "", email: "", password: "" });
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
    else {
      toast.error(data.message);
    }
  }


  return (
    <>
    <NavBar />
    <div className='w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center pt-20 pb-12 px-4'>
      <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-12 lg:gap-16 items-center">
        
        {/* Left side - Info */}
        <div className="flex-1 text-center lg:text-left flex flex-col justify-center max-w-xl">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">Join Us Today</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Create Your <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Account</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">Join thousands of professionals finding their perfect job opportunities every single day.</p>
          
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              {/* <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-xl flex-shrink-0">⚡</div> */}
              <div className="text-left">
                <p className="font-semibold text-gray-900">Quick Setup</p>
                <p className="text-gray-600 text-sm">Get started in less than 2 minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              {/* <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">🛡️</div> */}
              <div className="text-left">
                <p className="font-semibold text-gray-900">Secure & Safe</p>
                <p className="text-gray-600 text-sm">Your data is always protected</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              {/* <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-xl flex-shrink-0">🎯</div> */}
              <div className="text-left">
                <p className="font-semibold text-gray-900">Find Your Dream Job</p>
                <p className="text-gray-600 text-sm">Access thousands of opportunities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:flex-1">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100 h-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600 mb-8">Sign up and start your job search journey</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  type="text" 
                  id="name" 
                  placeholder="John Doe" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                />
                {error.name && <p className="text-sm text-red-500 mt-1">⚠️ {error.name}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  type="email" 
                  id="email" 
                  placeholder="you@example.com" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                />
                {error.email && <p className="text-sm text-red-500 mt-1">⚠️ {error.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input 
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  type="password" 
                  id="password" 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                />
                {error.password && <p className="text-sm text-red-500 mt-1">⚠️ {error.password}</p>}
              </div>

              {/* Terms Agreement */}
              <label className="flex items-start gap-3 cursor-pointer py-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-blue-600 mt-1" />
                <span className="text-gray-700 text-sm">I agree to the <span className="font-semibold text-blue-600">Terms of Service</span> and <span className="font-semibold text-blue-600">Privacy Policy</span></span>
              </label>

              {/* Sign Up Button */}
              <button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Create Account
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white text-sm text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Button */}
              <a 
                href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`} 
                className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </a>

              {/* Sign In Link */}
              <p className="text-center text-gray-600 text-sm">
                Already have an account? <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700">
                  Sign in here
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
