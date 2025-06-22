import React from "react";

function App() {
  return (
    <div className="font-sans scroll-smooth bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur shadow z-10">
        <ul className="flex justify-center space-x-8 py-4 text-lg font-medium">
          <li><a href="#home" className="hover:text-blue-600 transition">Home</a></li>
          <li><a href="#projects" className="hover:text-blue-600 transition">Projects</a></li>
          <li><a href="#skills" className="hover:text-blue-600 transition">Skills</a></li>
          <li><a href="#resume" className="hover:text-blue-600 transition">Resume</a></li>
          <li><a href="#contact" className="hover:text-blue-600 transition">Contact</a></li>
        </ul>
      </nav>

      {/* Home / About Me */}
      <section id="home" className="min-h-screen flex flex-col justify-center items-center pt-32 pb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text">
          Your Name
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl text-center mb-6">
          Brief introduction about yourself. Passionate developer, creative thinker, and lifelong learner.
        </p>
        <a href="#contact" className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition">
          Contact Me
        </a>
      </section>

      {/* Projects */}
      <section id="projects" className="min-h-screen flex flex-col justify-center items-center bg-white py-20">
        <h2 className="text-4xl font-bold mb-10 text-blue-600">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div className="p-6 bg-gradient-to-br from-blue-100 to-white rounded-xl shadow hover:scale-105 transition">
            <h3 className="text-2xl font-semibold mb-2">Project 1</h3>
            <p className="text-gray-600">Short description of your project.</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-blue-100 to-white rounded-xl shadow hover:scale-105 transition">
            <h3 className="text-2xl font-semibold mb-2">Project 2</h3>
            <p className="text-gray-600">Short description of your project.</p>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-white py-20">
        <h2 className="text-4xl font-bold mb-10 text-blue-600">Skills</h2>
        <ul className="flex flex-wrap gap-4 justify-center">
          <li className="bg-white px-6 py-3 rounded-full shadow text-blue-600 font-semibold">JavaScript</li>
          <li className="bg-white px-6 py-3 rounded-full shadow text-blue-600 font-semibold">React</li>
          <li className="bg-white px-6 py-3 rounded-full shadow text-blue-600 font-semibold">Tailwind CSS</li>
        </ul>
      </section>

      {/* Resume / CV Download */}
      <section id="resume" className="min-h-screen flex flex-col justify-center items-center bg-white py-20">
        <h2 className="text-4xl font-bold mb-10 text-blue-600">Resume</h2>
        <a
          href="/resume.pdf"
          download
          className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-8 py-4 rounded-full shadow-lg hover:from-blue-600 hover:to-teal-500 transition font-semibold"
        >
          Download CV
        </a>
      </section>

      {/* Contact Form */}
      <section id="contact" className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-white py-20">
        <h2 className="text-4xl font-bold mb-10 text-blue-600">Contact</h2>
        <form className="flex flex-col space-y-4 w-full max-w-md bg-white p-8 rounded-xl shadow">
          <input className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" type="text" placeholder="Name" required />
          <input className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" type="email" placeholder="Email" required />
          <textarea className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Message" required />
          <button className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition font-semibold" type="submit">
            Send
          </button>
        </form>
      </section>
    </div>
  );
}

export default App;