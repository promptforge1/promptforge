import { Link } from 'react-router'
import { Zap, Github, Twitter, MessageCircle, Linkedin } from 'lucide-react'

const productLinks = [
  { to: '/optimize', label: 'Optimize' },
  { to: '/templates', label: 'Templates' },
  { to: '/models', label: 'Models' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/docs', label: 'API Docs' },
]

const resourceLinks = [
  { to: '#', label: 'Blog' },
  { to: '/docs', label: 'Documentation' },
  { to: '#', label: 'Changelog' },
  { to: '#', label: 'Community' },
  { to: '#', label: 'Status' },
]

const companyLinks = [
  { to: '#', label: 'About' },
  { to: '#', label: 'Careers' },
  { to: '#', label: 'Privacy' },
  { to: '#', label: 'Terms' },
  { to: '#', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(168,85,247,0.08)] bg-[#0A0A0F]">
      <div className="mx-auto max-w-[1280px] px-4 pt-10 md:px-6 md:pt-16 lg:px-16">
        <div className="grid grid-cols-2 gap-8 md:gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#A855F7] to-[#7C3AED]">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                PromptForge
              </span>
            </Link>
            <p className="mt-4 max-w-[260px] text-sm leading-relaxed text-[#6B7280]">
              The prompt engineering platform built for professionals.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-white">Product</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-[#B4B4C7] transition-colors hover:text-[#C4B5FD]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-white">Resources</h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-[#B4B4C7] transition-colors hover:text-[#C4B5FD]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-white">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-[#B4B4C7] transition-colors hover:text-[#C4B5FD]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgba(255,255,255,0.05)] py-6 sm:flex-row">
          <p className="text-xs text-[#6B7280]">
            &copy; 2025 PromptForge. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[#6B7280] transition-colors hover:scale-110 hover:text-white">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-[#6B7280] transition-colors hover:scale-110 hover:text-white">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-[#6B7280] transition-colors hover:scale-110 hover:text-white">
              <MessageCircle className="h-5 w-5" />
            </a>
            <a href="#" className="text-[#6B7280] transition-colors hover:scale-110 hover:text-white">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
