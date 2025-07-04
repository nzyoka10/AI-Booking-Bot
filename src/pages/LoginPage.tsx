import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, Mail, Lock, Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailConfirmationNeeded, setEmailConfirmationNeeded] = useState(false);
  const [isResendingConfirmation, setIsResendingConfirmation] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setEmailConfirmationNeeded(false);

    try {
      await login(formData.email, formData.password);
      // Navigation will be handled by the auth context and protected routes
    } catch (err: any) {
      if (err.message && err.message.includes('Email not confirmed')) {
        setEmailConfirmationNeeded(true);
        setError('Your email address needs to be confirmed before you can sign in. Please check your email inbox (including spam folder) for a confirmation link.');
      } else {
        setError(err.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleResendConfirmation = async () => {
    if (!formData.email) {
      setError('Please enter your email address first.');
      return;
    }

    setIsResendingConfirmation(true);
    setError('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      });

      if (error) {
        throw error;
      }

      setConfirmationSent(true);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation email. Please try again.');
    } finally {
      setIsResendingConfirmation(false);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'fundi' | 'customer') => {
    const demoCredentials = {
      admin: { email: 'admin@mtaanifix.ke', password: 'admin123' },
      fundi: { email: 'fundi@mtaanifix.ke', password: 'fundi123' },
      customer: { email: 'customer@mtaanifix.ke', password: 'customer123' }
    };

    setFormData(demoCredentials[role]);
    setEmailConfirmationNeeded(false);
    setError('');
    
    try {
      setIsLoading(true);
      await login(demoCredentials[role].email, demoCredentials[role].password);
    } catch (err: any) {
      if (err.message && err.message.includes('Email not confirmed')) {
        setEmailConfirmationNeeded(true);
        setError('This demo account needs email confirmation. Please use the "Resend Confirmation" button below.');
      } else {
        setError(err.message || 'Demo login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Wrench className="w-10 h-10 text-white" />
            <span className="text-3xl font-bold text-white">MtaaniFix</span>
          </div>
          <p className="text-blue-100">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className={`border px-4 py-3 rounded-lg ${
                emailConfirmationNeeded 
                  ? 'bg-amber-50 border-amber-200 text-amber-800' 
                  : 'bg-red-50 border-red-200 text-red-600'
              }`}>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p>{error}</p>
                    {emailConfirmationNeeded && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={handleResendConfirmation}
                          disabled={isResendingConfirmation || confirmationSent}
                          className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isResendingConfirmation ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : confirmationSent ? (
                            <span>✓ Confirmation email sent!</span>
                          ) : (
                            <>
                              <Mail className="w-4 h-4" />
                              <span>Resend Confirmation Email</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {confirmationSent && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <p>Confirmation email sent! Please check your inbox and spam folder, then click the confirmation link to activate your account.</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-semibold">
                Sign up
              </Link>
            </p>
          </div>

        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-blue-100 hover:text-white transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;