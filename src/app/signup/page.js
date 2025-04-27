'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // If signup successful, redirect to login page
      router.push('/login?signup=success');
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center overflow-hidden bg-[linear-gradient(90deg,_rgba(255,49,49,1)_0%,_rgba(255,145,77,1)_100%)] px-4 py-10 relative'>
      <div className='absolute top-0 left-0 w-full h-full bg-[url(/pattern.png)] opacity-10 z-0'></div>

      <div className='h-[80vh] w-full max-w-md bg-white rounded-lg shadow-xl p-8 z-10'>
        <div className='mb-8 text-center'>
          <h1 className='uppercase text-[#981d12] font-bold text-4xl mb-2'>
            Create Account
          </h1>
          <p className='text-gray-600'>
            Join our community and unlock your potential
          </p>
        </div>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Full Name
            </label>
            <input
              id='name'
              name='name'
              type='text'
              required
              value={formData.name}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#981d12] focus:border-[#981d12]'
              placeholder='John Doe'
            />
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Email Address
            </label>
            <input
              id='email'
              name='email'
              type='email'
              required
              value={formData.email}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#981d12] focus:border-[#981d12]'
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
              name='password'
              type='password'
              required
              value={formData.password}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#981d12] focus:border-[#981d12]'
              placeholder='••••••••'
            />
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Confirm Password
            </label>
            <input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#981d12] focus:border-[#981d12]'
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
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className='w-5 h-5 mr-2' />
                  Sign Up
                </>
              )}
            </button>
          </div>
        </form>

        <div className='mt-8 text-center'>
          <p className='text-gray-600'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='text-[#981d12] hover:text-[#7a1208] font-medium'
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
