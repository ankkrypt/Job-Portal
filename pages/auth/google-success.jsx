import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setUserData } from '@/Utils/UserSlice';
import { useState } from 'react';

export default function GoogleSuccess() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { token, user, error: urlError } = router.query;

    if (urlError) {
      router.push(`/auth/google-error?error=${urlError}`);
      return;
    }

    if (token && user) {
      try {
        // Set token in cookie
        Cookies.set('token', token);

        // Parse and store user data in localStorage
        const userData = JSON.parse(user);
        localStorage.setItem('user', JSON.stringify(userData));

        // Update Redux store
        dispatch(setUserData(userData));

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/');
        }, 500);
      } catch (error) {
        setError('Error processing your login');
        router.push('/auth/login?error=processing');
      }
    } else if (!urlError) {
      setError('No authentication data received');
      router.push('/auth/login?error=no_data');
    }
  }, [router.query, router, dispatch]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-indigo-600">
      <div className="text-center">
        <div className="text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Completing your sign in...</p>
          {error && <p className="text-red-200 text-sm mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}

