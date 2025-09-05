'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Code2, Database, Palette, Users, Target, Zap, Heart, Award, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const [counters, setCounters] = useState({
    users: 0,
    posts: 0,
    comments: 0,
    countries: 0
  });
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Animated counters
  useEffect(() => {
    const targets = { users: 2847, posts: 15692, comments: 42156, countries: 89 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCounters({
        users: Math.floor(targets.users * easeOut),
        posts: Math.floor(targets.posts * easeOut),
        comments: Math.floor(targets.comments * easeOut),
        countries: Math.floor(targets.countries * easeOut)
      });
      
      if (step >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      bio: "Former Google engineer with 10+ years in scalable systems",
      image: "/api/placeholder/150/150",
      skills: ["Leadership", "Architecture", "Strategy"]
    },
    {
      name: "Mike Rodriguez",
      role: "CTO",
      bio: "Full-stack developer passionate about modern web technologies",
      image: "/api/placeholder/150/150",
      skills: ["Next.js", "TypeScript", "DevOps"]
    },
    {
      name: "Emma Johnson",
      role: "Head of Design",
      bio: "UX/UI designer creating intuitive and beautiful experiences",
      image: "/api/placeholder/150/150",
      skills: ["Design Systems", "User Research", "Prototyping"]
    },
    {
      name: "Alex Kim",
      role: "Lead Engineer",
      bio: "Backend specialist focused on performance and reliability",
      image: "/api/placeholder/150/150",
      skills: ["Database Design", "API Development", "Security"]
    }
  ];

  const timeline = [
    { year: "2022", title: "Founded", desc: "Chyrp Blog was born from a vision to modernize blogging" },
    { year: "2023", title: "Beta Launch", desc: "Released private beta to 100 selected creators" },
    { year: "2023", title: "Public Launch", desc: "Opened platform to the public with core features" },
    { year: "2024", title: "Growth", desc: "Reached 2,000+ active creators and 15,000+ posts" },
    { year: "2024", title: "Today", desc: "Continuously innovating with AI-powered features" }
  ];

  const techStack = [
    { name: "Next.js", icon: Code2, desc: "React framework for production", color: "from-blue-600 to-blue-500" },
    { name: "Supabase", icon: Database, desc: "Open source Firebase alternative", color: "from-cyan-500 to-cyan-400" },
    { name: "Tailwind", icon: Palette, desc: "Utility-first CSS framework", color: "from-blue-600 to-cyan-500" }
  ];

  const values = [
    { 
      icon: Target, 
      title: "Purpose-Driven", 
      desc: "We believe every story matters and deserves to be heard",
      color: "from-blue-600 to-blue-500"
    },
    { 
      icon: Zap, 
      title: "Innovation", 
      desc: "Constantly pushing the boundaries of what's possible in blogging",
      color: "from-cyan-500 to-cyan-400"
    },
    { 
      icon: Heart, 
      title: "Community First", 
      desc: "Building tools that bring creators and readers together",
      color: "from-blue-600 to-cyan-500"
    },
    { 
      icon: Award, 
      title: "Excellence", 
      desc: "Committed to delivering the highest quality experience",
      color: "from-cyan-500 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-cyan-600/20 to-blue-600/20 rounded-full blur-3xl scale-150"
          animate={{ y: [-20, 20, -20], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Main Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-6xl mx-auto px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
              <span className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Our Story</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-tight mb-6">
              Create. Share.{' '}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Inspire.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-900/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the next generation of blogging with AI-powered features, 
              real-time collaboration, and stunning visual effects that bring your stories to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/post/new">
                <motion.button
                  className="btn-primary group relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Writing
                    <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </Link>
              
              <Link href="/explore">
                <motion.button
                  className="btn-glass group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    Learn More
                    <Award className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1 h-16 bg-gradient-to-b from-primary-400 to-transparent rounded-full" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { label: 'Active Creators', value: counters.users, suffix: '+', icon: Users },
              { label: 'Posts Published', value: counters.posts, suffix: '+', icon: TrendingUp },
              { label: 'Comments', value: counters.comments, suffix: '+', icon: Heart },
              { label: 'Countries', value: counters.countries, suffix: '', icon: Award }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-8 transform-gpu hover:scale-110 transition-all duration-500 hover:shadow-[0_35px_60px_-15px_rgba(37,99,235,0.3)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <stat.icon className="w-12 h-12 text-cyan-500 mx-auto mb-4 animate-float" />
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-slate-900/70 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Team Members Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Meet Our Team
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group relative h-80 perspective-1000"
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                  activeCard === index ? 'rotate-y-180' : ''
                }`}>
                  {/* Front of card */}
                  <div className="absolute inset-0 w-full h-full backface-hidden bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center transform-gpu hover:shadow-[0_35px_60px_-15px_rgba(37,99,235,0.3)]">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 mb-4 flex items-center justify-center text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{member.name}</h3>
                    <p className="text-cyan-600 font-semibold text-center">{member.role}</p>
                  </div>

                  {/* Back of card */}
                  <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-600/20 to-cyan-500/20 backdrop-blur-3xl border border-white/20 rounded-2xl p-6 transform rotate-y-180">
                    <p className="text-slate-900 mb-4 text-sm leading-relaxed">{member.bio}</p>
                    <div className="space-y-2">
                      {member.skills.map((skill, skillIndex) => (
                        <div
                          key={skillIndex}
                          className="inline-block px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-xs font-medium text-slate-900 mr-2"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Why Choose <span className="text-gradient">Chyrp?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Built with Next.js 14 and optimized for speed and performance"
              },
              {
                icon: Users,
                title: "Real-time Collaboration",
                description: "Work together with live editing, comments, and reactions"
              },
              {
                icon: TrendingUp,
                title: "AI-Powered Insights",
                description: "Get smart suggestions and analytics to grow your audience"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass p-8 rounded-2xl text-center card-hover group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <feature.icon className="w-16 h-16 mx-auto mb-6 text-primary-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            className="glass p-12 rounded-3xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Start Your <span className="text-gradient">Journey?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of writers who are already creating amazing content
            </p>
            <Link href="/auth/signup">
              <motion.button
                className="btn-primary text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Free
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}









