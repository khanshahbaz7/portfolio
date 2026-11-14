import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'About', href: '#about' },
]

const skillsData = [
  {
    category: 'Frontend',
    icon: 'code',
    items: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS'],
  },
  {
    category: 'Backend',
    icon: 'server',
    items: ['Node.js', 'Express.js', 'REST APIs', 'MongoDB'],
  },
  {
    category: 'MERN Stack',
    icon: 'layers',
    items: ['MongoDB', 'Express', 'React', 'Node.js'],
  },
  {
    category: 'AI / ML',
    icon: 'cpu',
    items: ['Python', 'Machine Learning', 'TensorFlow', 'scikit-learn'],
  },
  {
    category: 'Cloud & Tools',
    icon: 'cloud',
    items: ['AWS', 'Git', 'GitHub', 'Vite', 'Postman'],
  },
  {
    category: 'Databases',
    icon: 'database',
    items: ['MongoDB', 'MySQL', 'PostgreSQL'],
  },
]

const projects = [
  {
    title: 'Portfolio Website',
    description:
      'A responsive personal portfolio built with Next.js and Tailwind CSS, featuring project galleries, an interactive resume, and a contact form backed by server actions.',
    tags: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    title: 'TaskFlow — Project Management App',
    description:
      'A full-stack MERN application for team task management with drag-and-drop boards, role-based access, and live updates over WebSockets.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js'],
  },
  {
    title: 'ShopVerse — E-Commerce Store',
    description:
      'A Next.js storefront with cart, checkout, and payments, using App Router server components and MongoDB for catalog and order management.',
    tags: ['Next.js', 'MongoDB', 'Stripe API'],
  },
  {
    title: 'StudyBuddy — AI Notes Assistant',
    description:
      'A web app that summarizes lecture notes and generates practice quizzes, built with the MERN stack and an LLM API integration.',
    tags: ['React', 'Node.js', 'Google AI'],
  },
]

const certificates = [
  {
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    description:
      'Foundational certification covering AWS core services, cloud architecture principles, security, and billing models.',
  },
  {
    title: 'Google AI Essentials',
    issuer: 'Google',
    description:
      'Hands-on certificate on applying AI tools and generative AI workflows responsibly to everyday and professional tasks.',
  },
  {
    title: 'MongoDB Associate Developer',
    issuer: 'MongoDB University',
    description:
      'Certification in building applications with MongoDB — data modeling, aggregation pipelines, and Atlas operations.',
  },
]

const aboutFacts = [
  { label: 'Degree', value: 'B.Tech — CSE (AI & ML)' },
  { label: 'College', value: 'RCET, Bhilai' },
  { label: 'Focus', value: 'Full-Stack Web Development' },
  { label: 'Stack', value: 'MERN + Next.js' },
]

