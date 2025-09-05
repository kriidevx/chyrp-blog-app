import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Github, Chrome, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Handle social login with Supabase
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(37,99,235,0.15), transparent 40%)`
        }}
      />
      
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-500/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Background gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-500/15 to-blue-600/15 rounded-full blur-2xl animate-float" />

      <div className="w-full max-w-md relative z-10">
        {/* Main Login Card */}
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 shadow-[0_35px_60px_-15px_rgba(37,99,235,0.3)] transform-gpu hover:scale-105 transition-all duration-500">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center transform-gpu hover:rotate-12 transition-transform duration-300">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-900/70">Sign in to your account to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Show any Supabase auth errors */}
            {errors.submit && (
              <div className="rounded-md bg-red-50 p-4 animate-in slide-in-from-left-2">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-900/40" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-xl border ${
                    errors.email ? 'border-red-500/50' : 'border-white/30'
                  } rounded-2xl text-slate-900 placeholder-slate-900/50 focus:outline-none focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600/50 transition-all duration-300`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm animate-in slide-in-from-left-2">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-900">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-900/40" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-4 bg-white/20 backdrop-blur-xl border ${
                    errors.password ? 'border-red-500/50' : 'border-white/30'
                  } rounded-2xl text-slate-900 placeholder-slate-900/50 focus:outline-none focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600/50 transition-all duration-300`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-900/60 hover:text-blue-600 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm animate-in slide-in-from-left-2">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-600/20 focus:ring-2"
                />
                <span className="ml-2 text-sm text-slate-900/70">Remember me</span>
              </label>
              <a
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-cyan-500 transition-colors duration-300 hover:scale-105 transform-gpu"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl transform-gpu transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] ring-4 ring-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/10 backdrop-blur-xl text-slate-900/70 rounded-full">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSocialLogin('google')}
              className="group flex items-center justify-center gap-2 py-3 px-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-slate-900 font-medium hover:bg-white/30 hover:scale-105 transform-gpu transition-all duration-300"
            >
              <Chrome className="w-5 h-5 text-red-500" />
              <span className="group-hover:text-blue-600 transition-colors">Google</span>
            </button>
            
            <button
              onClick={() => handleSocialLogin('github')}
              className="group flex items-center justify-center gap-2 py-3 px-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-slate-900 font-medium hover:bg-white/30 hover:scale-105 transform-gpu transition-all duration-300"
            >
              <Github className="w-5 h-5 text-slate-900" />
              <span className="group-hover:text-blue-600 transition-colors">GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-slate-900/70">
              Don't have an account?{' '}
              <a
                href="/auth/signup"
                className="text-blue-600 hover:text-cyan-500 font-semibold transition-all duration-300 hover:scale-105 transform-gpu inline-block"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(1deg); }
          66% { transform: translateY(4px) rotate(-1deg); }
        }
        
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        
        @keyframes animate-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-in {
          animation: animate-in 0.3s ease-out;
        }
        
        @keyframes slide-in-from-left-2 {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .slide-in-from-left-2 {
          animation: slide-in-from-left-2 0.2s ease-out;
        }
        
        @keyframes zoom-in-50 {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .zoom-in-50 {
          animation: zoom-in-50 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
