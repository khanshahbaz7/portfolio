import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'About', href: '#about' },
]

const skills = {
  'Frontend': ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS'],
  'Backend': ['Node.js', 'Express.js', 'REST APIs', 'MongoDB'],
  'MERN Stack': ['MongoDB', 'Express', 'React', 'Node.js'],
  'AI / ML': ['Python', 'Machine Learning', 'TensorFlow', 'scikit-learn'],
  'Cloud & Tools': ['AWS', 'Git', 'GitHub', 'Vite', 'Postman'],
  'Databases': ['MongoDB', 'MySQL', 'PostgreSQL'],
}

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

/* Card accents (Spotify-style): dark surfaces with one controlled color each */
const CARD_ACCENTS = ['bg-blue-600', 'bg-red-600', 'bg-green-600', 'bg-fuchsia-600', 'bg-lime-500']

/* Solid dark card with a soft colored glow — restrained, like Spotify */
function GlowCard({ color, className = '', children }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-[#181818] p-6 shadow-lg ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-white/20 ${className}`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-25 blur-3xl transition duration-300 group-hover:opacity-45 ${color}`}
      />
      <div className="relative">{children}</div>
    </div>
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
                      : 'text-white/85 hover:text-white'
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

function SectionTitle({ title, children }) {
  return (
    <div className="mb-12">
      <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">{title}</h2>
      {children && (
        <p className="max-w-2xl leading-relaxed text-slate-200">{children}</p>
      )}
    </div>
  )
}

/* Ambient color blobs that the glass panes refract */
function AmbientBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-red-500/25 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
    </div>
  )
}

function App() {
  return (
    <div>
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
              className="rounded-full bg-sky-600/90 px-6 py-3 font-medium shadow-lg transition hover:bg-sky-500 active:scale-95"
            >
              View Projects
            </a>
            <a
              href="#about"
              className="liquid-glass rounded-full px-6 py-3 font-medium transition hover:scale-[1.02] active:scale-95"
            >
              About Me
            </a>
          </div>
        </div>
        {/* Fade the photo's bottom edge into the black gradient */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-b from-transparent to-black" />
      </section>

      {/* Black from where the photo ends */}
      <div className="relative overflow-hidden bg-black">
        <AmbientBlobs />

        {/* Skills */}
        <section id="skills" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
          <SectionTitle title="Skills">
            Tools and technologies I use to bring ideas from a napkin sketch to
            production.
          </SectionTitle>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(skills).map(([category, items], i) => (
              <GlowCard key={category} color={CARD_ACCENTS[i % CARD_ACCENTS.length]}>
                <h3 className="mb-4 text-lg font-bold text-white">{category}</h3>
                <ul className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-md bg-white/10 px-3 py-1 text-sm font-medium text-white/90"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </GlowCard>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
          <SectionTitle title="Projects">
            A few things I have designed, built, and shipped — from full-stack
            apps to AI-powered tools.
          </SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project, i) => (
              <GlowCard key={project.title} color={CARD_ACCENTS[i % CARD_ACCENTS.length]} className="flex flex-col">
                <div className={`mb-4 h-1 w-10 rounded-full ${CARD_ACCENTS[i % CARD_ACCENTS.length]}`} />
                <h3 className="mb-2 text-xl font-bold text-white">
                  {project.title}
                </h3>
                <p className="mb-4 leading-relaxed text-white/80">
                  {project.description}
                </p>
                <ul className="mt-auto flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md bg-white/10 px-3 py-1 text-xs font-medium text-white/90"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </GlowCard>
            ))}
          </div>
        </section>

        {/* Certificates */}
        <section id="certificates" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
          <SectionTitle title="Certificates">
            Certifications I have earned along the way to back the practical
            work with theory.
          </SectionTitle>
          <div className="grid gap-6 md:grid-cols-3">
            {certificates.map((cert, i) => (
              <GlowCard key={cert.title} color={CARD_ACCENTS[i % CARD_ACCENTS.length]}>
                <div className={`mb-4 h-1 w-10 rounded-full ${CARD_ACCENTS[i % CARD_ACCENTS.length]}`} />
                <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1 text-xs font-bold text-white">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 2.25 2.25L15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Verified
                </div>
                <h3 className="mb-1 font-bold text-white">{cert.title}</h3>
                <p className="mb-3 text-sm font-bold text-white/90">{cert.issuer}</p>
                <p className="text-sm leading-relaxed text-white/80">
                  {cert.description}
                </p>
              </GlowCard>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24 pb-32">
          <SectionTitle title="About">
            Hi, I am Jim Halpert — a full-stack developer who recently graduated
            from Rungta College of Engineering and Technology (RCET), Bhilai,
            with a B.Tech in Computer Science and Engineering (Artificial
            Intelligence &amp; Machine Learning). During college I fell in love
            with web development and went deep into the MERN stack and Next.js,
            building everything from task managers to e-commerce stores. I am
            equally comfortable wiring up a database schema, designing a REST
            API, or fine-tuning a front-end until it feels effortless. When I am
            not coding, you will probably find me experimenting with new AI
            tools, exploring cloud platforms, or planning my next mountain trip.
            I am looking for opportunities where I can build products people
            genuinely enjoy using.
          </SectionTitle>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {aboutFacts.map((fact, i) => (
              <GlowCard key={fact.label} color={CARD_ACCENTS[i % CARD_ACCENTS.length]}>
                <div className={`mb-3 h-1 w-10 rounded-full ${CARD_ACCENTS[i % CARD_ACCENTS.length]}`} />
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/70">
                  {fact.label}
                </p>
                <p className="font-bold text-white">{fact.value}</p>
              </GlowCard>
            ))}
          </div>
          <footer className="mt-24 text-center text-sm text-white/50">
            © {new Date().getFullYear()} Jim Halpert · Built with React &amp; Tailwind CSS
          </footer>
        </section>
      </div>
    </div>
  )
}

export default App
