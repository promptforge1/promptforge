import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X, Zap } from 'lucide-react'

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

  return (
    <nav
      className="sticky top-0 z-50 h-[72px] w-full border-b border-[rgba(168,85,247,0.08)]"
      style={{
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6 lg:px-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#A855F7] to-[#7C3AED]">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">
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
          className="text-[#B4B4C7] hover:text-white md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="absolute left-0 right-0 top-[72px] border-b border-[rgba(168,85,247,0.1)] px-6 py-4 md:hidden"
          style={{
            background: 'rgba(10, 10, 15, 0.95)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
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
              className="gradient-purple-cyan mt-2 rounded-xl px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Start Optimizing
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
