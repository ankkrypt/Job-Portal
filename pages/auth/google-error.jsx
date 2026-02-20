import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect } from 'react';

export default function GoogleError() {
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    // Redirect to login after 3 seconds
    const timer = setTimeout(() => {
      router.push('/auth/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const errorMessages = {
    'access_denied': 'You denied access to your Google account. Please try again.',
    'no_code': 'Authorization code not received from Google.',
    'no_email': 'Could not retrieve email from your Google account.',
    'callback_error': 'An error occurred during authentication. Please try again.',
  };

  const message = errorMessages[error] || 'An unknown error occurred. Please try again.';

  return (
    <div className="w-full h-screen flex items-center justify-center bg-indigo-600">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <p className="text-gray-500 text-sm mb-6">Redirecting to login page in 3 seconds...</p>
          <Link href="/auth/login" className="w-full text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
