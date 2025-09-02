import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ThemeToggle from '@/components/ThemeToggle'
import { SupabaseProviderClient } from '@/components/SupabaseProviderClient'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chyrp Blog - Modern Blogging Platform',
  description: 'A cutting-edge blogging platform with AI-powered features, real-time collaboration, and stunning visual effects.',
  keywords: 'blog, modern, AI, real-time, collaboration, Next.js, Supabase',
  authors: [{ name: 'Chyrp Team' }],
  creator: 'Chyrp Blog Platform',
  publisher: 'Chyrp',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Chyrp Blog - Modern Blogging Platform',
    description: 'A cutting-edge blogging platform with AI-powered features',
    url: 'https://chyrp-blog.vercel.app',
    siteName: 'Chyrp Blog',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Chyrp Blog Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chyrp Blog - Modern Blogging Platform',
    description: 'A cutting-edge blogging platform with AI-powered features',
    images: ['/twitter-image.jpg'],
    creator: '@chyrpblog',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token',
    yandex: 'verification_token',
  },
}

// Particles Component
function ParticlesBackground() {
  return (
    <div className="particles-container">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${20 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  )
}

// Progress Bar Component
function ProgressBar() {
  return <div id="progress-bar" className="progress-bar w-0" />
}

// Scroll Progress Script
const scrollProgressScript = `
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.style.width = scrollProgress + '%';
    }
  });
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} antialiased relative min-h-screen`}>
        <SupabaseProviderClient>
          {/* Progress Bar */}
          <ProgressBar />
          
          {/* Particles Background */}
          <ParticlesBackground />
          
          {/* Gradient Mesh Background */}
          <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none" />
          
          {/* Cyber Grid Background */}
          <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
          
          {/* Main Layout */}
          <div className="relative z-10 flex flex-col min-h-screen">
            {/* Navigation */}
            <Navbar />
            
            {/* Main Content */}
            <main className="flex-1 pt-20">
              {children}
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
          
          {/* Theme Toggle - Floating */}
          <div className="fixed bottom-6 right-6 z-50 no-print">
            <ThemeToggle />
          </div>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(17, 17, 17, 0.9)',
                color: '#ffffff',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f43f5e',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </SupabaseProviderClient>
        
        {/* Scroll Progress Script */}
        <script dangerouslySetInnerHTML={{ __html: scrollProgressScript }} />
        
        {/* Global Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Theme Detection
              if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
              } else {
                document.documentElement.classList.remove('dark')
              }
              
              // Smooth Scroll Polyfill for older browsers
              if (!('scrollBehavior' in document.documentElement.style)) {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
                document.head.appendChild(script);
              }
              
              // Performance Observer for monitoring
              if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                      console.log('FCP:', entry.startTime);
                    }
                    if (entry.name === 'largest-contentful-paint') {
                      console.log('LCP:', entry.startTime);
                    }
                  }
                });
                observer.observe({ type: 'paint', buffered: true });
                observer.observe({ type: 'largest-contentful-paint', buffered: true });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
