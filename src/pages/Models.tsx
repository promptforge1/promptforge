import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Swords,
  ArrowRight,
  MessageSquare,
  Image,
  Code,
  Brain,
  Zap,
  Cpu,
} from 'lucide-react'

/* ───────────────────── easing ───────────────────── */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* ───────────────────── types ───────────────────── */
type Category = 'All' | 'Text' | 'Image' | 'Code' | 'Multimodal' | 'Open Source'

interface ModelData {
  id: string
  name: string
  provider: string
  category: Category
  description: string
  dots: [number, number, number, number, number]
  type: string
  context: string
  strengths: string[]
  cost: 'Free' | 'Standard' | 'Premium'
}

/* ───────────────────── model data ───────────────────── */
const models: ModelData[] = [
  {
    id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', category: 'Multimodal',
    description: 'Latest flagship model. Exceptional reasoning and multimodal understanding.',
    dots: [5, 5, 5, 5, 3], type: 'Multimodal', context: '128K',
    strengths: ['Reasoning', 'Coding', 'Vision'], cost: 'Premium',
  },
  {
    id: 'claude-3.5', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', category: 'Text',
    description: 'Outstanding at analysis, writing, and following complex instructions.',
    dots: [5, 4, 5, 4, 3], type: 'Text', context: '200K',
    strengths: ['Analysis', 'Writing', 'Safety'], cost: 'Premium',
  },
  {
    id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', category: 'Multimodal',
    description: 'Strong multimodal capabilities with excellent long-context handling.',
    dots: [4, 4, 4, 4, 4], type: 'Multimodal', context: '1M',
    strengths: ['Long context', 'Multimodal'], cost: 'Standard',
  },
  {
    id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', category: 'Text',
    description: 'Fast and cost-effective. Great for high-volume prompt optimization.',
    dots: [4, 3, 4, 5, 5], type: 'Text', context: '128K',
    strengths: ['Speed', 'Cost-efficiency'], cost: 'Standard',
  },
  {
    id: 'llama-3', name: 'Llama 3', provider: 'Meta', category: 'Open Source',
    description: 'Open-source powerhouse. Strong performance across general tasks.',
    dots: [4, 4, 3, 4, 5], type: 'Text', context: '8K',
    strengths: ['Open', 'Customizable'], cost: 'Free',
  },
  {
    id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral AI', category: 'Text',
    description: 'European champion. Excellent reasoning with efficient architecture.',
    dots: [4, 4, 4, 4, 4], type: 'Text', context: '32K',
    strengths: ['Reasoning', 'EU-hosted'], cost: 'Standard',
  },
  {
    id: 'cohere-command', name: 'Cohere Command', provider: 'Cohere AI', category: 'Text',
    description: 'Enterprise-focused with strong retrieval and business use cases.',
    dots: [4, 3, 3, 4, 4], type: 'Text', context: '128K',
    strengths: ['Enterprise', 'RAG'], cost: 'Standard',
  },
  {
    id: 'perplexity', name: 'Perplexity', provider: 'Perplexity AI', category: 'Text',
    description: 'Search-augmented responses with real-time information access.',
    dots: [4, 3, 4, 3, 3], type: 'Text', context: '128K',
    strengths: ['Search', 'Real-time'], cost: 'Standard',
  },
  {
    id: 'midjourney-v6', name: 'Midjourney v6', provider: 'Midjourney', category: 'Image',
    description: 'Industry-leading artistic image generation with incredible detail and style control.',
    dots: [5, 5, 2, 3, 2], type: 'Image', context: 'N/A',
    strengths: ['Art', 'Photorealism'], cost: 'Premium',
  },
  {
    id: 'dalle-3', name: 'DALL-E 3', provider: 'OpenAI', category: 'Image',
    description: 'Best text-in-image accuracy. Seamless integration with ChatGPT workflows.',
    dots: [4, 4, 2, 4, 3], type: 'Image', context: 'N/A',
    strengths: ['Text-in-image', 'Integration'], cost: 'Standard',
  },
  {
    id: 'sdxl', name: 'Stable Diffusion XL', provider: 'Stability AI', category: 'Image',
    description: 'Open-source flexibility. Highly customizable with extensive community models.',
    dots: [4, 4, 2, 4, 5], type: 'Image', context: 'N/A',
    strengths: ['Flexible', 'Open'], cost: 'Free',
  },
  {
    id: 'flux', name: 'FLUX', provider: 'Black Forest Labs', category: 'Image',
    description: 'State-of-the-art open image model. Photorealistic outputs with fine detail.',
    dots: [5, 5, 2, 4, 4], type: 'Image', context: 'N/A',
    strengths: ['Photorealism', 'Detail'], cost: 'Standard',
  },
  {
    id: 'claude-code', name: 'Claude 3.5 (Code)', provider: 'Anthropic', category: 'Code',
    description: 'Best-in-class coding assistant. Excels at debugging and architecture.',
    dots: [4, 5, 3, 4, 3], type: 'Code', context: '200K',
    strengths: ['Debugging', 'Architecture'], cost: 'Premium',
  },
  {
    id: 'gpt-4o-code', name: 'GPT-4o (Code)', provider: 'OpenAI', category: 'Code',
    description: 'Strong code generation and explanation across all major languages.',
    dots: [4, 5, 3, 5, 3], type: 'Code', context: '128K',
    strengths: ['Generation', 'Explanation'], cost: 'Premium',
  },
  {
    id: 'codellama', name: 'CodeLlama', provider: 'Meta', category: 'Open Source',
    description: 'Specialized code model. Open-source and fine-tunable for specific languages.',
    dots: [3, 4, 2, 4, 5], type: 'Code', context: '16K',
    strengths: ['Specialized', 'Fine-tunable'], cost: 'Free',
  },
]

