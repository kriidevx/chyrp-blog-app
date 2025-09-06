'use client';

import React from 'react';
import { Github, Twitter, Linkedin, Mail, Heart, Zap, ArrowUp, ExternalLink } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub', color: 'hover:text-gray-300' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-500' },
    { icon: Mail, href: '#', label: 'Email', color: 'hover:text-red-400' },
  ];

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Admin', href: '/admin' },
      ]
    },
    {
      title: 'Content',
      links: [
        { name: 'Latest Posts', href: '/posts' },
        { name: 'Categories', href: '/categories' },
        { name: 'Tags', href: '/tags' },
        { name: 'Archive', href: '/archive' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'API', href: '/api' },
        { name: 'RSS Feed', href: '/rss' },
        { name: 'Sitemap', href: '/sitemap.xml' },
      ]
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-black border-t border-cyan-500/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-600/5 to-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6 group cursor-pointer">
              <div className="relative">
                <Zap className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 h-8 w-8 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 tracking-tighter">
                ChyrpBlog
              </span>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              A next-generation blogging platform with cyberpunk aesthetics and cutting-edge features.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={`p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:border-cyan-400/50 backdrop-blur-xl group`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-pink-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, sectionIndex) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-lg font-bold text-white mb-6 relative">
                {section.title}
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-400"></div>
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-cyan-400 transition-all duration-300 flex items-center group"
                      style={{ animationDelay: `${(sectionIndex * 4 + linkIndex) * 0.05}s` }}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                      <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="py-8 border-t border-slate-800/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Posts Published', value: '1,234', color: 'from-cyan-400 to-blue-500' },
              { label: 'Active Readers', value: '12.5K', color: 'from-purple-400 to-pink-500' },
              { label: 'Comments', value: '8,976', color: 'from-green-400 to-emerald-500' },
              { label: 'Countries', value: '45+', color: 'from-orange-400 to-red-500' },
            ].map((stat, index) => (
              <div key={stat.label} className="group">
                <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>© 2024 ChyrpBlog. Made with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>and lots of caffeine ☕</span>
          </div>

          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-300">
              Terms of Service
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-xl text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 group"
            >
              <ArrowUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Glowing Line Effect */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
      </div>

      {/* Particle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;
