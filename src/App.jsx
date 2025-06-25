import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans bg-gray-50 text-gray-900 min-h-screen">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 navbar ${isScrolled ? 'scrolled' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-semibold text-gray-900 pulse-glow">
              Thaveesha Sanjana
            </div>
            <ul className="hidden md:flex space-x-10 text-base font-medium">
              <li><a href="#home" className="text-gray-600 hover:text-blue-600 transition-colors nav-link">Home</a></li>
              <li><a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors nav-link">About</a></li>
              <li><a href="#projects" className="text-gray-600 hover:text-blue-600 transition-colors nav-link">Projects</a></li>
              <li><a href="#skills" className="text-gray-600 hover:text-blue-600 transition-colors nav-link">Skills</a></li>
              <li><a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors nav-link">Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative">
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 hero-content">
          <div className="mb-10">
            <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg profile-image floating">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Thaveesha Sanjana
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 typewriter">Full Stack Developer</p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8 animate-fade-up">
            Crafting seamless, responsive web applications with modern technologies, 
            driven by a passion for clean code and exceptional user experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <a href="#projects" className="btn-primary px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all">
              View My Work
            </a>
            <a href="#contact" className="btn-secondary px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-all">
              Get In Touch
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">About Me</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto section-divider"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-left">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Who I Am</h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                I'm a dedicated full-stack developer with over 3 years of experience, 
                transforming complex challenges into elegant, user-friendly solutions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center animate-fade-up" style={{animationDelay: '0.1s'}}>
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                  <span className="text-gray-600 flex items-center gap-2">
                    <span className="text-xl">🎓</span>
                    Computer Science Graduate
                  </span>
                </div>
                <div className="flex items-center animate-fade-up" style={{animationDelay: '0.2s'}}>
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                  <span className="text-gray-600 flex items-center gap-2">
                    <span className="text-xl">💼</span>
                    3+ Years Experience
                  </span>
                </div>
                <div className="flex items-center animate-fade-up" style={{animationDelay: '0.3s'}}>
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                  <span className="text-gray-600 flex items-center gap-2">
                    <span className="text-xl">🌍</span>
                    Remote Friendly
                  </span>
                </div>
              </div>
            </div>
            <div className="relative animate-slide-right">
              <div className="card bg-white rounded-xl p-8 border border-gray-200 shadow-md">
                <div className="space-y-6">
                  <div className="animate-fade-up" style={{animationDelay: '0.4s'}}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Frontend Development</span>
                      <span className="text-sm text-blue-600 font-semibold">90%</span>
                    </div>
                    <div className="progress-bar w-full bg-gray-200 rounded-full h-2">
                      <div className="progress-fill bg-blue-600 h-2 rounded-full" style={{width: '90%'}}></div>
                    </div>
                  </div>
                  <div className="animate-fade-up" style={{animationDelay: '0.5s'}}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Backend Development</span>
                      <span className="text-sm text-blue-600 font-semibold">85%</span>
                    </div>
                    <div className="progress-bar w-full bg-gray-200 rounded-full h-2">
                      <div className="progress-fill bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div className="animate-fade-up" style={{animationDelay: '0.6s'}}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">UI/UX Design</span>
                      <span className="text-sm text-blue-600 font-semibold">80%</span>
                    </div>
                    <div className="progress-bar w-full bg-gray-200 rounded-full h-2">
                      <div className="progress-fill bg-blue-600 h-2 rounded-full" style={{width: '80%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-gray-100 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Featured Projects</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-4 section-divider"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Explore my recent projects showcasing my technical expertise and creativity.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((project, index) => (
              <div 
                key={project} 
                className="project-card group relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 animate-scale-in"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="project-image aspect-video bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl opacity-10 group-hover:opacity-20 transition-opacity floating">💻</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                    Project {project}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    A brief description of the project's purpose and the technologies used to build it.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="skill-tag px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">React</span>
                    <span className="skill-tag px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">Node.js</span>
                    <span className="skill-tag px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">MongoDB</span>
                  </div>
                  <div className="flex space-x-4">
                    <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                      Live Demo
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Skills & Technologies</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto section-divider"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🎨', title: 'Frontend', skills: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'Next.js'] },
              { icon: '⚙️', title: 'Backend', skills: ['Node.js', 'Python', 'Express', 'MongoDB', 'PostgreSQL'] },
              { icon: '🛠️', title: 'Tools', skills: ['Git', 'Docker', 'AWS', 'Figma', 'VS Code'] }
            ].map((category, index) => (
              <div 
                key={category.title}
                className="card text-center p-8 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 animate-scale-in"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="text-4xl mb-6 text-blue-600 floating">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-6 text-gray-800">{category.title}</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {category.skills.map((skill, skillIndex) => (
                    <span 
                      key={skill} 
                      className="skill-tag px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-200 transition-all"
                      style={{animationDelay: `${index * 0.2 + skillIndex * 0.1}s`}}
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

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-100 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Get In Touch</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-4 section-divider"></div>
            <p className="text-gray-600 text-lg">
              Have a project in mind? Let's collaborate to bring your ideas to life.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8 animate-slide-left">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Let's Connect</h3>
              <div className="space-y-6">
                {[
                  { icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', title: 'Email', value: 'john.doe@example.com' },
                  { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', title: 'Phone', value: '+1 (555) 123-4567' },
                  { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', title: 'Location', value: 'New York, NY' }
                ].map((contact, index) => (
                  <div 
                    key={contact.title}
                    className="flex items-center animate-fade-up"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="contact-icon w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-6">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={contact.icon}></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-gray-800">{contact.title}</p>
                      <p className="text-gray-600">{contact.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6 bg-white p-8 rounded-xl border border-gray-200 shadow-md animate-slide-right">
              <div className="animate-fade-up" style={{animationDelay: '0.1s'}}>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="form-input w-full px-5 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div className="animate-fade-up" style={{animationDelay: '0.2s'}}>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="form-input w-full px-5 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div className="animate-fade-up" style={{animationDelay: '0.3s'}}>
                <textarea
                  placeholder="Your Message"
                  rows="5"
                  className="form-input w-full px-5 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition-all resize-none text-gray-900 placeholder-gray-400"
                ></textarea>
              </div>
              <div className="animate-fade-up" style={{animationDelay: '0.4s'}}>
                <button
                  type="button"
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 btn-primary"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <footer className="footer py-12 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center animate-fade-up">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} John Doe. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {[
                { name: 'GitHub', path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
                { name: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                { name: 'Twitter', path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' }
              ].map((social, index) => (
                <a 
                  key={social.name}
                  href="#" 
                  className="footer-link text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 animate-scale-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.path}/>
                  </svg>
                  {social.name}
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