const filterTabs: { label: string; value: Category; icon: React.ReactNode }[] = [
  { label: 'All Models', value: 'All', icon: <Brain className="h-4 w-4" /> },
  { label: 'Text / LLM', value: 'Text', icon: <MessageSquare className="h-4 w-4" /> },
  { label: 'Image', value: 'Image', icon: <Image className="h-4 w-4" /> },
  { label: 'Code', value: 'Code', icon: <Code className="h-4 w-4" /> },
  { label: 'Multimodal', value: 'Multimodal', icon: <Zap className="h-4 w-4" /> },
  { label: 'Open Source', value: 'Open Source', icon: <Cpu className="h-4 w-4" /> },
]

const comparisonModels = models.filter((m) =>
  ['gpt-4o', 'claude-3.5', 'gemini-pro', 'llama-3', 'midjourney-v6', 'dalle-3', 'sdxl', 'mistral-large'].includes(m.id),
)

const dotLabels = ['Reasoning', 'Coding', 'Creative', 'Speed', 'Cost']

/* ───────────────────── helpers ───────────────────── */
function getCategoryColor(cat: Category) {
  switch (cat) {
    case 'Text': return 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
    case 'Image': return 'border-pink-500/30 text-pink-400 bg-pink-500/10'
    case 'Code': return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    case 'Multimodal': return 'border-amber-500/30 text-amber-400 bg-amber-500/10'
    case 'Open Source': return 'border-[#A855F7]/30 text-[#C4B5FD] bg-[#A855F7]/10'
    default: return 'border-[#A855F7]/30 text-[#C4B5FD] bg-[#A855F7]/10'
  }
}

function Dot({ value, delay }: { value: number; delay: number }) {
  let bg: string
  if (value === 5) bg = 'bg-[#A855F7]'
  else if (value >= 3) bg = 'bg-[#A855F7]/40'
  else bg = 'bg-white/10'
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, delay, ease: easeOutExpo }}
      className={`h-2 w-2 rounded-full ${bg}`}
    />
  )
}

