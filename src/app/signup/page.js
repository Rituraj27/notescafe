'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UserPlus,
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';

export default function SignupPage() {
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Verification
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [currentRequirement, setCurrentRequirement] = useState('minLength');
  const [otpStatus, setOtpStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [otpError, setOtpError] = useState('');
  const router = useRouter();

  const requirements = {
    minLength: {
      text: 'At least 8 characters long',
      check: (password) => password.length >= 8,
    },
    hasUpperCase: {
      text: 'Contains uppercase letter',
      check: (password) => /[A-Z]/.test(password),
    },
    hasLowerCase: {
      text: 'Contains lowercase letter',
      check: (password) => /[a-z]/.test(password),
    },
    hasNumber: {
      text: 'Contains number',
      check: (password) => /[0-9]/.test(password),
    },
    hasSpecialChar: {
      text: 'Contains special character',
      check: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  };

  const checkPasswordStrength = (password) => {
    const newStrength = {
      hasMinLength: requirements.minLength.check(password),
      hasUpperCase: requirements.hasUpperCase.check(password),
      hasLowerCase: requirements.hasLowerCase.check(password),
      hasNumber: requirements.hasNumber.check(password),
      hasSpecialChar: requirements.hasSpecialChar.check(password),
    };
    setPasswordStrength(newStrength);

    // Update current requirement
    const requirementKeys = Object.keys(requirements);
    const currentIndex = requirementKeys.indexOf(currentRequirement);
    const isCurrentMet = newStrength[currentRequirement];

    if (isCurrentMet) {
      // Move to next unmet requirement
      const nextUnmet = requirementKeys.find(
        (key, index) => index > currentIndex && !newStrength[key]
      );
      if (nextUnmet) {
        setCurrentRequirement(nextUnmet);
      } else {
        // If all requirements after current are met, go back to first unmet
        const firstUnmet = requirementKeys.find((key) => !newStrength[key]);
        if (firstUnmet) {
          setCurrentRequirement(firstUnmet);
        }
      }
    }
  };

  const isPasswordStrong = () => {
    return Object.values(passwordStrength).every(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const handleBasicInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!isPasswordStrong()) {
      setError('Please ensure your password meets all the requirements');
      setLoading(false);
      return;
    }

    try {
      // Send OTP
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setStep(2);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(
        error.message || 'Failed to send verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setResendLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification code');
      }

      setResendTimer(60); // Set 60 seconds countdown
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, otp: value }));
    setOtpStatus('idle');
    setOtpError('');

    // Auto-verify when 6 digits are entered
    if (value.length === 6) {
      verifyOtp(value);
    }
  };

  const verifyOtp = async (otp) => {
    setOtpStatus('loading');
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      setOtpStatus('success');
    } catch (error) {
      setOtpStatus('error');
      setOtpError(error.message || 'Invalid code');
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Verify OTP
      const verifyResponse = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Invalid verification code');
      }

      // If OTP is verified, proceed with signup
      const signupResponse = await fetch('/api/auth/signup', {
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

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        throw new Error(signupData.error || 'Failed to create account');
      }

      // If signup successful, redirect to login page
      router.push('/login?signup=success');
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  return (
    <div className='min-h-screen flex items-center justify-center overflow-hidden bg-[linear-gradient(90deg,_rgba(255,49,49,1)_0%,_rgba(255,145,77,1)_100%)] px-4 py-10 relative'>
      <div className='absolute top-0 left-0 w-full h-full bg-[url(/pattern.png)] opacity-10 z-0'></div>

      <div className='w-full max-w-md bg-white rounded-lg shadow-xl p-8 z-10'>
        <div className='mb-8 text-center'>
          <h1 className='uppercase text-[#981d12] font-bold text-4xl mb-2'>
            {step === 1 ? 'Create Account' : 'Verify Email'}
          </h1>
          <p className='text-gray-600'>
            {step === 1
              ? 'Join our community and unlock your potential'
              : 'Enter the verification code sent to your email'}
          </p>
        </div>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleBasicInfoSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Full Name
              </label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  id='name'
                  name='name'
                  type='text'
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#981d12] focus:border-[#981d12]'
                  placeholder='John Doe'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Email Address
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#981d12] focus:border-[#981d12]'
                  placeholder='you@example.com'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    formData.password
                      ? isPasswordStrong()
                        ? 'border-green-500 focus:ring-green-500'
                        : 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#981d12]'
                  }`}
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
              {formData.password && !isPasswordStrong() && (
                <div className='mt-2 space-y-2'>
                  {Object.entries(requirements).map(([key, requirement]) => (
                    <div
                      key={key}
                      className={`flex items-center text-sm transition-all duration-200 ${
                        key === currentRequirement
                          ? 'scale-105 font-medium'
                          : 'opacity-70'
                      }`}
                    >
                      {passwordStrength[key] ? (
                        <CheckCircle2 className='w-4 h-4 text-green-500 mr-2' />
                      ) : (
                        <XCircle className='w-4 h-4 text-red-500 mr-2' />
                      )}
                      <span
                        className={
                          passwordStrength[key]
                            ? 'text-green-500'
                            : key === currentRequirement
                              ? 'text-red-500'
                              : 'text-gray-500'
                        }
                      >
                        {requirement.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Confirm Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    formData.confirmPassword
                      ? formData.password === formData.confirmPassword
                        ? 'border-green-500 focus:ring-green-500'
                        : 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#981d12]'
                  }`}
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className='mt-1 text-sm text-red-500'>
                    Passwords do not match
                  </p>
                )}
            </div>

            <div>
              <button
                type='submit'
                disabled={
                  loading ||
                  !isPasswordStrong() ||
                  formData.password !== formData.confirmPassword
                }
                className='w-full bg-[#981d12] hover:bg-[#7a1208] text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#981d12] disabled:opacity-50 transition-colors font-medium text-lg flex items-center justify-center'
              >
                {loading ? (
                  <>
                    <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                    Sending Code...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className='w-5 h-5 ml-2' />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerificationSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='otp'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Verification Code
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  id='otp'
                  name='otp'
                  type='text'
                  required
                  value={formData.otp}
                  onChange={handleOtpChange}
                  className={`w-full pl-10 pr-12 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                    otpStatus === 'success'
                      ? 'border-green-500 focus:ring-green-500'
                      : otpStatus === 'error'
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#981d12]'
                  }`}
                  placeholder='Enter 6-digit code'
                  maxLength={6}
                />
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                  {otpStatus === 'loading' && (
                    <Loader2 className='w-5 h-5 text-[#981d12] animate-spin' />
                  )}
                  {otpStatus === 'success' && (
                    <CheckCircle className='w-5 h-5 text-green-500' />
                  )}
                  {otpStatus === 'error' && (
                    <XCircle className='w-5 h-5 text-red-500' />
                  )}
                </div>
              </div>
              {otpError && (
                <p className='mt-1 text-sm text-red-500'>{otpError}</p>
              )}
              <div className='mt-2 flex items-center justify-between'>
                <button
                  type='button'
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || resendLoading}
                  className='text-sm text-[#981d12] hover:text-[#7a1208] font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-1 animate-spin' />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className='w-4 h-4 mr-1' />
                      {resendTimer > 0
                        ? `Resend code in ${resendTimer}s`
                        : 'Resend code'}
                    </>
                  )}
                </button>
                <span className='text-sm text-gray-500'>
                  Didn&apos;t receive the code?
                </span>
              </div>
            </div>

            <div className='flex flex-col space-y-4'>
              <button
                type='submit'
                disabled={loading || otpStatus !== 'success'}
                className='w-full bg-[#981d12] hover:bg-[#7a1208] text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#981d12] disabled:opacity-50 transition-colors font-medium text-lg flex items-center justify-center'
              >
                {loading ? (
                  <>
                    <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                    Verifying...
                  </>
                ) : (
                  <>
                    <UserPlus className='w-5 h-5 mr-2' />
                    Create Account
                  </>
                )}
              </button>

              <button
                type='button'
                onClick={() => setStep(1)}
                className='text-[#981d12] hover:text-[#7a1208] font-medium text-sm'
              >
                ← Back to previous step
              </button>
            </div>
          </form>
        )}

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