function Icon({ name, className = 'h-5 w-5' }) {
  const paths = {
    code: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
    server: (
      <>
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <path d="M6 6h.01M6 18h.01" />
      </>
    ),
    layers: (
      <>
        <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
        <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
        <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
      </>
    ),
    cpu: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M15 2v2M15 20v2M9 2v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" />
      </>
    ),
    cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
    database: (
      <>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14a9 3 0 0 0 18 0V5" />
        <path d="M3 12a9 3 0 0 0 18 0" />
      </>
    ),
  }
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false })
  const suppressSpyUntil = useRef(0)
  const tabsRef = useRef(null)

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.slice(1))

    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      if (Date.now() < suppressSpyUntil.current) return

      // Pick the last section whose top has passed ~30% down the viewport
      const y = window.scrollY + window.innerHeight * 0.3
      let current = 'home'
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= y) current = id
      }
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      if (atBottom) current = 'about'
      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Measure the highlight pill against the active tab (pill state only).
  // The highlight slides between tabs via CSS left/width transitions; the
  // short rAF loop keeps it tracking while the navbar morph animation runs.
  useLayoutEffect(() => {
    if (!scrolled) return

    let raf
    const update = () => {
      const li = tabsRef.current?.querySelector(`[data-tab="${active}"]`)
      if (!li) return
      setPill({ left: li.offsetLeft, width: li.offsetWidth, ready: true })
    }
    update()
    const start = performance.now()
    const loop = (t) => {
      update()
      if (t - start < 800) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('resize', update, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', update)
    }
  }, [active, scrolled])

  const handleNavClick = (id) => {
    // Highlight instantly on click; pause the spy briefly so sections
    // passed through during the smooth scroll don't flicker the highlight
    suppressSpyUntil.current = Date.now() + 1000
    setActive(id)
  }

  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 px-0 transition-[padding-top] duration-300 ${
        scrolled ? 'pt-4 sm:px-6' : 'pt-0 sm:px-0'
      }`}
    >
      <nav
        className={`liquid-glass pointer-events-auto mx-auto flex items-center justify-center transition-all duration-500 ease-in-out ${
          scrolled
            ? 'max-w-lg rounded-full px-5 py-3'
            : 'w-full max-w-full rounded-none px-6 py-5 lg:px-10 navbar-transparent'
        }`}
      >
        <ul
          ref={tabsRef}
          className={`relative flex items-center text-base transition-all duration-500 ${
            scrolled ? 'gap-1.5 font-bold' : 'gap-6 font-medium'
          }`}
        >
          {scrolled && pill.ready && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 rounded-full bg-white shadow-md transition-[left,width,opacity] duration-300 ease-out"
              style={{ left: pill.left, width: pill.width }}
            />
          )}
          {navItems.map((item) => {
            const id = item.href.slice(1)
            const isActive = scrolled && active === id
            return (
              <li key={item.label} data-tab={id}>
                <a
                  href={item.href}
                  onClick={() => handleNavClick(id)}
                  className={`relative z-10 block rounded-full px-3 py-1.5 transition-colors duration-300 ${
                    isActive
                      ? 'text-slate-900'
                      : scrolled
                        ? 'text-white/85 hover:text-white'
                        : 'text-white hover:text-white/85'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}

/* Section heading with a small accent rule synced to the section color */
function SectionTitle({ title, subtitle, accent = 'bg-white' }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
      <div className={`mt-3 h-1 w-12 rounded-full ${accent}`} />
      {subtitle && (
        <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  )
}

function App() {
  return (
    <div className="bg-black">
      <Navbar />

      {/* Home */}
      <section
        id="home"
        className="relative flex min-h-screen items-center bg-cover bg-top px-6 py-24 text-white"
        style={{ backgroundImage: "url('/daniel-sessler-AUPja_8Smd0-unsplash.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/40" aria-hidden="true" />
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <h1 className="text-5xl font-bold tracking-tight drop-shadow-lg sm:text-6xl">
            Jim Halpert
          </h1>
          <p className="mt-4 text-xl text-white/85 sm:text-2xl">
            Full-Stack Developer · B.Tech CSE (AI &amp; ML), RCET Bhilai
          </p>
          <p className="mt-4 max-w-xl text-white/70">
            I build fast, modern web experiences with the MERN stack and Next.js —
            with a soft spot for mountain views.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg transition hover:bg-white/90 active:scale-95"
            >
              View Projects
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#about"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white ring-1 ring-white/40 backdrop-blur-sm transition hover:bg-white/10 active:scale-95"
            >
              About Me
            </a>
          </div>
        </div>
        {/* Fade the photo's bottom edge into the black */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-b from-transparent to-black" />
      </section>

      {/* Content on black */}
      <div className="bg-black">
        {/* Skills */}
        <section id="skills" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
          <SectionTitle
            title="Skills"
            accent="bg-[#0037ff]"
            subtitle="Tools and technologies I use to bring ideas from a napkin sketch to production."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {skillsData.map(({ category, icon, items }) => (
              <div
                key={category}
                className="rounded-2xl bg-[#111113] p-6 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-white/25"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#0037ff]/10 text-[#5c8aff] ring-1 ring-[#0037ff]/30">
                    <Icon name={icon} />
                  </span>
                  <h3 className="text-lg font-bold text-white">{category}</h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-md bg-white/5 px-3 py-1 text-sm text-white/80 ring-1 ring-white/10"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
          <SectionTitle
            title="Projects"
            accent="bg-amber-500"
            subtitle="A few things I have designed, built, and shipped — from full-stack apps to AI-powered tools."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project, i) => (
              <article
                key={project.title}
                className="flex flex-col rounded-2xl bg-[#111113] p-6 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-white/25"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-amber-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  {project.title}
                </h3>
                <p className="mb-4 leading-relaxed text-slate-400">
                  {project.description}
                </p>
                <ul className="mt-auto flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Certificates */}
        <section id="certificates" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
          <SectionTitle
            title="Certificates"
            accent="bg-emerald-500"
            subtitle="Certifications I have earned along the way to back the practical work with theory."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {certificates.map((cert) => (
              <article
                key={cert.title}
                className="rounded-2xl bg-[#111113] p-6 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-white/25"
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 2.25 2.25L15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Verified
                </div>
                <h3 className="mb-1 font-bold text-white">{cert.title}</h3>
                <p className="mb-3 text-sm text-emerald-300/90">{cert.issuer}</p>
                <p className="text-sm leading-relaxed text-slate-400">
                  {cert.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 pb-32">
          <SectionTitle
            title="About"
            accent="bg-violet-500"
            subtitle="Hi, I am Jim Halpert — a full-stack developer who recently graduated from Rungta College of Engineering and Technology (RCET), Bhilai, with a B.Tech in Computer Science and Engineering (Artificial Intelligence & Machine Learning). During college I fell in love with web development and went deep into the MERN stack and Next.js, building everything from task managers to e-commerce stores. I am equally comfortable wiring up a database schema, designing a REST API, or fine-tuning a front-end until it feels effortless. When I am not coding, you will probably find me experimenting with new AI tools, exploring cloud platforms, or planning my next mountain trip. I am looking for opportunities where I can build products people genuinely enjoy using."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {aboutFacts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl bg-[#111113] p-6 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-white/25"
              >
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/60">
                  {fact.label}
                </p>
                <p className="font-bold text-white">{fact.value}</p>
              </div>
            ))}
          </div>
          <footer className="mt-24 border-t border-white/10 pt-8 text-center text-sm text-white/50">
            © {new Date().getFullYear()} Jim Halpert · Built with React &amp; Tailwind CSS
          </footer>
        </section>
      </div>
    </div>
  )
}

export default App
