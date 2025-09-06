'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Code2, 
  Database, 
  Palette, 
  Users, 
  Target, 
  Zap, 
  Heart, 
  Award, 
  TrendingUp,
  Github,
  Calendar,
  Rocket,
  Monitor,
  Cloud,
  Layers,
  Sparkles
} from 'lucide-react'

export default function AboutPage() {
  const [counters, setCounters] = useState({
    commits: 0,
    features: 0,
    hours: 0,
    days: 0
  });
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Animated counters for development stats
  useEffect(() => {
    const targets = { commits: 127, features: 15, hours: 240, days: 7 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCounters({
        commits: Math.floor(targets.commits * easeOut),
        features: Math.floor(targets.features * easeOut),
        hours: Math.floor(targets.hours * easeOut),
        days: Math.floor(targets.days * easeOut)
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
      name: "Bhavya Chawat",
      role: "Backend & Database Engineer",
      bio: "Master of Supabase, architecting scalable backend systems and secure authentication flows",
      skills: ["Supabase", "Authentication", "Database Design", "API Development"],
      color: "from-blue-600 to-blue-500",
      specialty: "Database"
    },
    {
      name: "Kruthi Krishna",
      role: "Frontend & UI Developer",
      bio: "Tailwind CSS wizard crafting beautiful interfaces with shadcn/ui components and smooth animations",
      skills: ["Tailwind CSS", "shadcn/ui", "Animations", "Responsive Design"],
      color: "from-cyan-500 to-cyan-400",
      specialty: "Frontend"
    },
    {
      name: "Shreyas Sahoo",
      role: "Documentation & Strategy",
      bio: "Ensuring our codebase is well-documented and our development strategy stays on track",
      skills: ["Documentation", "Strategy", "Project Planning", "Code Review"],
      color: "from-blue-600 to-cyan-500",
      specialty: "Strategy"
    }
  ];

  const timeline = [
    { 
      day: "Day 1", 
      title: "Project Kickoff", 
      desc: "Analyzed legacy Chyrp codebase and planned modern architecture",
      status: "completed"
    },
    { 
      day: "Day 2-3", 
      title: "Foundation Setup", 
      desc: "Next.js 14 app router, Supabase integration, and Tailwind configuration",
      status: "completed"
    },
    { 
      day: "Day 4-5", 
      title: "Core Features", 
      desc: "User authentication, blog post CRUD, and real-time commenting system",
      status: "completed"
    },
    { 
      day: "Day 6", 
      title: "UI Polish", 
      desc: "Modern glassmorphism design, animations, and responsive layouts",
      status: "completed"
    },
    { 
      day: "Day 7", 
      title: "Final Touches", 
      desc: "Testing, optimization, and deployment preparation",
      status: "current"
    }
  ];

  const techStack = [
    { 
      name: "Next.js 14", 
      icon: Code2, 
      desc: "App Router with Server Components", 
      color: "from-blue-600 to-blue-500",
      usage: "Frontend Framework"
    },
    { 
      name: "Supabase", 
      icon: Database, 
      desc: "Database, Auth, Realtime & Storage", 
      color: "from-cyan-500 to-cyan-400",
      usage: "Backend as a Service"
    },
    { 
      name: "Tailwind CSS", 
      icon: Palette, 
      desc: "Utility-first styling with shadcn/ui", 
      color: "from-blue-600 to-cyan-500",
      usage: "UI & Styling"
    },
    { 
      name: "Vercel", 
      icon: Cloud, 
      desc: "Seamless deployment and hosting", 
      color: "from-cyan-500 to-blue-600",
      usage: "Deployment"
    }
  ];

  const achievements = [
    { 
      icon: Target, 
      title: "Legacy Modernized", 
      desc: "Successfully transformed outdated PHP codebase into modern React application",
      color: "from-blue-600 to-blue-500"
    },
    { 
      icon: Zap, 
      title: "Performance Boost", 
      desc: "Achieved 95+ Lighthouse scores with optimized loading and interactions",
      color: "from-cyan-500 to-cyan-400"
    },
    { 
      icon: Heart, 
      title: "User Experience", 
      desc: "Intuitive interface with smooth animations and responsive design",
      color: "from-blue-600 to-cyan-500"
    },
    { 
      icon: Award, 
      title: "Code Quality", 
      desc: "Clean, maintainable code following modern development practices",
      color: "from-cyan-500 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section with Animated Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-blue-600/10">
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(37,99,235,0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(6,182,212,0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 80%, rgba(37,99,235,0.1) 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full opacity-30"
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
              animate={{ y: [-20, 20, -20], opacity: [0.3, 0.7, 0.3] }}
              transition={{ 
                duration: 4 + i * 0.5, 
                repeat: Infinity, 
                delay: i * 0.5 
              }}
            />
          ))}
        </motion.div>

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
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-3xl border border-white/20 px-6 py-3 rounded-full mb-8">
              <span className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold">Clone Fest Week 1 • Chyrp Modernization</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black leading-tight mb-6">
              From Legacy to{' '}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Modern
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-900/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              In just 7 days, we're transforming the classic Chyrp blogging platform into a blazing-fast, 
              modern web application using Next.js 14, Supabase, and cutting-edge design principles.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(37,99,235,0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Live Demo
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              
              <motion.button
                className="bg-white/10 backdrop-blur-3xl border border-white/20 px-8 py-4 rounded-xl font-semibold group hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  Source Code
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1 h-16 bg-gradient-to-b from-blue-600 to-transparent rounded-full" />
        </motion.div>
      </section>

      {/* Development Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Week 1 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Progress</span>
            </h2>
            <p className="text-xl text-slate-900/70">Our development journey in numbers</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Git Commits', value: counters.commits, suffix: '+', icon: Github, color: 'from-blue-600 to-blue-500' },
              { label: 'Features Built', value: counters.features, suffix: '', icon: Sparkles, color: 'from-cyan-500 to-cyan-400' },
              { label: 'Hours Coded', value: counters.hours, suffix: '+', icon: Monitor, color: 'from-blue-600 to-cyan-500' },
              { label: 'Days Sprint', value: counters.days, suffix: '', icon: Calendar, color: 'from-cyan-500 to-blue-600' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-8 text-center group hover:bg-white/20 transition-all duration-500 hover:shadow-[0_35px_60px_-15px_rgba(37,99,235,0.2)] hover:scale-105 transform-gpu"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-full h-full text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-slate-900/70 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Dream Team</span>
            </h2>
            <p className="text-xl text-slate-900/70">Three developers, one week, infinite possibilities</p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-8 h-full group-hover:bg-white/20 transition-all duration-500 hover:shadow-[0_35px_60px_-15px_rgba(37,99,235,0.2)] hover:scale-105 transform-gpu">
                  {/* Avatar */}
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-xl bg-gradient-to-r ${member.color} p-5 group-hover:scale-110 transition-transform duration-300`}>
                    {member.specialty === 'Database' && <Database className="w-full h-full text-white" />}
                    {member.specialty === 'Frontend' && <Palette className="w-full h-full text-white" />}
                    {member.specialty === 'Strategy' && <Target className="w-full h-full text-white" />}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">{member.name}</h3>
                  <p className="text-cyan-600 font-semibold text-center mb-4">{member.role}</p>
                  <p className="text-slate-900/70 text-center mb-6 leading-relaxed">{member.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-sm font-medium text-slate-900 border border-white/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Modern Tech</span>
            </h2>
            <p className="text-xl text-slate-900/70">The cutting-edge stack driving our transformation</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-8 text-center group hover:bg-white/20 transition-all duration-500 hover:shadow-[0_35px_60px_-15px_rgba(37,99,235,0.2)] hover:scale-105 transform-gpu"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${tech.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                  <tech.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{tech.name}</h3>
                <p className="text-sm text-cyan-600 font-semibold mb-3">{tech.usage}</p>
                <p className="text-slate-900/70 text-sm">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Journey</span>
            </h2>
            <p className="text-xl text-slate-900/70">7 days of intense development and innovation</p>
          </motion.div>
          
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className="flex gap-8 items-start"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${
                  item.status === 'completed' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500' 
                    : item.status === 'current'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 animate-pulse'
                    : 'bg-slate-300'
                } flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                
                <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-xl p-6 flex-1 group hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-700 rounded-full text-sm font-medium">
                      {item.day}
                    </span>
                  </div>
                  <p className="text-slate-900/70">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              What We've <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Achieved</span>
            </h2>
            <p className="text-xl text-slate-900/70">Transforming legacy into excellence</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-8 text-center group hover:bg-white/20 transition-all duration-500 hover:shadow-[0_35px_60px_-15px_rgba(37,99,235,0.2)] hover:scale-105 transform-gpu"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${achievement.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                  <achievement.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{achievement.title}</h3>
                <p className="text-slate-900/70 text-sm">{achievement.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            className="bg-white/10 backdrop-blur-3xl border border-white/20 p-12 rounded-3xl relative overflow-hidden group hover:bg-white/20 transition-all duration-500"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-500/5 group-hover:from-blue-600/10 group-hover:to-cyan-500/10 transition-all duration-500" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Future of Blogging</span>
              </h2>
              <p className="text-xl text-slate-900/70 mb-8 max-w-2xl mx-auto">
                From a 2008 PHP application to a cutting-edge Next.js platform - witness the transformation that's redefining what blogging can be.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(37,99,235,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Rocket className="w-5 h-5" />
                  Try Live Demo
                </motion.button>
                
                <motion.button
                  className="bg-white/10 backdrop-blur-3xl border border-white/20 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-5 h-5" />
                  View Source Code
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 