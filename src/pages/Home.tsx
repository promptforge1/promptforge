import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Zap,
  MessageSquare,
  Swords,
  Code,
  Bot,
  Image,
  TrendingUp,
  Palette,
  Terminal,
  ArrowRight,
  Play,
  Check,
  Star,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const ThreeParticleField = lazy(() => import('@/components/ThreeParticleField'))

/* ─── Section 1: Hero ─── */
function HeroSection() {
  const badgeRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)
  const shapesRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    tl.fromTo(badgeRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.2 })
      .fromTo(headlineRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.1')
      .fromTo(subRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.4')
      .fromTo(ctaRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.2')
      .fromTo(trustRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.1')
      .fromTo(shapesRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8 }, 0.4)

    return () => { tl.kill() }
  }, [])

  return (
    <section
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0A0F 0%, #13131F 50%, #0A0A0F 100%)' }}
    >
      {/* Three.js Particle Field */}
      <Suspense fallback={null}>
        <ThreeParticleField />
      </Suspense>

      {/* Glow orbs */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        <div
          className="glow-purple absolute -left-[20%] top-[20%] h-[500px] w-[500px] blur-[120px]"
        />
        <div
          className="glow-cyan absolute -right-[20%] top-[30%] h-[400px] w-[400px] blur-[120px]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div>
            {/* Badge */}
            <div
              ref={badgeRef}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(168,85,247,0.2)] px-4 py-1.5 text-[13px] font-medium text-[#C4B5FD]"
              style={{ background: 'rgba(168,85,247,0.12)' }}
            >
              <span>The PromptPerfect Alternative</span>
            </div>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="font-display text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-white md:text-[56px] lg:text-[72px]"
            >
              Optimize Every Prompt
              <br />
              <span className="text-gradient">Unlock AI&apos;s Full Potential</span>
            </h1>

            {/* Subheadline */}
            <p
              ref={subRef}
              className="mt-6 max-w-[560px] text-lg leading-relaxed text-[#B4B4C7]"
            >
              The most powerful prompt engineering platform. Refine prompts for GPT-4, Claude, Midjourney, and 20+ models. Get better outputs in seconds, not hours.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/optimize"
                className="gradient-purple-cyan inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-glow-purple"
              >
                Start Optimizing Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-[rgba(168,85,247,0.3)] px-7 py-3.5 text-[15px] font-semibold text-[#B4B4C7] transition-all hover:border-[#A855F7] hover:text-white hover:bg-[rgba(168,85,247,0.08)]"
              >
                <Play className="h-4 w-4" />
                See How It Works
              </button>
            </div>

            {/* Trust bar */}
            <div ref={trustRef} className="mt-10">
              <p className="mb-3 text-xs font-medium tracking-wide text-[#6B7280] uppercase">
                Trusted by 50,000+ engineers
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {['OpenAI', 'Anthropic', 'Midjourney', 'Stability AI', 'Google'].map((name) => (
                  <div
                    key={name}
                    className="flex h-7 items-center rounded bg-[rgba(255,255,255,0.04)] px-3 text-xs font-medium text-[#6B7280]"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: 3D shapes */}
          <div className="hidden lg:block">
            <img
              ref={shapesRef}
              src="/hero-3d-shapes.png"
              alt="3D glass shapes"
              className="mx-auto w-full max-w-[500px] animate-float"
              style={{ opacity: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section 2: Social Proof ─── */
function SocialProofSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current!.querySelectorAll('.logo-item'), {
        opacity: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current!,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    })
    return () => ctx.revert()
  }, [])

  const logos = [
    'OpenAI', 'Anthropic', 'Midjourney', 'Stability AI',
    'Google', 'Microsoft', 'Notion', 'Figma',
  ]

  return (
    <section ref={ref} className="overflow-hidden bg-[#0A0A0F] py-12">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-16">
        <p className="mb-6 text-center text-xs font-medium tracking-wide text-[#6B7280] uppercase">
          Trusted by teams at
        </p>
        <div className="relative">
          <div className="flex items-center justify-center gap-8 overflow-hidden">
            {/* First set */}
            {logos.map((name) => (
              <div
                key={name}
                className="logo-item flex h-10 shrink-0 items-center justify-center rounded-md bg-[rgba(255,255,255,0.03)] px-5 text-sm font-semibold text-[#6B7280]"
                style={{ opacity: 0.4, filter: 'grayscale(100%)' }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section 3: Core Features ─── */
const features = [
  { icon: Zap, title: 'Prompt Optimization', desc: 'Paste any prompt and get an enhanced version optimized for your target model. Our AI understands context, structure, and model-specific nuances.' },
  { icon: MessageSquare, title: 'Interactive Chat', desc: 'Collaborate with an AI assistant to brainstorm, refine, and iterate on prompts in real-time. Like having a prompt engineer by your side.' },
  { icon: Swords, title: 'Model Arena', desc: 'Compare outputs from multiple AI models side-by-side. Test the same prompt across GPT-4, Claude, Gemini, and more — all at once.' },
  { icon: Code, title: 'Prompt as API', desc: 'Deploy your optimized prompts as REST API endpoints. Integrate directly into your applications with one click.' },
  { icon: Bot, title: 'AI Agents', desc: 'Create specialized AI agents that automate complex prompt workflows. Chain multiple optimizations together for powerful pipelines.' },
  { icon: Image, title: 'Image Prompts', desc: 'Optimize prompts for Midjourney, DALL-E, and Stable Diffusion. Get stunning visual outputs with precise control over style and composition.' },
]

function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelector('.section-header'), {
        y: 40, opacity: 0, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 85%' },
      })
      gsap.from(sectionRef.current!.querySelectorAll('.feature-card'), {
        y: 50, opacity: 0, scale: 0.95, stagger: 0.1, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 75%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-[#0A0A0F] py-24 lg:py-24">
      <div className="surface-shine absolute inset-x-0 top-0 h-[200px]" />
      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-16">
        <div className="section-header mb-16">
          <span
            className="mb-4 inline-block rounded-full border border-[rgba(168,85,247,0.2)] px-3 py-1 text-xs font-medium text-[#C4B5FD]"
            style={{ background: 'rgba(168,85,247,0.12)' }}
          >
            Features
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold leading-tight tracking-[-0.015em] text-white md:text-4xl">
            Everything You Need to Master Prompts
          </h2>
          <p className="mt-4 max-w-[600px] text-lg text-[#B4B4C7]">
            From optimization to deployment — a complete toolkit for prompt engineers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card group rounded-[20px] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(168,85,247,0.25)] hover:shadow-card-hover"
              style={{
                background: 'rgba(19, 19, 31, 0.6)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(168, 85, 247, 0.1)',
              }}
            >
              <div className="gradient-purple-cyan mb-5 inline-flex rounded-xl p-3">
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 font-display text-xl font-medium text-white">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#B4B4C7]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Section 4: Interactive Feature Showcase ─── */
function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'optimization' | 'arena' | 'api'>('optimization')

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelector('.showcase-header'), {
        y: 40, opacity: 0, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 85%' },
      })
      gsap.from(sectionRef.current!.querySelector('.showcase-container'), {
        y: 30, opacity: 0, scale: 0.97, duration: 0.8, delay: 0.2, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 75%' },
      })
    })
    return () => ctx.revert()
  }, [])

  const tabs = [
    { key: 'optimization' as const, label: 'Optimization' },
    { key: 'arena' as const, label: 'Arena' },
    { key: 'api' as const, label: 'API' },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#13131F] py-24 lg:py-24"
    >
      {/* Radial purple glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="glow-purple h-[600px] w-[600px] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-16">
        <div className="showcase-header text-center">
          <h2 className="font-display text-2xl font-bold leading-tight tracking-[-0.015em] text-white md:text-4xl">
            See the Difference
          </h2>
          <p className="mt-4 text-lg text-[#B4B4C7]">
            Watch your prompts transform in real-time.
          </p>
        </div>

        <div
          className="showcase-container mx-auto mt-12 max-w-[900px] overflow-hidden rounded-2xl"
          style={{
            background: 'rgba(19, 19, 31, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(168, 85, 247, 0.15)',
          }}
        >
          {/* Tabs */}
          <div className="flex border-b border-[rgba(168,85,247,0.1)]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex-1 px-4 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.key ? 'text-white' : 'text-[#6B7280] hover:text-[#B4B4C7]'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 gradient-purple-cyan"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            {activeTab === 'optimization' && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
                  {/* Before */}
                  <div
                    className="rounded-xl p-6"
                    style={{ background: 'rgba(10, 10, 15, 0.8)' }}
                  >
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                      Original Prompt
                    </p>
                    <p className="font-mono-code text-sm leading-relaxed text-white">
                      Write a blog post about AI
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-8 w-8 animate-pulse-arrow text-[#A855F7]" />
                  </div>

                  {/* After */}
                  <div
                    className="rounded-xl border border-[rgba(16,185,129,0.3)] p-6"
                    style={{ background: 'rgba(10, 10, 15, 0.8)' }}
                  >
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#10B981]">
                      Optimized Prompt
                    </p>
                    <p className="font-mono-code text-sm leading-relaxed text-white">
                      Write a comprehensive 1500-word blog post about artificial intelligence, covering: (1) current state of AI in 2024, (2) key breakthroughs in LLMs and multimodal models, (3) ethical considerations and societal impact, (4) future predictions for the next 5 years. Use a professional yet accessible tone. Include specific examples and data where possible. Structure with clear headings and a compelling introduction.
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span
                    className="inline-flex items-center rounded-full border border-[rgba(16,185,129,0.3)] px-3 py-1 text-xs font-medium text-[#10B981]"
                    style={{ background: 'rgba(16, 185, 129, 0.1)' }}
                  >
                    98% relevance score
                  </span>
                  <span
                    className="inline-flex items-center rounded-full border border-[rgba(168,85,247,0.2)] px-3 py-1 text-xs font-medium text-[#C4B5FD]"
                    style={{ background: 'rgba(168, 85, 247, 0.1)' }}
                  >
                    Optimized for: GPT-4
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'arena' && (
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { model: 'GPT-4o', text: 'A comprehensive overview of AI covering recent breakthroughs in large language models, multimodal systems, and their real-world applications across healthcare, education, and creative industries.' },
                  { model: 'Claude 3.5', text: 'Artificial Intelligence has evolved dramatically, with LLMs demonstrating reasoning capabilities, multimodal AI processing text and images together, and agents autonomously completing complex tasks.' },
                  { model: 'Gemini Pro', text: 'AI in 2024: LLMs now power enterprise tools, creative workflows, and scientific research. Key trends include smaller efficient models, improved reasoning, and responsible AI development practices.' },
                ].map((col) => (
                  <div
                    key={col.model}
                    className="rounded-xl p-5"
                    style={{
                      background: 'rgba(10, 10, 15, 0.8)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#A855F7]">
                      {col.model}
                    </p>
                    <p className="text-sm leading-relaxed text-[#B4B4C7]">
                      {col.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'api' && (
              <div
                className="overflow-x-auto rounded-xl p-6"
                style={{ background: 'rgba(10, 10, 15, 0.8)' }}
              >
                <pre className="font-mono-code text-sm">
                  <code className="text-[#6B7280]">
                    {`$ curl -X POST https://api.promptforge.ai/v1/optimize \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Write a blog post about AI",
    "model": "gpt-4",
    "target_length": "long"
  }'`}
                  </code>
                </pre>
                <pre className="mt-4 font-mono-code text-sm">
                  <code className="text-[#10B981]">
                    {`{
  "optimized_prompt": "Write a comprehensive 1500-word blog post...",
  "relevance_score": 0.98,
  "model": "gpt-4",
  "tokens_saved": 23
}`}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section 5: Use Cases ─── */
const useCases = [
  {
    image: '/use-case-marketing.png',
    icon: TrendingUp,
    title: 'Marketing & Growth',
    desc: 'Generate high-converting copy, optimize email campaigns, and create SEO-optimized content at scale. Turn vague ideas into precise marketing prompts.',
  },
  {
    image: '/use-case-creative.png',
    icon: Palette,
    title: 'Creative & Design',
    desc: 'Craft detailed image generation prompts for Midjourney and DALL-E. Specify lighting, composition, style, and mood with professional precision.',
  },
  {
    image: '/use-case-dev.png',
    icon: Terminal,
    title: 'Development & Engineering',
    desc: 'Write better code generation prompts, debug faster with precise queries, and build reliable AI-powered applications with structured prompts.',
  },
]

function UseCasesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelector('.uc-header'), {
        y: 40, opacity: 0, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 85%' },
      })
      gsap.from(sectionRef.current!.querySelectorAll('.uc-card'), {
        y: 50, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 70%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#0A0A0F] py-24 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-16">
        <div className="uc-header mb-16">
          <span
            className="mb-4 inline-block rounded-full border border-[rgba(168,85,247,0.2)] px-3 py-1 text-xs font-medium text-[#C4B5FD]"
            style={{ background: 'rgba(168,85,247,0.12)' }}
          >
            Use Cases
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold leading-tight tracking-[-0.015em] text-white md:text-4xl">
            Built for Every Creator
          </h2>
          <p className="mt-4 text-lg text-[#B4B4C7]">
            Whether you&apos;re a developer, marketer, artist, or writer — PromptForge elevates your AI workflow.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc, i) => (
            <div
              key={i}
              className="uc-card group overflow-hidden rounded-[20px] transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              style={{
                background: 'rgba(19, 19, 31, 0.6)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(168, 85, 247, 0.1)',
              }}
            >
              <div className="overflow-hidden" style={{ height: '200px' }}>
                <img
                  src={uc.image}
                  alt={uc.title}
                  className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
                />
              </div>
              <div className="p-7">
                <div className="gradient-purple-cyan mb-4 inline-flex rounded-xl p-3">
                  <uc.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-3 font-display text-xl font-medium text-white">
                  {uc.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-[#B4B4C7]">
                  {uc.desc}
                </p>
                <span className="text-sm font-medium text-[#C4B5FD]">
                  Learn more &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Section 6: How It Works ─── */
function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelector('.hiw-header'), {
        y: 40, opacity: 0, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 85%' },
      })

      if (lineRef.current) {
        gsap.fromTo(lineRef.current, { scaleX: 0 }, {
          scaleX: 1, duration: 1.5, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current!, start: 'top 60%', end: 'bottom 80%', scrub: true },
        })
      }

      gsap.from(sectionRef.current!.querySelectorAll('.step-circle'), {
        scale: 0, stagger: 0.3, duration: 0.5, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 60%' },
      })

      gsap.from(sectionRef.current!.querySelectorAll('.step-text'), {
        y: 20, opacity: 0, stagger: 0.3, duration: 0.4, ease: 'expo.out', delay: 0.2,
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 60%' },
      })
    })
    return () => ctx.revert()
  }, [])

  const steps = [
    { num: '1', title: 'Paste Your Prompt', desc: 'Enter any prompt — rough idea, vague instruction, or partial query. No format required.' },
    { num: '2', title: 'Choose Your Model', desc: 'Select your target AI model. We optimize specifically for each model\'s strengths and quirks.' },
    { num: '3', title: 'Get Optimized Results', desc: 'Receive an enhanced prompt with higher specificity, better structure, and improved output quality.' },
  ]

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-24"
      style={{ background: 'linear-gradient(180deg, #13131F 0%, #0A0A0F 100%)' }}
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-16">
        <h2 className="hiw-header mb-16 text-center font-display text-2xl font-bold leading-tight tracking-[-0.015em] text-white md:text-4xl">
          Three Steps to Better AI Outputs
        </h2>

        <div className="relative">
          {/* Timeline line (desktop) */}
          <div
            ref={lineRef}
            className="absolute left-0 right-0 top-6 hidden h-0.5 origin-left md:block"
            style={{ background: 'linear-gradient(90deg, #A855F7, #06B6D4)' }}
          />

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((step) => (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                <div
                  className="step-circle z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #A855F7, #7C3AED)' }}
                >
                  {step.num}
                </div>
                <div className="step-text mt-6">
                  <h4 className="mb-2 font-display text-lg font-medium text-white">
                    {step.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-[#B4B4C7]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section 7: Testimonials ─── */
const testimonials = [
  {
    quote: 'PromptForge transformed how our team works with AI. What used to take 30 minutes of prompt tweaking now takes 10 seconds. The optimization quality is remarkable.',
    author: 'Sarah Chen',
    role: 'Lead AI Engineer, Vercel',
    avatar: '/testimonial-avatars/avatar1.jpg',
  },
  {
    quote: 'The Arena feature alone is worth it. Being able to compare GPT-4 and Claude side-by-side for the same prompt saves us hours of testing every week.',
    author: 'Marcus Johnson',
    role: 'CTO, ContentScale',
    avatar: '/testimonial-avatars/avatar2.jpg',
  },
  {
    quote: 'As a content creator, the image prompt optimizer is a game-changer. My Midjourney outputs went from generic to gallery-worthy overnight.',
    author: 'Elena Rodriguez',
    role: 'Digital Artist & YouTuber',
    avatar: '/testimonial-avatars/avatar3.jpg',
  },
]

function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelector('.test-header'), {
        y: 40, opacity: 0, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 85%' },
      })
      gsap.from(sectionRef.current!.querySelectorAll('.test-card'), {
        y: 40, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 75%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#0A0A0F] py-24 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-16">
        <div className="test-header mb-16">
          <span
            className="mb-4 inline-block rounded-full border border-[rgba(168,85,247,0.2)] px-3 py-1 text-xs font-medium text-[#C4B5FD]"
            style={{ background: 'rgba(168,85,247,0.12)' }}
          >
            Testimonials
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold leading-tight tracking-[-0.015em] text-white md:text-4xl">
            Loved by Prompt Engineers
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="test-card rounded-[20px] p-8"
              style={{
                background: 'rgba(19, 19, 31, 0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(168, 85, 247, 0.15)',
              }}
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>

              <p className="mb-6 text-sm leading-relaxed text-white">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-white">{t.author}</p>
                  <p className="text-xs text-[#6B7280]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Section 8: Pricing Teaser ─── */
function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelector('.price-header'), {
        y: 40, opacity: 0, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 85%' },
      })
      gsap.from(sectionRef.current!.querySelectorAll('.price-card'), {
        y: 50, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 75%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-[#13131F] py-24 lg:py-24">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="glow-purple h-[500px] w-[500px] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-[1000px] px-6 lg:px-16">
        <div className="price-header mb-16 text-center">
          <h2 className="font-display text-2xl font-bold leading-tight tracking-[-0.015em] text-white md:text-4xl">
            Start Free, Scale as You Grow
          </h2>
          <p className="mt-4 text-lg text-[#B4B4C7]">
            No credit card required. Get 50 free optimizations every month.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Free */}
          <div
            className="price-card rounded-[20px] p-8"
            style={{
              background: 'rgba(19, 19, 31, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(168, 85, 247, 0.15)',
            }}
          >
            <h3 className="font-display text-xl font-medium text-white">Free</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-white">$0</span>
              <span className="text-sm text-[#6B7280]">/month</span>
            </div>
            <ul className="mt-6 space-y-3">
              {['50 optimizations/month', '5 model comparisons/day', 'Basic templates library', 'Community support'].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#B4B4C7]">
                  <Check className="h-4 w-4 shrink-0 text-[#10B981]" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full rounded-xl border border-[rgba(168,85,247,0.3)] px-5 py-3 text-sm font-semibold text-[#B4B4C7] transition-all hover:border-[#A855F7] hover:text-white hover:bg-[rgba(168,85,247,0.08)]">
              Get Started
            </button>
          </div>

          {/* Pro */}
          <div
            className="price-card animate-glow-pulse relative rounded-[20px] border border-[#A855F7] p-8"
            style={{ background: 'rgba(19, 19, 31, 0.8)' }}
          >
            <div
              className="absolute right-0 top-0 rounded-bl-xl rounded-tr-[20px] px-4 py-1.5 text-[11px] font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #A855F7, #7C3AED)' }}
            >
              Most Popular
            </div>
            <h3 className="font-display text-xl font-medium text-white">Pro</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-white">$19</span>
              <span className="text-sm text-[#6B7280]">/month</span>
            </div>
            <ul className="mt-6 space-y-3">
              {['Unlimited optimizations', 'Unlimited model comparisons', 'Full template library (500+)', 'API access (1,000 calls/day)', 'Priority support', 'Custom model tuning'].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#B4B4C7]">
                  <Check className="h-4 w-4 shrink-0 text-[#10B981]" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/pricing"
              className="gradient-purple-cyan mt-8 flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:shadow-glow-purple"
            >
              Start Pro Trial
            </Link>
          </div>

          {/* Enterprise */}
          <div
            className="price-card rounded-[20px] p-8"
            style={{
              background: 'rgba(19, 19, 31, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(168, 85, 247, 0.15)',
            }}
          >
            <h3 className="font-display text-xl font-medium text-white">Enterprise</h3>
            <div className="mt-4">
              <span className="font-display text-3xl font-bold text-white">Custom</span>
            </div>
            <ul className="mt-6 space-y-3">
              {['Everything in Pro', 'Unlimited API access', 'SSO & team management', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#B4B4C7]">
                  <Check className="h-4 w-4 shrink-0 text-[#10B981]" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="mt-8 w-full rounded-xl border border-[rgba(168,85,247,0.3)] px-5 py-3 text-sm font-semibold text-[#B4B4C7] transition-all hover:border-[#A855F7] hover:text-white hover:bg-[rgba(168,85,247,0.08)]">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section 9: Final CTA ─── */
function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelector('.cta-content'), {
        y: 40, opacity: 0, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 85%' },
      })
      gsap.from(sectionRef.current!.querySelector('.cta-btn'), {
        y: 20, opacity: 0, duration: 0.5, delay: 0.3, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current!, start: 'top 85%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0A0A0F] py-32 lg:py-32"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[600px] w-[800px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.15) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 text-center lg:px-16">
        <div className="cta-content">
          <h2 className="mx-auto max-w-[700px] font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-white md:text-5xl">
            Ready to Supercharge Your Prompts?
          </h2>
          <p className="mx-auto mt-6 max-w-[560px] text-lg text-[#B4B4C7]">
            Join 50,000+ engineers and creators who trust PromptForge for their AI workflows.
          </p>
        </div>

        <div className="cta-btn mt-10">
          <Link
            to="/optimize"
            className="gradient-purple-cyan inline-flex items-center gap-2 rounded-xl px-9 py-[18px] text-[17px] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-glow-purple"
          >
            Get Started for Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-4 text-xs text-[#6B7280]">
            No credit card required &bull; Free forever plan
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── Home Page ─── */
export default function Home() {
  return (
    <div className="relative">
      <HeroSection />
      <SocialProofSection />
      <FeaturesSection />
      <ShowcaseSection />
      <UseCasesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </div>
  )
}
