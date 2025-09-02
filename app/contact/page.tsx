"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  Calendar,
  ExternalLink,
  Zap,
  Sparkles,
  CheckCircle,
  Globe,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      detail: "admin@chyrpmodernized.com",
      link: "mailto:admin@chyrpmodernized.com",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Phone",
      detail: "+91 98765 43210",
      link: "tel:+919876543210",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Location",
      detail: "RVCE Campus, Bengaluru, India",
      link: "https://maps.google.com",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Hours",
      detail: "Mon - Fri: 9:00 AM - 6:00 PM",
    },
  ];

  const socialMedia = [
    {
      icon: <Github className="w-6 h-6" />,
      link: "https://github.com",
      label: "GitHub",
    },
    {
      icon: <Twitter className="w-6 h-6" />,
      link: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      link: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      link: "https://chyrpmodernized.com",
      label: "Website",
    },
  ];

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => setIsSubmitted(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 text-sm font-medium text-cyan-400 bg-cyan-400/10 rounded-full border border-cyan-400/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Get in Touch
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Contact <span className="text-cyan-400">Us</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Reach out
            through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-400/30 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-cyan-400/10 text-cyan-400 group-hover:scale-110 transition-transform">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">{info.title}</p>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-white font-medium hover:text-cyan-400 transition-colors inline-flex items-center"
                        >
                          {info.detail}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      ) : (
                        <p className="text-white font-medium">{info.detail}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
                Schedule a Meeting
              </h3>
              <p className="text-slate-400 mb-4">
                Book a convenient time to discuss your requirements in detail.
              </p>
              <a
                href="https://calendly.com"
                target="_blank"
                className="inline-flex items-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-colors"
              >
                Book Now <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>

            <div className="flex space-x-4">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-cyan-400" />
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-400 mb-1"
                >
                  Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-400 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-400 mb-1"
                >
                  Message
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    placeholder="Your message..."
                    required
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Zap className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
            {isSubmitted && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-2" />
                Message sent successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
