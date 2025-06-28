import React, { useEffect, useState, useRef, Suspense, lazy } from "react";
import "./App.css";

// Lazy load Spline for better performance
const Spline = lazy(() => import("@splinetool/react-spline"));

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [visibleEducationItems, setVisibleEducationItems] = useState(new Set());
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [isFloating, setIsFloating] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  
  const educationSectionRef = useRef(null);
  const educationItemsRef = useRef([]);
  const lastScrollY = useRef(window.scrollY);
  const vanishTimeout = useRef(null);
  const splineRef = useRef(null);
  const animationFrame = useRef(null);

  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const roles = [
    "Full Stack Developer",
    "Web Developer", 
    "Web Designer",
    "UI/UX Designer"
  ];

  // Optimized pointer movement handler
  const handlePointerMove = (e) => {
    if (!isDragging.current || !splineRef.current) return;
    
    const deltaX = (e.clientX || e.touches?.[0]?.clientX || 0) - lastPointer.current.x;
    const deltaY = (e.clientY || e.touches?.[0]?.clientY || 0) - lastPointer.current.y;
    
    // Throttle the movement for better performance
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      try {
        if (splineRef.current?.emitEvent) {
          splineRef.current.emitEvent('mouseMove', {
            x: deltaX * 0.5, // Reduce sensitivity for smoother movement
            y: deltaY * 0.5
          });
        }
      } catch (err) {
        console.log('Spline interaction not available');
      }
      
      lastPointer.current = { 
        x: e.clientX || e.touches?.[0]?.clientX || 0, 
        y: e.clientY || e.touches?.[0]?.clientY || 0 
      };
    }
  };

  // Spline loading handlers
  const handleSplineLoad = () => {
    setSplineLoaded(true);
    console.log('Spline scene loaded successfully');
  };

  const handleSplineError = (error) => {
    console.error('Spline loading error:', error);
    setSplineError(true);
  };

  // Independent glitch animation for role cycling
  useEffect(() => {
    const glitchTimeout = setTimeout(() => {
      setIsGlitching(true);
      setTimeout(() => {
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        setIsGlitching(false);
      }, 700);
    }, 5000);
    return () => clearTimeout(glitchTimeout);
  }, [currentRoleIndex, roles.length]);

  // Optimized scroll handler with RAF throttling
  useEffect(() => {
    let ticking = false;
    
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 50);
          
          // Determine if nav should float (not on home section)
          const homeSection = document.getElementById('home');
          if (homeSection) {
            const rect = homeSection.getBoundingClientRect();
            // If home section is mostly in view, use default nav
            if (rect.top > -0.5 * rect.height && rect.bottom < window.innerHeight + 0.5 * rect.height) {
              setIsFloating(false);
            } else {
              setIsFloating(true);
            }
          }
          
          // Show nav on scroll if floating
          if (isFloating) {
            setShowNav(true);
            if (vanishTimeout.current) clearTimeout(vanishTimeout.current);
            vanishTimeout.current = setTimeout(() => setShowNav(false), 5000);
          } else {
            setShowNav(true);
            if (vanishTimeout.current) clearTimeout(vanishTimeout.current);
          }
          
          // Handle education timeline scroll animation
          const educationSection = educationSectionRef.current;
          if (educationSection) {
            const rect = educationSection.getBoundingClientRect();
            const sectionHeight = educationSection.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // Calculate how much of the section is visible
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            
            if (sectionTop < windowHeight && sectionBottom > 0) {
              // Calculate progress through the section
              const visibleTop = Math.max(0, windowHeight - sectionTop);
              const visibleHeight = Math.min(visibleTop, sectionHeight, sectionBottom);
              const progress = Math.min(Math.max(visibleHeight / (sectionHeight * 0.8), 0), 1);
              
              setTimelineProgress(progress);
              
              // Check which education items should be visible
              const newVisibleItems = new Set();
              educationItemsRef.current.forEach((item, index) => {
                if (item) {
                  const itemRect = item.getBoundingClientRect();
                  const itemCenter = itemRect.top + itemRect.height / 2;
                  
                  // Make item visible when its center is in the viewport
                  if (itemCenter < windowHeight * 0.8) {
                    newVisibleItems.add(index);
                  }
                }
              });
              
              setVisibleEducationItems(newVisibleItems);
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Intersection Observer for section animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id));
          } else {
            setVisibleSections(prev => {
              const newSet = new Set(prev);
              newSet.delete(entry.target.id);
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-50px 0px -50px 0px'
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isFloating]);

  // Fallback 3D animation component using CSS
  const FallbackAnimation = () => (
    <div className="fallback-3d-container absolute top-0 right-0 w-full h-full overflow-hidden">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>
      <div className="gradient-orb"></div>
    </div>
  );

  // Loading placeholder for Spline
  const SplineLoader = () => (
    <div className="spline-loader absolute top-0 right-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="loader-content text-center">
        <div className="loading-spinner mb-4"></div>
        <p className="text-gray-400 text-sm">Loading 3D Scene...</p>
      </div>
    </div>
  );

  // Navigation content for both nav variants
  const navContent = (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-3 sm:py-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Logo */}
            <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rim rounded-full overflow-hidden shadow-lg transition-all duration-300 ${isScrolled ? 'bg-gray-700 scale-95 shadow-md' : 'bg-gray-800 shadow-lg'}`}> 
              <img
                src="/src/images/P-Logo.png"
                alt="TC Logo"
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
            </div>
            {/* Name */}
            <div className={`text-lg sm:text-2xl font-semibold text-white transition-all duration-300 ${isScrolled ? 'sm:text-xl' : ''} pulse-glow`}>
              <span className="hidden sm:inline">Thaveesha Sanjana</span>
              <span className="sm:hidden">Thaveesha</span>
            </div>
          </div>
          <ul className="hidden md:flex space-x-6 lg:space-x-8 text-sm lg:text-base font-medium">
            <li><a href="#home" className={`transition-all duration-300 hover:text-blue-400 nav-link ${isScrolled ? 'text-gray-200 hover:text-blue-300' : 'text-gray-300'}`}>Home</a></li>
            <li><a href="#about" className={`transition-all duration-300 hover:text-blue-400 nav-link ${isScrolled ? 'text-gray-200 hover:text-blue-300' : 'text-gray-300'}`}>About</a></li>
            <li><a href="#skills" className={`transition-all duration-300 hover:text-blue-400 nav-link ${isScrolled ? 'text-gray-200 hover:text-blue-300' : 'text-gray-300'}`}>Skills</a></li>
            <li><a href="#projects" className={`transition-all duration-300 hover:text-blue-400 nav-link ${isScrolled ? 'text-gray-200 hover:text-blue-300' : 'text-gray-300'}`}>Projects</a></li>
            <li><a href="#education" className={`transition-all duration-300 hover:text-blue-400 nav-link ${isScrolled ? 'text-gray-200 hover:text-blue-300' : 'text-gray-300'}`}>Education</a></li>
            <li><a href="#contact" className={`transition-all duration-300 hover:text-blue-400 nav-link ${isScrolled ? 'text-gray-200 hover:text-blue-300' : 'text-gray-300'}`}>Contact</a></li>
          </ul>
          {/* Mobile menu button */}
          <button className="md:hidden text-gray-300 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-800/50">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="font-sans bg-black text-white min-h-screen">
      {/* Navigation: both navs rendered, cross-fade and morph */}
      {/* Default nav (full-width) */}
      <nav
        className={`fixed w-full z-50 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${!isFloating ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
          ${isScrolled ? 'bg-black/95 backdrop-blur-md shadow-lg border-b border-gray-800' : 'bg-transparent'}
        `}
        style={{ willChange: 'opacity, transform' }}
      >
        {navContent}
      </nav>
      {/* Floating nav (rounded, centered) */}
      <nav
        className={`fixed left-1/2 top-6 transform -translate-x-1/2 z-50 rounded-2xl shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isFloating ? (showNav ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none') : 'opacity-0 scale-95 pointer-events-none'}
        ${isScrolled ? 'bg-black/95 backdrop-blur-md border border-gray-800' : 'bg-black/80'}
      `}
      style={{ minWidth: 'min(100vw, 1300px)', maxWidth: '98vw', willChange: 'opacity, transform' }}
    >
      {navContent}
    </nav>

    {/* 1. Hero Section */}
    <section 
      id="home" 
      className="min-h-[110vh] flex items-center justify-center relative pt-32 sm:pt-40 lg:pt-48 pb-20 sm:pb-28 lg:pb-36 overflow-hidden"
    >
      {/* 3D Animation Container */}
      <div
        className="hidden lg:block"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "60vw",
          height: "100%",
          zIndex: 0,
          cursor: isDragging.current ? "grabbing" : "grab",
          userSelect: "none"
        }}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => {
          if (e.touches.length === 2) e.preventDefault();
          if (isDragging.current) handlePointerMove(e);
        }}
        onMouseDown={(e) => {
          isDragging.current = true;
          lastPointer.current = { x: e.clientX, y: e.clientY };
        }}
        onMouseUp={() => {
          isDragging.current = false;
        }}
        onMouseMove={handlePointerMove}
        onMouseLeave={() => {
          isDragging.current = false;
          try {
            if (splineRef.current?.emitEvent) {
              splineRef.current.emitEvent('resetCamera');
            }
          } catch (err) {
            console.log('Spline camera reset not available');
          }
        }}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            isDragging.current = true;
            lastPointer.current = { 
              x: e.touches[0].clientX, 
              y: e.touches[0].clientY 
            };
          }
        }}
        onTouchEnd={() => {
          isDragging.current = false;
        }}
      >
        {/* Optimized Spline with fallback */}
        <Suspense fallback={<SplineLoader />}>
          {!splineError ? (
            <>
              {!splineLoaded && <SplineLoader />}
              <Spline
                scene="https://prod.spline.design/FlWRT5zVsJ41o2Ei/scene.splinecode"
                style={{ 
                  width: "100%", 
                  height: "100%",
                  opacity: splineLoaded ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out'
                }}
                ref={splineRef}
                onLoad={handleSplineLoad}
                onError={handleSplineError}
                renderOnDemand={true}
                dpr={Math.min(window.devicePixelRatio, 2)}
                linear={true}
                flat={true}
              />
            </>
          ) : (
            <FallbackAnimation />
          )}
        </Suspense>
      </div>

      {/* Main hero content grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center hero-content relative z-10">
        <div className="text-center lg:text-left z-10 order-2 lg:order-1">
          <div className="mb-8 sm:mb-10 flex justify-center lg:justify-start">
            <div className="w-36 h-36 sm:w-44 sm:h-44 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-gray-600 shadow-2xl profile-image bg-gray-800">
              <img
                src="/src/images/Thaveesha.jpg"
                alt="Profile"
                className="w-full h-full object-cover object-center filter brightness-110 contrast-105"
                loading="eager"
              />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Thaveesha Sanjana
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-3 sm:mb-4">
            <span
              className={`glitch-text${isGlitching ? ' glitch-active' : ''}`}
              data-text={roles[currentRoleIndex]}
            >
              {roles[currentRoleIndex]}
            </span>
          </p>
          <p className="text-base sm:text-lg text-gray-400 max-w-md lg:max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8 animate-fade-up px-4 lg:px-0 leading-relaxed">
            Crafting seamless, responsive web applications with modern technologies, 
            driven by a passion for clean code and exceptional user experiences.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 animate-scale-in px-4 lg:px-0">
            <a
              href="#"
              className="btn-primary cv-animated-btn w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 h-12 overflow-hidden relative"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 z-10 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span className="relative z-10">Download CV</span>
            </a>
            <div className="flex gap-3 sm:gap-4 justify-center lg:justify-start">
              {/* Social Links */}
              <a href="https://github.com/ThaveeshaS" target="_blank" rel="noopener noreferrer" className="social-link w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-900 hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-300 transform hover:scale-110 group">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="social-link w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-110 group">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/_thaveeya_s275?igsh=MXJicHhicmZhaXhrdw==" target="_blank" rel="noopener noreferrer" className="social-link w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 transform hover:scale-110 group">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* 2. About Section */}
    <section id="about" className={`py-16 sm:py-20 lg:py-24 bg-black relative transition-all duration-1000 ${visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-700 delay-200 ${visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">About Me</h2>
          <div className="w-16 sm:w-20 h-1 bg-blue-500 mx-auto section-divider"></div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className={`transition-all duration-700 delay-300 ${visibleSections.has('about') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-200">Who I Am</h3>
            <p className="text-gray-300 mb-6 leading-relaxed text-base sm:text-lg">
              Hi, I'm Thaveesha Sanjana.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed text-base sm:text-lg">
              I'm a dedicated full-stack developer with over 3 years of experience transforming complex challenges into elegant, user-friendly solutions. With a strong foundation in both front-end and back-end development, I craft scalable web and mobile applications using technologies including the MERN stack, Java, Spring Boot, and other modern frameworks.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed text-base sm:text-lg">
              I build robust, secure, and high-performance applications tailored to client needs. Passionate about continuous learning and innovation, I thrive in collaborative environments where ideas turn into impactful digital products.
            </p>
            <div className="space-y-3 sm:space-y-4">
              <div className={`flex items-center transition-all duration-500 delay-500 ${visibleSections.has('about') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-3 sm:mr-4"></div>
                <span className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-lg sm:text-xl">🎓</span>
                  Computer Science Graduate
                </span>
              </div>
              <div className={`flex items-center transition-all duration-500 delay-600 ${visibleSections.has('about') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-3 sm:mr-4"></div>
                <span className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-lg sm:text-xl">💼</span>
                  3+ Years Experience
                </span>
              </div>
              <div className={`flex items-center transition-all duration-500 delay-700 ${visibleSections.has('about') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-3 sm:mr-4"></div>
                <span className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-lg sm:text-xl">🌐</span>
                  Remote Friendly
                </span>
              </div>
            </div>
          </div>
          {/* Progress bars section */}
          <div className={`relative transition-all duration-700 delay-400 ${visibleSections.has('about') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="card bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-700 shadow-md">
              <div className="space-y-4 sm:space-y-6">
                <div className={`transition-all duration-500 delay-800 ${visibleSections.has('about') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-300">Frontend Development</span>
                    <span className="text-xs sm:text-sm text-blue-400 font-semibold">90%</span>
                  </div>
                  <div className="progress-bar w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
                    <div className={`progress-fill bg-blue-500 h-1.5 sm:h-2 rounded-full transition-all duration-1000 delay-900 ${visibleSections.has('about') ? 'w-[90%]' : 'w-0'}`}></div>
                  </div>
                </div>
                <div className={`transition-all duration-500 delay-1000 ${visibleSections.has('about') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-300">Backend Development</span>
                    <span className="text-xs sm:text-sm text-blue-400 font-semibold">85%</span>
                  </div>
                  <div className="progress-bar w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
                    <div className={`progress-fill bg-blue-500 h-1.5 sm:h-2 rounded-full transition-all duration-1000 delay-1100 ${visibleSections.has('about') ? 'w-[85%]' : 'w-0'}`}></div>
                  </div>
                </div>
                <div className={`transition-all duration-500 delay-1200 ${visibleSections.has('about') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-300">UI/UX Design</span>
                    <span className="text-xs sm:text-sm text-blue-400 font-semibold">80%</span>
                  </div>
                  <div className="progress-bar w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
                    <div className={`progress-fill bg-blue-500 h-1.5 sm:h-2 rounded-full transition-all duration-1000 delay-1300 ${visibleSections.has('about') ? 'w-[80%]' : 'w-0'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* 3. Skills Section */}
    <section id="skills" className={`py-16 sm:py-20 lg:py-24 bg-black relative transition-all duration-1000 ${visibleSections.has('skills') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-700 delay-200 ${visibleSections.has('skills') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Skills & Technologies</h2>
          <div className="w-16 sm:w-20 h-1 bg-blue-500 mx-auto section-divider"></div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            { 
              title: 'Frontend', 
              skills: [
                'HTML', 'CSS', 'JavaScript', 'React.js', 'Tailwind CSS', 'Bootstrap', 'Three.js'
              ] 
            },
            { 
              title: 'Backend', 
              skills: [
                'PHP', 'Node.js', 'Express.js', 'RESTful APIs', 'MongoDB', 'MySQL'
              ] 
            },
            { 
              title: 'Languages', 
              skills: [
                'C', 'C++', 'Java', 'Python', 'Kotlin', 'R'
              ] 
            },
            { 
              title: 'Tools', 
              skills: [
                'VS Code', 'Eclipse', 'Android Studio', 'Git', 'GitHub', 'Postman', 'Intellij', 'Figma', 'Firebase', 'linux'
              ] 
            }
          ].map((category, index) => (
            <div 
              key={category.title}
              className={`card text-center p-6 sm:p-8 bg-gray-800 rounded-xl border border-gray-700 shadow-md hover:shadow-lg transition-all duration-700 ${visibleSections.has('skills') ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
              style={{transitionDelay: `${300 + index * 200}ms`}}
            >
              <div className={`text-3xl sm:text-4xl mb-4 sm:mb-6 text-blue-400 transition-all duration-500 ${visibleSections.has('skills') ? 'scale-100 rotate-0' : 'scale-75 rotate-12'}`} style={{transitionDelay: `${500 + index * 200}ms`}}>{category.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-200">{category.title}</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {category.skills.map((skill, skillIndex) => (
                  <span 
                    key={skill} 
                    className={`skill-tag px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-900 text-blue-300 rounded-full text-xs sm:text-sm font-medium hover:bg-blue-800 transition-all duration-500 ${visibleSections.has('skills') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
                    style={{transitionDelay: `${700 + index * 100 + skillIndex * 100}ms`}}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* 4. Projects Section */}
    <section id="projects" className={`py-16 sm:py-20 lg:py-24 bg-black relative transition-all duration-1000 ${visibleSections.has('projects') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-700 delay-200 ${visibleSections.has('projects') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Featured Projects</h2>
          <div className="w-16 sm:w-20 h-1 bg-blue-500 mx-auto mb-4 section-divider"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
            Explore my recent projects showcasing my technical expertise and creativity.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((project, index) => (
            <div 
              key={project} 
              className={`project-card group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-md hover:shadow-lg transition-all duration-700 ${visibleSections.has('projects') ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
              style={{transitionDelay: `${300 + index * 200}ms`}}
            >
              <div className="project-image aspect-video bg-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl sm:text-4xl lg:text-5xl opacity-10 group-hover:opacity-20 transition-opacity">📂</div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-200 group-hover:text-blue-400 transition-colors">
                  Project {project}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-4 leading-relaxed">
                  A brief description of the project's purpose and the technologies used to build it.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="skill-tag px-2 py-1 sm:px-3 sm:py-1 bg-blue-900 text-blue-300 rounded-full text-xs font-medium">React</span>
                  <span className="skill-tag px-2 py-1 sm:px-3 sm:py-1 bg-blue-900 text-blue-300 rounded-full text-xs font-medium">Node.js</span>
                  <span className="skill-tag px-2 py-1 sm:px-3 sm:py-1 bg-blue-900 text-blue-300 rounded-full text-xs font-medium">MongoDB</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center sm:justify-start gap-1 py-2 sm:py-0">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    Live Demo
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center sm:justify-start gap-1 py-2 sm:py-0">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Source Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* 5. Education Section */}
    <section id="education" ref={educationSectionRef} className={`py-16 sm:py-20 lg:py-24 bg-black relative transition-all duration-1000 ${visibleSections.has('education') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-700 delay-200 ${visibleSections.has('education') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Education</h2>
          <div className="w-16 sm:w-20 h-1 bg-blue-500 mx-auto section-divider"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
            My educational journey that shaped my foundation in technology and development.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line - background */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gray-700 hidden sm:block"></div>
            
            {/* Timeline line - animated progress */}
            <div 
              className="absolute left-6 sm:left-8 top-0 w-0.5 bg-gradient-to-b from-blue-400 to-blue-600 hidden sm:block transition-all duration-300 ease-out"
              style={{
                height: `${timelineProgress * 100}%`,
                transformOrigin: 'top'
              }}
            ></div>
            
            {/* Mobile timeline indicator */}
            <div className="sm:hidden absolute left-4 top-0 bottom-0 w-px bg-gray-700"></div>
            <div 
              className="sm:hidden absolute left-4 top-0 w-px bg-gradient-to-b from-blue-400 to-blue-600 transition-all duration-300 ease-out"
              style={{
                height: `${timelineProgress * 100}%`,
                transformOrigin: 'top'
              }}
            ></div>
            
            <div className="space-y-8 sm:space-y-12">
              {[
                {
                  year: "2020 - 2024",
                  degree: "Bachelor of Science in Computer Science",
                  institution: "University of Colombo",
                  location: "Colombo, Sri Lanka",
                  description: "Specialized in Software Engineering and Web Development. Graduated with First Class Honors.",
                  achievements: [
                    "GPA: 3.8/4.0",
                    "Dean's List for 3 consecutive semesters",
                    "President of Computer Science Society",
                    "Winner of University Hackathon 2023"
                  ],
                  icon: "🎓"
                },
                {
                  year: "2018 - 2020",
                  degree: "Advanced Level (A/L)",
                  institution: "Royal College",
                  location: "Colombo, Sri Lanka",
                  description: "Completed Advanced Level in Mathematics, Physics, and Information & Communication Technology.",
                  achievements: [
                    "3 A's in Mathematics, Physics, ICT",
                    "Island Rank: 15th in ICT",
                    "School Captain - IT Society",
                    "Best Student in Computer Science"
                  ],
                  icon: "📚"
                },
                {
                  year: "2016 - 2018",
                  degree: "Ordinary Level (O/L)",
                  institution: "Royal College",
                  location: "Colombo, Sri Lanka",
                  description: "Completed Ordinary Level with distinction in Science and Mathematics subjects.",
                  achievements: [
                    "9 A's including Mathematics & Science",
                    "School Prefect",
                    "Mathematics Olympiad - 2nd Place",
                    "Science Fair - Gold Medal"
                  ],
                  icon: "🏅"
                }
              ].map((education, index) => (
                <div 
                  key={index}
                  ref={el => educationItemsRef.current[index] = el}
                  className={`relative transition-all duration-700 ${visibleEducationItems.has(index) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-3 sm:left-6 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-blue-500 rounded-full border-2 sm:border-3 md:border-4 border-gray-800 shadow-lg transition-all duration-500 ${visibleEducationItems.has(index) ? 'scale-100' : 'scale-0'}`}></div>
                  
                  <div className={`ml-6 sm:ml-12 md:ml-16 lg:ml-20 bg-gray-900 rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700 shadow-md hover:shadow-lg transition-all duration-700 ${visibleEducationItems.has(index) ? 'translate-y-0 scale-100' : 'translate-y-5 scale-95'}`}>
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div className="flex items-start mb-4 lg:mb-0">
                        <span className="text-2xl sm:text-3xl mr-3 sm:mr-4 flex-shrink-0">{education.icon}</span>
                        <div className="min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-1 leading-tight">
                            {education.degree}
                          </h3>
                          <p className="text-blue-400 font-semibold text-sm sm:text-base">
                            {education.institution}
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            {education.location}
                          </p>
                        </div>
                      </div>
                      <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-900 text-blue-300 rounded-full text-xs sm:text-sm font-medium self-start lg:self-auto">
                        {education.year}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                      {education.description}
                    </p>
                    
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold text-gray-200 mb-3">Key Achievements:</h4>
                      <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                        {education.achievements.map((achievement, achievementIndex) => (
                          <div 
                            key={achievementIndex}
                            className={`flex items-start transition-all duration-500 ${visibleEducationItems.has(index) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}
                            style={{transitionDelay: `${achievementIndex * 100}ms`}}
                          >
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 flex-shrink-0 mt-1.5 sm:mt-2"></div>
                            <span className="text-gray-300 text-xs sm:text-sm leading-relaxed">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* 6. Contact Section */}
    <section id="contact" className={`py-16 sm:py-20 lg:py-24 bg-black relative transition-all duration-1000 ${visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-700 delay-200 ${visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Get In Touch</h2>
          <div className="w-16 sm:w-20 h-1 bg-blue-500 mx-auto mb-4 section-divider"></div>
          <p className="text-gray-300 text-base sm:text-lg">
            Have a project in mind? Let's collaborate to bring your ideas to life.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          <div className={`space-y-6 sm:space-y-8 transition-all duration-700 delay-300 ${visibleSections.has('contact') ? 'opacity-100 -translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-200">Let's Connect</h3>
            <div className="space-y-4 sm:space-y-6">
              {[
                { icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', title: 'Email', value: 'thaveeshasanjanaofficial01@gmail.com' },
                { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', title: 'Phone', value: '(+94) 76 0918275' },
                { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', title: 'Location', value: 'Galle, Sri Lanka' }
              ].map((contact, index) => (
                <div 
                  key={contact.title}
                  className={`flex items-center transition-all duration-500 ${visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                  style={{transitionDelay: `${500 + index * 150}ms`}}
                >
                  <div className="contact-icon w-10 h-10 sm:w-12 sm:h-12 bg-blue-900 rounded-lg flex items-center justify-center mr-4 sm:mr-6 flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={contact.icon}></path>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-base sm:text-lg text-gray-200">{contact.title}</p>
                    <p className="text-gray-400 text-sm sm:text-base break-words">{contact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`space-y-4 sm:space-y-6 bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-xl border border-gray-700 shadow-md transition-all duration-700 delay-400 ${visibleSections.has('contact') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className={`transition-all duration-500 delay-600 ${visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
              <input
                type="text"
                placeholder="Your Name"
                className="form-input w-full px-4 py-2.5 sm:px-5 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-white placeholder-gray-400 text-sm sm:text-base"
              />
            </div>
            <div className={`transition-all duration-500 delay-700 ${visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
              <input
                type="email"
                placeholder="Your Email"
                className="form-input w-full px-4 py-2.5 sm:px-5 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-white placeholder-gray-400 text-sm sm:text-base"
              />
            </div>
            <div className={`transition-all duration-500 delay-800 ${visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
              <textarea
                placeholder="Your Message"
                rows="4"
                className="form-input w-full px-4 py-2.5 sm:px-5 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition-all resize-none text-white placeholder-gray-400 text-sm sm:text-base"
              ></textarea>
            </div>
            <div className={`transition-all duration-500 delay-900 ${visibleSections.has('contact') ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'}`}>
              <button
                type="button"
                className="w-full px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 btn-primary text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="footer py-8 sm:py-12 bg-black border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center animate-fade-up gap-4 md:gap-0">
          <div className="flex items-center gap-3 mb-2 md:mb-0">
            <img
              src="/src/images/P-Logo.png"
              alt="TC Logo"
              className="w-28 h-28 rounded-full shadow-lg"
            />
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Thaveesha Sanjana. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4 sm:space-x-6">
            {[
              { name: 'GitHub', path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
              { name: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
              { name: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' }
            ].map((social, index) => (
              <a 
                key={social.name}
                href={social.name === 'GitHub' ? 'https://github.com/ThaveeshaS' : social.name === 'Instagram' ? 'https://www.instagram.com/_thaveeya_s275?igsh=MXJicHhicmZhaXhrdw==' : '#'}
                target={social.name === 'GitHub' || social.name === 'Instagram' ? '_blank' : '_self'}
                rel={social.name === 'GitHub' || social.name === 'Instagram' ? 'noopener noreferrer' : ''} 
                className="footer-link text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1 sm:gap-2 animate-scale-in text-xs sm:text-sm"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">

                  <path d={social.path} />
                </svg>
                <span className="hidden sm:inline">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}

export default App;