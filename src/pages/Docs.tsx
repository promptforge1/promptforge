import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code,
  Terminal,
  Globe,
  Copy,
  Check,
  Send,
  MessageCircle,
  Mail,
  ChevronRight,
} from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => { io.disconnect() }
  }, [])
  return { ref, visible }
}

/* ------------------------------------------------------------------ */
/*  CodeBlock component with copy button                               */
/* ------------------------------------------------------------------ */

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const customStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: '#0D0D14',
      margin: 0,
      padding: '20px',
      borderRadius: '12px',
      fontSize: '13px',
      lineHeight: '1.7',
      fontFamily: "'JetBrains Mono', monospace",
    },
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      background: 'transparent',
      fontFamily: "'JetBrains Mono', monospace",
    },
  }

  return (
    <div className="group relative">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 rounded-lg p-2 transition-colors"
        style={{
          background: 'rgba(19, 19, 31, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
        title="Copy"
      >
        {copied ? (
          <Check className="h-4 w-4 text-[#10B981]" />
        ) : (
          <Copy className="h-4 w-4 text-[#6B7280]" />
        )}
      </button>
      <div
        className="overflow-x-auto rounded-xl"
        style={{
          background: '#0D0D14',
          border: '1px solid rgba(168,85,247,0.1)',
        }}
      >
        <SyntaxHighlighter language={language} style={customStyle} showLineNumbers={false}>
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Navigation data                                                    */
/* ------------------------------------------------------------------ */

const navGroups = [
  {
    label: 'Getting Started',
    items: [
      { id: 'intro', label: 'Introduction' },
      { id: 'quickstart', label: 'Quick Start Guide' },
      { id: 'auth', label: 'Authentication' },
      { id: 'errors', label: 'Error Handling' },
      { id: 'ratelimits', label: 'Rate Limits' },
    ],
  },
  {
    label: 'API Reference',
    items: [
      { id: 'optimize-endpoint', label: 'Optimize Prompt' },
      { id: 'compare-endpoint', label: 'Compare Models' },
      { id: 'templates-endpoint', label: 'Get Templates' },
      { id: 'save-endpoint', label: 'Save Prompt' },
      { id: 'batch-endpoint', label: 'Batch Operations' },
    ],
  },
  {
    label: 'SDKs',
    items: [
      { id: 'python-sdk', label: 'Python SDK' },
      { id: 'js-sdk', label: 'JavaScript/Node.js SDK' },
      { id: 'rest-sdk', label: 'REST API (curl)' },
    ],
  },
  {
    label: 'Guides',
    items: [
      { id: 'best-practices', label: 'Best Practices' },
      { id: 'webhooks', label: 'Webhook Integration' },
      { id: 'model-selection', label: 'Model Selection' },
      { id: 'optimization-strategies', label: 'Optimization Strategies' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Sidebar Navigation                                                 */
/* ------------------------------------------------------------------ */

function SidebarNav({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  return (
    <aside
      className="hidden h-[calc(100vh-72px)] w-[280px] shrink-0 overflow-y-auto border-r p-6 lg:block"
      style={{
        background: 'rgba(10,10,15,0.95)',
        borderColor: 'rgba(168,85,247,0.08)',
        position: 'sticky',
        top: '72px',
      }}
    >
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: easeOutExpo }}
      >
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <h4
              className="mb-2 mt-5 text-[11px] font-medium uppercase tracking-wider text-[#6B7280]"
              style={{ letterSpacing: '0.08em' }}
            >
              {group.label}
            </h4>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onSelect(item.id)}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors"
                    style={{
                      color: activeId === item.id ? '#FFF' : '#B4B4C7',
                      fontWeight: activeId === item.id ? 500 : 400,
                      background: activeId === item.id ? 'rgba(168,85,247,0.1)' : 'transparent',
                      borderLeft: activeId === item.id ? '2px solid #A855F7' : '2px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (activeId !== item.id) {
                        e.currentTarget.style.background = 'rgba(168,85,247,0.06)'
                        e.currentTarget.style.color = '#FFF'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeId !== item.id) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#B4B4C7'
                      }
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.nav>
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 1: Page Header                                             */
/* ------------------------------------------------------------------ */

function PageHeader() {
  return (
    <section
      className="relative flex min-h-[280px] w-full items-center justify-center overflow-hidden"
      style={{
        background: '#0A0A0F',
        backgroundImage: 'radial-gradient(rgba(168,85,247,0.1) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 text-center lg:px-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-xs tracking-wide text-[#6B7280]"
        >
          <Link to="/" className="transition-colors hover:text-[#C4B5FD]">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#B4B4C7]">Documentation</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl"
        >
          PromptForge API
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: easeOutExpo }}
          className="mx-auto mt-4 max-w-2xl text-lg text-[#B4B4C7]"
        >
          Integrate prompt optimization into your applications. RESTful API with SDKs for Python, JavaScript, and more.
        </motion.p>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { label: 'Quick Start', color: 'purple' },
            { label: 'API Reference', color: 'cyan' },
            { label: 'SDKs', color: 'standard' },
            { label: 'Changelog', color: 'standard' },
          ].map((badge, i) => (
            <motion.span
              key={badge.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
              style={
                badge.color === 'purple'
                  ? {
                      background: 'rgba(168, 85, 247, 0.12)',
                      color: '#C4B5FD',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                    }
                  : badge.color === 'cyan'
                    ? {
                        background: 'rgba(6, 182, 212, 0.12)',
                        color: '#06B6D4',
                        border: '1px solid rgba(6, 182, 212, 0.2)',
                      }
                    : {
                        background: 'rgba(19, 19, 31, 0.7)',
                        color: '#B4B4C7',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }
              }
            >
              {badge.label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Docs Content — Quick Start Guide                              */
/* ------------------------------------------------------------------ */

const curlCode = `curl -X POST https://api.promptforge.app/v1/optimize \\
  -H "Authorization: Bearer $PF_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Write a blog post about AI",
    "target_model": "gpt-4o",
    "optimization_level": "balanced"
  }'`

const jsonResponse = `{
  "optimized_prompt": "Write a comprehensive 1500-word blog post...",
  "original_prompt": "Write a blog post about AI",
  "quality_score": 94,
  "improvements": {
    "clarity": "+32%",
    "specificity": "+45%",
    "structure": "+28%"
  },
  "model": "gpt-4o",
  "tokens_used": 342
}`

const apiKeyCode = `# Your API key will look like this
PF_API_KEY="pf_live_abc123xyz789"`

function DocsContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      className="min-w-0 px-6 py-12 md:px-16 lg:max-w-[800px] lg:px-12"
    >
      <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Quick Start Guide</h1>
      <p className="mt-4 text-lg leading-relaxed text-[#B4B4C7]">
        Get up and running with the PromptForge API in under 5 minutes. This guide covers authentication, your first optimization request, and response handling.
      </p>

      {/* Step 1 */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold text-white">1. Get Your API Key</h2>
        <p className="mt-3 text-[#B4B4C7]">
          Sign up for a free account at promptforge.app and generate an API key from your dashboard.
        </p>
        <div className="mt-4">
          <CodeBlock code={apiKeyCode} language="bash" />
        </div>
      </div>

      {/* Step 2 */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold text-white">2. Make Your First Request</h2>
        <p className="mt-3 text-[#B4B4C7]">
          Use the <code className="rounded-md bg-[#1C1C2E] px-1.5 py-0.5 font-mono text-sm text-[#C4B5FD]">/optimize</code> endpoint to enhance any prompt.
        </p>
        <div className="mt-4">
          <CodeBlock code={curlCode} language="bash" />
        </div>
      </div>

      {/* Step 3 */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold text-white">3. Handle the Response</h2>
        <p className="mt-3 text-[#B4B4C7]">
          The API returns the optimized prompt along with quality metrics.
        </p>
        <div className="mt-4">
          <CodeBlock code={jsonResponse} language="json" />
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold text-white">Next Steps</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="#"
            className="group flex items-center gap-4 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: 'rgba(19, 19, 31, 0.6)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(168, 85, 247, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.25)'
              e.currentTarget.style.boxShadow = '0 8px 40px rgba(168, 85, 247, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(168,85,247,0.12)]">
              <Code className="h-5 w-5 text-[#C4B5FD]" />
            </div>
            <div>
              <p className="font-medium text-white">Explore the API Reference</p>
              <p className="mt-0.5 text-sm text-[#C4B5FD]">View endpoints &rarr;</p>
            </div>
          </Link>

          <Link
            to="#"
            className="group flex items-center gap-4 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: 'rgba(19, 19, 31, 0.6)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(168, 85, 247, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.25)'
              e.currentTarget.style.boxShadow = '0 8px 40px rgba(168, 85, 247, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(168,85,247,0.12)]">
              <Terminal className="h-5 w-5 text-[#C4B5FD]" />
            </div>
            <div>
              <p className="font-medium text-white">Download Python SDK</p>
              <p className="mt-0.5 text-sm text-[#C4B5FD]">pip install promptforge &rarr;</p>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 3: Interactive API Tester                                  */
/* ------------------------------------------------------------------ */

function APITester() {
  const { ref, visible } = useReveal()
  const [prompt, setPrompt] = useState('Write a blog post about AI')
  const [targetModel, setTargetModel] = useState('gpt-4o')
  const [optimizationLevel, setOptimizationLevel] = useState('balanced')
  const [tone, setTone] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)

  const handleSend = useCallback(() => {
    setLoading(true)
    setResponse(null)
    setTimeout(() => {
      setLoading(false)
      setResponse(JSON.stringify({
        optimized_prompt: `Write a comprehensive, well-structured 1500-word blog post exploring the current state and future implications of artificial intelligence. Include specific examples of AI applications across industries, discuss ethical considerations, and provide actionable insights for readers. Use a ${tone} tone with clear headings and subheadings.`,
        original_prompt: prompt,
        quality_score: 96,
        improvements: {
          clarity: '+38%',
          specificity: '+52%',
          structure: '+41%',
          tone_consistency: '+29%',
        },
        model: targetModel,
        tokens_used: 486,
        processing_time: '342ms',
      }, null, 2))
    }, 1200)
  }, [prompt, targetModel, optimizationLevel, tone])

  return (
    <section className="w-full bg-[#0A0A0F] px-6 py-8 lg:px-16">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="mx-auto overflow-hidden rounded-3xl p-8 md:p-12 lg:max-w-[1280px]"
        style={{ background: '#13131F' }}
      >
        <h2 className="font-display text-3xl font-bold text-white">Try It Live</h2>
        <p className="mt-2 text-[#B4B4C7]">Test the API directly in your browser.</p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left — Request Builder */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(10, 10, 15, 0.6)',
              border: '1px solid rgba(168, 85, 247, 0.1)',
            }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span
                className="rounded-md px-2.5 py-1 text-xs font-semibold"
                style={{ background: 'rgba(168,85,247,0.15)', color: '#C4B5FD' }}
              >
                POST
              </span>
              <code className="font-mono text-sm text-[#B4B4C7]">/v1/optimize</code>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#B4B4C7]">prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                  style={{
                    background: '#0D0D14',
                    border: '1px solid rgba(168, 85, 247, 0.15)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#A855F7' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.15)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#B4B4C7]">target_model</label>
                  <select
                    value={targetModel}
                    onChange={(e) => setTargetModel(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
                    style={{
                      background: '#0D0D14',
                      border: '1px solid rgba(168, 85, 247, 0.15)',
                    }}
                  >
                    <option value="gpt-4o">gpt-4o</option>
                    <option value="claude-sonnet">claude-sonnet</option>
                    <option value="gpt-4">gpt-4</option>
                    <option value="claude-opus">claude-opus</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#B4B4C7]">optimization_level</label>
                  <select
                    value={optimizationLevel}
                    onChange={(e) => setOptimizationLevel(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
                    style={{
                      background: '#0D0D14',
                      border: '1px solid rgba(168, 85, 247, 0.15)',
                    }}
                  >
                    <option value="minimal">minimal</option>
                    <option value="balanced">balanced</option>
                    <option value="aggressive">aggressive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#B4B4C7]">tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
                  style={{
                    background: '#0D0D14',
                    border: '1px solid rgba(168, 85, 247, 0.15)',
                  }}
                >
                  <option value="professional">professional</option>
                  <option value="casual">casual</option>
                  <option value="academic">academic</option>
                  <option value="creative">creative</option>
                </select>
              </div>

              <button
                onClick={handleSend}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-px disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
                }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right — Response Viewer */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(10, 10, 15, 0.6)',
              border: '1px solid rgba(168, 85, 247, 0.1)',
            }}
          >
            <div className="mb-4 flex items-center gap-3">
              {response ? (
                <span
                  className="rounded-md px-2.5 py-1 text-xs font-semibold"
                  style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}
                >
                  200 OK
                </span>
              ) : (
                <span
                  className="rounded-md px-2.5 py-1 text-xs font-semibold"
                  style={{ background: 'rgba(107,114,128,0.15)', color: '#6B7280' }}
                >
                  Waiting
                </span>
              )}
              {response && (
                <span className="text-xs text-[#6B7280]">342ms</span>
              )}
            </div>

            <AnimatePresence mode="wait">
              {response ? (
                <motion.div
                  key="response"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CodeBlock code={response} language="json" />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-[300px] items-center justify-center rounded-xl"
                  style={{
                    background: '#0D0D14',
                    border: '1px dashed rgba(168, 85, 247, 0.15)',
                  }}
                >
                  <p className="text-sm text-[#6B7280]">
                    {loading ? 'Processing request...' : 'Click "Send Request" to see the response'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 4: SDK Cards                                               */
/* ------------------------------------------------------------------ */

const sdks = [
  {
    icon: Terminal,
    title: 'Python',
    install: 'pip install promptforge',
    link: 'View Python Docs',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(124,58,237,0.2) 100%)',
    iconColor: '#C4B5FD',
  },
  {
    icon: Code,
    title: 'JavaScript / Node.js',
    install: 'npm install @promptforge/sdk',
    link: 'View JS Docs',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(59,130,246,0.2) 100%)',
    iconColor: '#06B6D4',
  },
  {
    icon: Globe,
    title: 'REST API',
    install: 'Any HTTP client',
    link: 'View API Reference',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.2) 100%)',
    iconColor: '#10B981',
  },
]

function SDKCards() {
  const { ref, visible } = useReveal()

  return (
    <section className="w-full bg-[#0A0A0F] px-6 py-16 lg:px-16">
      <div ref={ref} className="mx-auto max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="mb-10 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Official SDKs</h2>
          <p className="mt-3 text-[#B4B4C7]">Get started faster with our official libraries.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {sdks.map((sdk, i) => (
            <motion.div
              key={sdk.title}
              initial={{ opacity: 0, y: 40 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: easeOutExpo }}
            >
              <div
                className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(19, 19, 31, 0.6)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(168, 85, 247, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.25)'
                  e.currentTarget.style.boxShadow = '0 8px 40px rgba(168, 85, 247, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: sdk.gradient }}
                >
                  <sdk.icon className="h-6 w-6" style={{ color: sdk.iconColor }} />
                </div>
                <h4 className="mt-4 font-display text-xl font-medium text-white">{sdk.title}</h4>
                <code
                  className="mt-2 block rounded-lg px-3 py-2 text-xs"
                  style={{
                    background: '#0D0D14',
                    border: '1px solid rgba(168, 85, 247, 0.1)',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#B4B4C7',
                  }}
                >
                  {sdk.install}
                </code>
                <a
                  href="#"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#C4B5FD] transition-colors hover:text-[#A855F7]"
                >
                  {sdk.link} <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 5: Support CTA                                             */
/* ------------------------------------------------------------------ */

function SupportCTA() {
  const { ref, visible } = useReveal()

  return (
    <section
      className="w-full px-6 py-16 lg:px-16"
      style={{
        background: '#0A0A0F',
        position: 'relative',
      }}
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.12) 0%, transparent 60%)',
        }}
      />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: easeOutExpo }}
        className="relative z-10 mx-auto max-w-[1280px] text-center"
      >
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Need Help?</h2>
        <p className="mt-3 text-[#B4B4C7]">Our developer support team is here to help you integrate.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-semibold text-[#B4B4C7] transition-all duration-200 hover:-translate-y-px hover:text-white"
            style={{
              border: '1px solid rgba(168, 85, 247, 0.3)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#A855F7'
              e.currentTarget.style.background = 'rgba(168, 85, 247, 0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Join Discord Community
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            style={{
              background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
            }}
          >
            <Mail className="h-4 w-4" />
            Contact Developer Support
          </a>
        </div>
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                        */
/* ------------------------------------------------------------------ */

export default function Docs() {
  const [activeNav, setActiveNav] = useState('quickstart')

  return (
    <div className="w-full bg-[#0A0A0F]">
      <PageHeader />
      <div className="mx-auto flex max-w-[1280px] justify-start">
        <SidebarNav activeId={activeNav} onSelect={setActiveNav} />
        <DocsContent />
      </div>
      <APITester />
      <SDKCards />
      <SupportCTA />
    </div>
  )
}
