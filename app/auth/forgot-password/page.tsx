import { Metadata } from 'next';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, CheckCircle, Zap, Shield, Lock, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Forgot Password - Chyrp Blog',
  description: 'Reset your password for Chyrp Blog'
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);

  // Real-time email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
    
    if (email && errors.email) {
      setErrors({});
    }
  }, [email, errors.email]);

  // Handle email input
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Form validation
  const validateForm = () => {
    const newErrors: { email?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setEmail('');
      
      // Hide success after 8 seconds
      setTimeout(() => setShowSuccess(false), 8000);
    }, 2500);
  };

  const securityFeatures = [
    {
      icon: Shield,
      title: 'Secure Reset',
      description: 'Your password reset link is encrypted and expires in 24 hours'
    },
    {
      icon: Lock,
      title: 'Account Protection',
      description: 'We never store your passwords in plain text'
    },
    {
      icon: Eye,
      title: 'Privacy First',
      description: 'Your email is never shared with third parties'
    }
  ];
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-blue-600/10 to-cyan-500/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
      </div>

      {/* Particle Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-500 rounded-full animate-pulse opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {!showSuccess ? (
          <>
            {/* Header */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-blue-600 font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                <Lock className="w-4 h-4" />
                Password Recovery
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-black leading-none tracking-tighter">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  Forgot
                </span>
                <br />
                <span className="text-slate-900">Password?</span>
              </h2>
              
              <p className="text-lg text-slate-600 leading-relaxed">
                No worries! Enter your email and we'll send you a secure reset link.
              </p>
              
              <div className="text-center">
                <span className="text-sm text-slate-500">Or </span>
                <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-cyan-500 transition-colors duration-300 hover:underline">
                  sign in to your account
                </Link>
              </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:shadow-cyan-500/20 transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Reset Your Password</h3>
              </div>

              <div className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <div className="relative">
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={handleEmailChange}
                      className={`w-full px-4 py-3 pl-12 bg-white/20 backdrop-blur-xl border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                        errors.email 
                          ? 'border-red-300 focus:ring-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
                          : isValidEmail
                          ? 'border-green-300 focus:border-cyan-500 focus:ring-cyan-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]'
                          : 'border-white/30 focus:border-cyan-500 focus:ring-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                      }`}
                      placeholder="Enter your email address"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Mail className={`w-5 h-5 transition-colors ${
                        errors.email ? 'text-red-400' : isValidEmail ? 'text-green-400' : 'text-slate-400'
                      }`} />
                    </div>
                    {isValidEmail && !errors.email && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CheckCircle className="w-5 h-5 text-green-500 animate-pulse" />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm font-medium animate-pulse flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                  {isValidEmail && !errors.email && (
                    <p className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Valid email format
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isValidEmail}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_20px_50px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        Send Reset Link
                      </>
                    )}
                  </div>
                </button>

                {/* Back to Login */}
                <Link href="/auth/login" className="w-full group flex items-center justify-center gap-2 text-slate-600 hover:text-blue-600 font-semibold py-2 transition-all duration-300">
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Back to Sign In
                </Link>
              </div>
            </div>

            {/* Security Features */}
            <div className="grid gap-4">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{feature.title}</h4>
                      <p className="text-xs text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center space-y-8">
            <div className="bg-gradient-to-r from-green-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-[0_20px_50px_rgba(34,197,94,0.3)] animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900">
                Check Your Email!
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We've sent a password reset link to your email address. 
                Click the link in the email to reset your password.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-6 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">Email sent successfully</span>
                </div>
                <p className="text-sm text-slate-600">
                  Didn't receive the email? Check your spam folder or wait a few minutes.
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Resend Email
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSuccess(false)}
              className="group flex items-center justify-center gap-2 text-slate-600 hover:text-blue-600 font-semibold py-2 transition-all duration-300 mx-auto"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Reset Form
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
