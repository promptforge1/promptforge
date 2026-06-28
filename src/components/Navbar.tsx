import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/optimize', label: 'Optimize' },
  { to: '/models', label: 'Models' },
  { to: '/templates', label: 'Templates' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/docs', label: 'Docs' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <nav
      className="sticky top-0 z-50 h-[72px] w-full border-b border-[rgba(168,85,247,0.08)]"
      style={{
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-4 md:px-6 lg:px-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#A855F7] to-[#7C3AED]">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white md:text-xl">
            PromptForge
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'text-[#C4B5FD]'
                  : 'text-[#B4B4C7] hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/optimize"
            className="gradient-purple-cyan rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-glow-purple hover:-translate-y-px"
          >
            Start Optimizing
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="min-h-11 min-w-11 text-[#B4B4C7] hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu with animation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[72px] bg-black/60 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Menu panel */}
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 top-[72px] overflow-hidden border-b border-[rgba(168,85,247,0.15)] md:hidden"
              style={{
                background: 'rgba(10, 10, 15, 0.98)',
                backdropFilter: 'blur(24px)',
              }}
            >
              <div className="flex flex-col gap-1 px-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`min-h-11 rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                      location.pathname === link.to
                        ? 'text-[#C4B5FD]'
                        : 'text-[#B4B4C7] hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/optimize"
                  onClick={() => setMobileOpen(false)}
                  className="gradient-purple-cyan mt-2 min-h-14 rounded-xl px-5 py-3 text-center text-base font-semibold text-white"
                >
                  Start Optimizing
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
