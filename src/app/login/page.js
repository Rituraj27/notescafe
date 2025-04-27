'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Check for signup success message
  useEffect(() => {
    if (searchParams.get('signup') === 'success') {
      setSuccess('Account created successfully! You can now log in.');
    }
  }, [searchParams]);

  // Redirect based on user role
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/'); // Regular users go to homepage
      }
    }
  }, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(`${result.error}`);
        setLoading(false);
        return;
      }

      // Will redirect via useEffect
    } catch (error) {
      console.error('Login error:', error);
      setError(`${error.message}`);
      setLoading(false);
    }
  };

  // Don't render the form if already authenticated
  if (status === 'authenticated') {
    return (
      <div className='min-h-[80vh] flex items-center justify-center bg-[linear-gradient(90deg,_rgba(255,49,49,1)_0%,_rgba(255,145,77,1)_100%)] px-4'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto'></div>
          <p className='mt-4 text-white font-medium'>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center overflow-hidden bg-[linear-gradient(90deg,_rgba(255,49,49,1)_0%,_rgba(255,145,77,1)_100%)] px-4 py-10 relative'>
      <div className='absolute top-0 left-0 w-full h-full bg-[url(/pattern.png)] opacity-10 z-0'></div>

      <div className='w-full max-w-md bg-white rounded-lg shadow-xl p-8 z-10'>
        <div className='mb-8 text-center'>
          <h1 className='uppercase text-[#981d12] font-bold text-4xl mb-2'>
            Welcome Back
          </h1>
          <p className='text-gray-600'>Unlock your potential with NotesCafe</p>
        </div>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
            {error}
          </div>
        )}

        {success && (
          <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6'>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Email Address
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#981d12] focus:border-[#981d12]'
              placeholder='you@example.com'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#981d12] focus:border-[#981d12]'
              placeholder='••••••••'
            />
          </div>

          <div>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-[#981d12] hover:bg-[#7a1208] text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#981d12] disabled:opacity-50 transition-colors font-medium text-lg flex items-center justify-center'
            >
              {loading ? (
                <>
                  <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className='w-5 h-5 mr-2' />
                  Login
                </>
              )}
            </button>
          </div>
        </form>

        <div className='mt-8 text-center'>
          <p className='text-gray-600'>
            Don&apos;t have an account?{' '}
            <Link
              href='/signup'
              className='text-[#981d12] hover:text-[#7a1208] font-medium'
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
