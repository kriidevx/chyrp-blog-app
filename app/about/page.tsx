'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Sparkles, Zap, Globe, Users, TrendingUp, Eye, Heart, MessageCircle, Share } from 'lucide-react'
import Link from 'next/link'
import PostCard from '@/components/PostCard'

// Mock data for demonstration
const featuredPosts = [
  {
    id: "1",
    title: "The Future of Web Development: AI-Powered Coding",
    excerpt: "Discover how artificial intelligence is revolutionizing the way we build web applications...",
    author: "Alex Chen",
    publishedAt: "2024-01-15",
    readTime: 8,
    views: 2540,
    likes: 89,
    comments: 23,
    tags: ["AI", "Web Development", "Future Tech"],
    image: "/api/placeholder/600/400",
    slug: "ai-powered-coding",
    created_at: "2024-01-15T00:00:00Z"
  },
  {
    id: "2",
    title: "Mastering Modern CSS: Grid, Flexbox, and Beyond",
    excerpt: "Learn advanced CSS techniques that will transform your frontend development skills...",
    author: "Sarah Johnson",
    publishedAt: "2024-01-12",
    readTime: 12,
    views: 1890,
    likes: 67,
    comments: 34,
    tags: ["CSS", "Frontend", "Design"],
    image: "/api/placeholder/600/400",
    slug: "modern-css-grid-flexbox",
    created_at: "2024-01-12T00:00:00Z"
  },
  {
    id: "3",
    title: "Building Scalable APIs with Next.js and Supabase",
    excerpt: "A comprehensive guide to creating robust backend solutions for modern applications...",
    author: "Mike Rodriguez",
    publishedAt: "2024-01-10",
    readTime: 15,
    views: 3120,
    likes: 124,
    comments: 45,
    tags: ["Next.js", "Supabase", "API"],
    image: "/api/placeholder/600/400",
    slug: "scalable-apis-nextjs-supabase",
    created_at: "2024-01-10T00:00:00Z"
  }
]

const trendingTags = [
  { name: "React", count: 245, color: "bg-blue-500" },
  { name: "Next.js", count: 189, color: "bg-black" },
  { name: "TypeScript", count: 167, color: "bg-blue-600" },
  { name: "AI", count: 134, color: "bg-purple-500" },
  { name: "CSS", count: 123, color: "bg-pink-500" },
  { name: "JavaScript", count: 98, color: "bg-yellow-500" },
  { name: "Design", count: 87, color: "bg-green-500" },
  { name: "Performance", count: 76, color: "bg-red-500" },
]

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary-400 rounded-full opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  )
}

// Typewriter effect component
function TypewriterText({ texts }: { texts: string[] }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const text = texts[currentTextIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < text.length) {
          setCurrentText(text.slice(0, currentText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(text.slice(0, currentText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? 50 : 150)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentTextIndex, texts])

  return (
    <span className="text-gradient font-bold">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Stats counter component
function StatsCounter({ end, label }: { end: number; label: string }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })

  useEffect(() => {
    if (inView) {
      let start = 0
      const duration = 2000
      const increment = end / (duration / 50)

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 50)

      return () => clearInterval(timer)
    }
  }, [inView, end])

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="text-4xl font-bold text-gradient mb-2">
        {count.toLocaleString()}+
      </div>
      <div className="text-gray-600 dark:text-gray-400 font-medium">{label}</div>
    </motion.div>
  )
}

export default function HomePage() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1000], [0, -200])
  const y2 = useTransform(scrollY, [0, 1000], [0, -400])
  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const scale = useTransform(scrollY, [0, 500], [1, 0.8])

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const y1Spring = useSpring(y1, springConfig)
  const y2Spring = useSpring(y2, springConfig)

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <FloatingParticles />
        
        {/* Background Elements */}
        <motion.div
          style={{ y: y2Spring }}
          className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-3xl scale-150"
        />
        
        <motion.div
          style={{ y: y1Spring }}
          className="absolute inset-0 bg-gradient-mesh opacity-50"
        />

        {/* Main Hero Content */}
        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 text-center max-w-6xl mx-auto px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-primary-400 animate-pulse" />
              <span className="text-sm font-medium">Welcome to the Future of Blogging</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-tight mb-6">
              Create. Share.{' '}
              <br />
              <TypewriterText texts={['Inspire.', 'Connect.', 'Innovate.', 'Transform.']} />
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
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
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-pink opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </Link>
              
              <Link href="/explore">
                <motion.button
                  className="btn-glass group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    Explore Posts
                    <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
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
            <StatsCounter end={10000} label="Articles Published" />
            <StatsCounter end={50000} label="Active Readers" />
            <StatsCounter end={500} label="Writers" />
            <StatsCounter end={25} label="Countries" />
          </motion.div>
        </div>
      </section>

      {/* Featured Posts Section */}
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
              Featured <span className="text-gradient">Stories</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the most engaging and insightful articles from our community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Tags Cloud */}
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
              Trending <span className="text-gradient">Topics</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore the hottest topics in our community
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
            viewport={{ once: true }}
          >
            {trendingTags.map((tag, index) => (
              <motion.div
                key={tag.name}
                className="group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/tag/${tag.name.toLowerCase()}`}>
                  <div className="glass px-6 py-3 rounded-full hover:scale-110 transition-all duration-300 cursor-pointer group-hover:shadow-glow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${tag.color} animate-pulse`} />
                      <span className="font-semibold text-white">{tag.name}</span>
                      <span className="text-sm text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                        {tag.count}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
  )
}