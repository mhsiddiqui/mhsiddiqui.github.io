import { useEffect, useState } from 'react'
import bundledCv from '../data/cv.json'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Education from './components/Education'
import OpenSource from './components/OpenSource'
import Publications from './components/Publications'
import Contact from './components/Contact'

const CV_URL =
  'https://gist.githubusercontent.com/mhsiddiqui/f52714ad9a7ea9cd915b95e924860d28/raw/portfolio.json'

export default function App() {
  const [cv, setCv] = useState(bundledCv)

  useEffect(() => {
    console.log('[CV] Rendering with bundled fallback')
    const ctrl = new AbortController()
    fetch(CV_URL, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        console.log('[CV] Loaded from gist')
        setCv(data)
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          console.warn('[CV] Gist fetch failed, keeping bundled fallback:', err)
        }
      })
    return () => ctrl.abort()
  }, [])

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Navbar name={cv.personal_info.name} />
      <Hero personalInfo={cv.personal_info} contact={cv.contact} />
      <About aboutMe={cv.about_me} />
      <Skills skills={cv.skills} />
      <Experience experience={cv.experience} />
      <Projects projects={cv.projects} />
      <Education education={cv.education} />
      <OpenSource
        repos={cv.open_source_contributions}
        githubUrl={cv.contact.github}
      />
      <Publications publications={cv.publications} />
      <Contact contact={cv.contact} />
      <footer className="bg-neutral-900 py-8 text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} {cv.personal_info.name}. Built with React,
        Tailwind, and Framer Motion.
      </footer>
    </div>
  )
}
