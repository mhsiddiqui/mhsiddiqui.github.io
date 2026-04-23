import { useEffect, useState } from 'react'
import bundledPortfolio from '../data/portfolio.json'
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

const CV_URL = import.meta.env.VITE_CV_URL || null

function mergeWithBundled(remote) {
  const merged = { ...bundledPortfolio, ...remote }
  for (const key of Object.keys(bundledPortfolio)) {
    const base = bundledPortfolio[key]
    const incoming = remote[key]
    if (
      base &&
      typeof base === 'object' &&
      !Array.isArray(base) &&
      incoming &&
      typeof incoming === 'object' &&
      !Array.isArray(incoming)
    ) {
      merged[key] = { ...base, ...incoming }
    }
  }
  return merged
}

export default function App() {
  const [cv, setCv] = useState(bundledPortfolio)

  useEffect(() => {
    if (!CV_URL) return

    console.log('[CV] Fetching remote data...')
    const ctrl = new AbortController()
    fetch(CV_URL, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        console.log('[CV] Loaded from remote source')
        setCv(mergeWithBundled(data))
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          console.warn('[CV] Remote fetch failed, using bundled portfolio:', err)
        }
      })
    return () => ctrl.abort()
  }, [])

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Navbar name={cv.personal_info.short_name} />
      <Hero cv={cv} personalInfo={cv.personal_info} contact={cv.contact} />
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
      <Contact contact={cv.contact} strings={cv.strings} />
      <footer className="bg-neutral-900 py-8 text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} {cv.personal_info.name}. {cv.strings.footer_text}
      </footer>
    </div>
  )
}
