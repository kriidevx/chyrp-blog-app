'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Phone, Mail, Clock, Twitter, Github, Linkedin, MessageCircle, CheckCircle, Zap } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactPageEnhanced = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isOfficeHours, setIsOfficeHours] = useState(true);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const [messageLength, setMessageLength] = useState(0);
  const maxMessageLength = 500;

  // Office hours check
  useEffect(() => {
    const checkOfficeHours = () => {
      const now = new Date();
      const hour = now.getHours();
      setIsOfficeHours(hour >= 9 && hour <= 17);
    };
    
    checkOfficeHours();
    const interval = setInterval(checkOfficeHours, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Message input handling
  const handleMessageInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const content = target.textContent || '';
    if (content.length <= maxMessageLength) {
      handleInputChange('message', content);
      setMessageLength(content.length);
    } else {
      target.textContent = content.substring(0, maxMessageLength);
      setMessageLength(maxMessageLength);
    }
  };

  // Focus and blur handlers
  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.textContent === 'Your message here...') {
      target.textContent = '';
    }
    target.classList.remove('text-slate-400');
    target.classList.add('text-slate-900');
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.textContent === '') {
      target.textContent = 'Your message here...';
      target.classList.add('text-slate-400');
      target.classList.remove('text-slate-900');
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      if (messageRef.current) {
        messageRef.current.textContent = 'Your message here...';
        messageRef.current.classList.add('text-slate-400');
        messageRef.current.classList.remove('text-slate-900');
      }
      setMessageLength(0);
      
      setTimeout(() => setShowSuccess(false), 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      content: '123 Tech Street, Silicon Valley, CA 94000',
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'hello@chympblog.com',
      gradient: 'from-blue-600 to-cyan-500'
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', color: 'hover:text-cyan-400' },
    { icon: Github, href: '#', color: 'hover:text-slate-700' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
    { icon: MessageCircle, href: '#', color: 'hover:text-cyan-500' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-blue-600/10 to-cyan-500/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
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

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-blue-600 font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
            <Zap className="w-4 h-4" />
            Get In Touch
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black leading-none tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              Contact
            </span>
            <br />
            <span className="text-slate-900">Us</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ready to collaborate? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:shadow-cyan-500/20 transition-all duration-500 transform hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Send Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/20 backdrop-blur-xl border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                      errors.name 
                        ? 'border-red-300 focus:ring-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
                        : 'border-white/30 focus:border-cyan-500 focus:ring-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm font-medium animate-pulse">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/20 backdrop-blur-xl border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
                        : 'border-white/30 focus:border-cyan-500 focus:ring-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm font-medium animate-pulse">{errors.email}</p>
                  )}
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/20 backdrop-blur-xl border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                      errors.subject 
                        ? 'border-red-300 focus:ring-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
                        : 'border-white/30 focus:border-cyan-500 focus:ring-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                    }`}
                    placeholder="Project Collaboration"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm font-medium animate-pulse">{errors.subject}</p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700">Message</label>
                    <span className={`text-xs font-medium ${messageLength > maxMessageLength * 0.8 ? 'text-red-500' : 'text-slate-500'}`}>
                      {messageLength}/{maxMessageLength}
                    </span>
                  </div>
                  <div
                    ref={messageRef}
                    contentEditable
                    suppressContentEditableWarning={true}
                    onInput={handleMessageInput}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`w-full min-h-[120px] max-h-[200px] px-4 py-3 bg-white/20 backdrop-blur-xl border rounded-xl placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 overflow-y-auto resize-none ${
                      errors.message 
                        ? 'border-red-300 focus:ring-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)] text-slate-900' 
                        : 'border-white/30 focus:border-cyan-500 focus:ring-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)] text-slate-400'
                    }`}
                  >
                    Your message here...
                  </div>
                  {errors.message && (
                    <p className="text-red-500 text-sm font-medium animate-pulse">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_20px_50px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        Send Message
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-gradient-to-r from-green-500 to-cyan-500 text-white p-6 rounded-2xl shadow-[0_20px_50px_rgba(34,197,94,0.3)] animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">Message Sent Successfully!</h3>
                    <p className="text-sm opacity-90">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="group bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/20 transition-all duration-500 transform hover:scale-105 hover:rotate-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${info.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12`}>
                      <info.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{info.title}</h3>
                      <p className="text-slate-600 group-hover:text-slate-700 transition-colors">{info.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Office Hours */}
            <div className="bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-3xl border border-white/30 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  isOfficeHours 
                    ? 'bg-gradient-to-r from-green-500 to-cyan-500' 
                    : 'bg-gradient-to-r from-slate-500 to-slate-600'
                }`}>
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Office Hours</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isOfficeHours ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium">
                      {isOfficeHours ? 'Currently Available' : 'Currently Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 mb-3">Monday - Friday: 9:00 AM - 5:00 PM PST</p>
              <p className="text-sm text-slate-500">Weekend messages will be responded to on Monday</p>
            </div>

            {/* Social Media */}
            <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Connect With Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-slate-600 ${social.color} transition-all duration-300 transform hover:scale-110 hover:rotate-12 hover:shadow-lg`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-[0_20px_50px_rgba(6,182,212,0.3)] transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Need Immediate Help?</h3>
                  <div className="flex items-center gap-1 text-sm opacity-90">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Our team is online now
                  </div>
                </div>
              </div>
              <button className="w-full bg-white/20 hover:bg-white/30 font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPageEnhanced;