function CapabilityDots({ dots, baseDelay = 0 }: { dots: [number, number, number, number, number]; baseDelay?: number }) {
  return (
    <div className="mt-3">
      <div className="flex gap-1.5">
        {dots.map((d, i) => (
          <Dot key={i} value={d} delay={baseDelay + i * 0.08} />
        ))}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {dotLabels.map((label) => (
          <span key={label} className="w-2 text-center text-[9px] leading-none text-[#6B7280]">
            {label[0]}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────── ModelCard ───────────────────── */
function ModelCard({ model, index }: { model: ModelData; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: easeOutExpo }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 p-6 transition-all duration-300 hover:border-[#A855F7]/30 hover:shadow-[0_4px_30px_rgba(168,85,247,0.1)]"
      style={{
        background: 'linear-gradient(145deg, rgba(19,19,31,0.8) 0%, rgba(28,28,46,0.6) 100%)',
      }}
    >
      {/* hover shine */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'linear-gradient(180deg, rgba(168,85,247,0.06) 0%, transparent 40%)' }}
      />

      <div className="relative">
        {/* top row */}
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#A855F7]/20 to-[#06B6D4]/20">
            <span className="text-lg font-bold text-white">{model.name[0]}</span>
          </div>
          <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${getCategoryColor(model.category)}`}>
            {model.category}
          </span>
        </div>

        {/* name + provider */}
        <h3 className="mt-4 font-display text-lg font-semibold text-white">{model.name}</h3>
        <p className="text-xs text-[#6B7280]">{model.provider}</p>

        {/* description */}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#B4B4C7]">
          {model.description}
        </p>

        {/* capability dots */}
        <CapabilityDots dots={model.dots} baseDelay={index * 0.06 + 0.3} />

        {/* CTA */}
        <Link
          to="/optimize"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#C4B5FD] transition-colors hover:text-white"
        >
          Optimize for this
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  )
}

/* ───────────────────── ModelIcon (for table) ───────────────────── */
function ModelIcon({ name }: { name: string }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#A855F7]/20 to-[#06B6D4]/20 text-xs font-bold text-white">
      {name[0]}
    </div>
  )
}

/* ───────────────────── main component ───────────────────── */
export default function Models() {
  const [activeFilter, setActiveFilter] = useState<Category>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredModels = useMemo(() => {
    let result = models
    if (activeFilter !== 'All') {
      result = result.filter((m) => m.category === activeFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q),
      )
    }
    return result
  }, [activeFilter, searchQuery])

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0F]">
      {/* ── Section 1: Page Header ── */}
      <section className="relative flex min-h-[360px] items-center overflow-hidden">
        {/* animated gradient mesh */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -inset-[50%] opacity-[0.15]"
            style={{
              background: 'conic-gradient(from 0deg at 50% 50%, #A855F7, #06B6D4, #7C3AED, #A855F7)',
              animation: 'spin 20s linear infinite',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 py-16 lg:px-16">
          {/* breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="flex items-center gap-2 text-xs text-[#6B7280]"
          >
            <Link to="/" className="text-[#C4B5FD] transition-colors hover:text-white">Home</Link>
            <span>/</span>
            <span>Models</span>
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl"
          >
            20+ AI Models.
            <br />
            <span className="bg-gradient-to-r from-[#A855F7] to-[#06B6D4] bg-clip-text text-transparent">
              One Optimization Engine.
            </span>
          </motion.h1>

          {/* subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: easeOutExpo }}
            className="mt-4 max-w-[600px] text-lg text-[#B4B4C7]"
          >
            From GPT-4o to Stable Diffusion — optimize prompts for every major AI model on the market.
          </motion.p>

          {/* search bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: easeOutExpo }}
            className="mt-6 max-w-[480px]"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#A855F7]/15 bg-[#13131F] py-3.5 pl-12 pr-4 text-[15px] text-white placeholder-[#6B7280] transition-all focus:border-[#A855F7] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.15)] focus:outline-none"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Category Filters ── */}
      <section className="sticky top-[72px] z-40 border-b border-[#A855F7]/8"
        style={{ background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(16px)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOutExpo }}
          className="mx-auto flex max-w-[1280px] items-center gap-2 overflow-x-auto px-6 py-4 lg:px-16"
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`relative flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'border border-[#A855F7] text-white'
                    : 'border border-white/8 text-[#B4B4C7] hover:border-[#A855F7]/40'
                }`}
                style={isActive ? { background: 'rgba(168,85,247,0.15)' } : { background: 'transparent' }}
              >
                {tab.icon}
                {tab.label}
              </button>
            )
          })}
        </motion.div>
      </section>

      {/* ── Section 3: Model Grid ── */}
      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-16">
        <AnimatePresence mode="wait">
          {filteredModels.length > 0 ? (
            <motion.div
              key={activeFilter + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredModels.map((model, i) => (
                <ModelCard key={model.id} model={model} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <Search className="h-12 w-12 text-[#6B7280]" />
              <p className="mt-4 text-lg text-[#B4B4C7]">No models found</p>
              <p className="text-sm text-[#6B7280]">Try adjusting your search or filters</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Section 4: Model Comparison Table ── */}
      <section className="mx-6 my-12 overflow-hidden rounded-3xl bg-[#13131F] lg:mx-12">
        <div className="px-6 py-16 text-center lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="font-display text-3xl font-bold text-white md:text-4xl"
          >
            Compare at a Glance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
            className="mx-auto mt-3 max-w-lg text-[#B4B4C7]"
          >
            See how models stack up across key dimensions.
          </motion.p>
        </div>

        <div className="overflow-x-auto px-6 pb-16 lg:px-16">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr style={{ background: 'rgba(168,85,247,0.08)' }}>
                {['Model', 'Type', 'Context', 'Strengths', 'Cost', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-4 text-left text-sm font-semibold text-white">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonModels.map((model, i) => (
                <motion.tr
                  key={model.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: easeOutExpo }}
                  className="transition-colors duration-150 hover:bg-[#A855F7]/[0.04]"
                >
                  <td className="border-b border-white/[0.03] px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <ModelIcon name={model.name} />
                      <span className="font-semibold text-white">{model.name}</span>
                    </div>
                  </td>
                  <td className="border-b border-white/[0.03] px-4 py-3.5 text-sm text-[#B4B4C7]">
                    {model.type}
                  </td>
                  <td className="border-b border-white/[0.03] px-4 py-3.5 text-sm text-[#B4B4C7]">
                    {model.context}
                  </td>
                  <td className="border-b border-white/[0.03] px-4 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {model.strengths.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-[#A855F7]/20 bg-[#A855F7]/10 px-2 py-0.5 text-xs text-[#C4B5FD]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="border-b border-white/[0.03] px-4 py-3.5 text-sm font-medium">
                    <span
                      className={
                        model.cost === 'Free'
                          ? 'text-[#10B981]'
                          : model.cost === 'Standard'
                            ? 'text-[#06B6D4]'
                            : 'text-[#A855F7]'
                      }
                    >
                      {model.cost}
                    </span>
                  </td>
                  <td className="border-b border-white/[0.03] px-4 py-3.5">
                    <Link
                      to="/optimize"
                      className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#A855F7] to-[#7C3AED] px-4 py-2 text-xs font-semibold text-white transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    >
                      Optimize
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 5: CTA Banner ── */}
      <section
        className="border-y border-[#A855F7]/15 py-16"
        style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(6,182,212,0.1) 100%)',
        }}
      >
        <div className="mx-auto max-w-[1280px] px-6 text-center lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="font-display text-3xl font-bold text-white md:text-4xl"
          >
            Not Sure Which Model to Choose?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
            className="mx-auto mt-3 max-w-lg text-lg text-[#B4B4C7]"
          >
            Use our Model Arena to compare outputs side-by-side.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
            className="mt-6 flex flex-col items-center gap-4"
          >
            <Link
              to="#"
              className="animate-glow-pulse inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#7C3AED] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            >
              <Swords className="h-4 w-4" />
              Try Model Arena
            </Link>
            <Link
              to="/optimize"
              className="text-sm font-medium text-[#C4B5FD] transition-colors hover:text-white"
            >
              Or let us auto-select the best model →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
