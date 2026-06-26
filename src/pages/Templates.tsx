import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Star,
  Users,
  Sparkles,
  X,
  Copy,
  Check,
  ChevronDown,
  Upload,
  FileText,
  Code,
  TrendingUp,
  Image,
  BarChart3,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Palette,
} from 'lucide-react'

/* ───────────────────── easing ───────────────────── */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

/* ───────────────────── types ───────────────────── */
type CategoryKey = 'all' | 'writing' | 'marketing' | 'code' | 'image' | 'analysis' | 'brainstorming' | 'learning' | 'business' | 'creative'

interface Template {
  id: string
  title: string
  description: string
  category: CategoryKey
  categoryLabel: string
  coverImage: string
  rating: number
  uses: string
  prompt: string
  variables: { name: string; label: string; defaultValue: string }[]
}

/* ───────────────────── categories ───────────────────── */
const categories: { key: CategoryKey; label: string; count: number; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All Templates', count: 524, icon: <FileText className="h-4 w-4" /> },
  { key: 'writing', label: 'Writing & Content', count: 86, icon: <FileText className="h-4 w-4" /> },
  { key: 'marketing', label: 'Marketing & SEO', count: 64, icon: <TrendingUp className="h-4 w-4" /> },
  { key: 'code', label: 'Code & Development', count: 72, icon: <Code className="h-4 w-4" /> },
  { key: 'image', label: 'Image Generation', count: 58, icon: <Image className="h-4 w-4" /> },
  { key: 'analysis', label: 'Data Analysis', count: 45, icon: <BarChart3 className="h-4 w-4" /> },
  { key: 'brainstorming', label: 'Brainstorming', count: 38, icon: <Lightbulb className="h-4 w-4" /> },
  { key: 'learning', label: 'Learning & Education', count: 51, icon: <GraduationCap className="h-4 w-4" /> },
  { key: 'business', label: 'Business & Strategy', count: 43, icon: <Briefcase className="h-4 w-4" /> },
  { key: 'creative', label: 'Creative & Art', count: 67, icon: <Palette className="h-4 w-4" /> },
]

const coverMap: Record<CategoryKey, string> = {
  all: '/template-covers/writing.jpg',
  writing: '/template-covers/writing.jpg',
  marketing: '/template-covers/marketing.jpg',
  code: '/template-covers/coding.jpg',
  image: '/template-covers/image-gen.jpg',
  analysis: '/template-covers/analysis.jpg',
  brainstorming: '/template-covers/writing.jpg',
  learning: '/template-covers/analysis.jpg',
  business: '/template-covers/marketing.jpg',
  creative: '/template-covers/image-gen.jpg',
}

function getCategoryCover(cat: CategoryKey) {
  return coverMap[cat] || '/template-covers/writing.jpg'
}

function getCategoryLabel(cat: CategoryKey) {
  return categories.find((c) => c.key === cat)?.label || 'Other'
}

/* ───────────────────── mock templates (500+) ───────────────────── */
type ContentCat = Exclude<CategoryKey, 'all'>

const seedPrefixes: Record<ContentCat, string[]> = {
  writing: ['SEO Blog Post Writer', 'Article Summarizer', 'Email Newsletter Creator', 'Social Media Caption', 'Product Description', 'Press Release Writer', 'White Paper Outline', 'Case Study Writer', 'Landing Page Copy', 'Ad Copy Generator'],
  marketing: ['Marketing Campaign Generator', 'SEO Keyword Research', 'Google Ads Creator', 'Facebook Ad Copy', 'LinkedIn Post Strategy', 'Content Calendar Planner', 'Brand Voice Guide', 'Competitor Analysis', 'Customer Persona Builder', 'A/B Test Writer'],
  code: ['Code Review Assistant', 'Bug Fix Suggester', 'API Documentation', 'Unit Test Generator', 'Code Explainer', 'Refactoring Guide', 'Algorithm Designer', 'Database Schema', 'CI/CD Config', 'Security Audit'],
  image: ['Midjourney Portrait Prompt', 'Product Photo Prompt', 'Landscape Art Prompt', 'Character Design Prompt', 'Interior Design Prompt', 'Logo Concept Prompt', 'Fashion Design Prompt', 'Food Photography Prompt', 'Architecture Prompt', 'Concept Art Prompt'],
  analysis: ['Data Analysis Report', 'Sales Dashboard', 'User Behavior Analysis', 'Financial Forecast', 'Market Trend Report', 'Survey Results Summary', 'KPI Tracker', 'Risk Assessment', 'ROI Calculator', 'Anomaly Detection'],
  brainstorming: ['Idea Generator', 'Mind Map Creator', 'SWOT Analysis', 'Problem Solver', 'Creative Brief', 'Workshop Planner', 'Innovation Sprint', 'Team Retrospective', 'Stakeholder Map', 'Value Proposition Canvas'],
  learning: ['Study Guide Creator', 'Quiz Generator', 'Lesson Plan Writer', 'Flashcard Maker', 'Concept Explainer', 'Exam Prep Tutor', 'Book Summary', 'Course Outline', 'Learning Path', 'Research Assistant'],
  business: ['Business Plan Writer', 'Pitch Deck Outline', 'Executive Summary', 'OKR Planner', 'Meeting Agenda', 'Project Proposal', 'Vendor Evaluation', 'Change Management', 'Process Map', 'Decision Matrix'],
  creative: ['Story Plot Generator', 'Character Backstory', 'World Builder', 'Poetry Composer', 'Song Lyric Writer', 'Screenplay Scene', 'Comic Book Script', 'Game Design Doc', 'Podcast Script', 'Creative Writing Prompt'],
}

const seedDescriptions: Record<ContentCat, string[]> = {
  writing: ['Generate comprehensive, SEO-optimized content with proper structure and keyword integration.', 'Create engaging long-form content that drives organic traffic and reader engagement.', 'Craft compelling copy that converts readers into customers with proven frameworks.'],
  marketing: ['Create complete marketing campaigns with messaging, channels, and timeline.', 'Design data-driven marketing strategies with measurable KPIs and clear objectives.', 'Build cohesive brand narratives that resonate with your target audience segments.'],
  code: ['Get thorough code reviews with bug detection, performance tips, and best practices.', 'Generate production-ready code with proper error handling and documentation.', 'Optimize existing codebases for readability, performance, and maintainability.'],
  image: ['Generate detailed image prompts that produce stunning, high-quality visual results.', 'Create precision-crafted prompts optimized for photorealistic output.', 'Design artistic prompts with advanced style controls and composition techniques.'],
  analysis: ['Transform raw data into actionable insights with beautiful visualizations.', 'Build comprehensive analytics reports with trend analysis and recommendations.', 'Create executive-ready summaries from complex datasets in seconds.'],
  brainstorming: ['Unlock creative thinking with structured ideation frameworks.', 'Generate innovative solutions using proven design thinking methodologies.', 'Facilitate productive brainstorming sessions with guided frameworks.'],
  learning: ['Create structured learning materials tailored to any topic or skill level.', 'Generate interactive study guides that boost retention and comprehension.', 'Design comprehensive lesson plans with assessments and learning objectives.'],
  business: ['Develop professional business documents with strategic frameworks.', 'Create compelling proposals that win stakeholder buy-in and investment.', 'Build actionable business plans with financial projections and milestones.'],
  creative: ['Unleash creative potential with structured storytelling frameworks.', 'Generate original creative works with rich detail and emotional depth.', 'Explore new artistic directions with AI-powered creative prompts.'],
}

const seedPrompts: Record<ContentCat, string[]> = {
  writing: ['You are an expert content writer specializing in [TOPIC]. Write a comprehensive, SEO-optimized blog post of approximately [WORD_COUNT] words. The target audience is [AUDIENCE]. Include an engaging introduction, 3-5 main sections with H2 headings, a conclusion with a call-to-action, and naturally integrate these keywords: [KEYWORDS]. Use a [TONE] tone throughout.', 'Write a compelling [CONTENT_TYPE] about [TOPIC] for [AUDIENCE]. The piece should be around [WORD_COUNT] words, written in a [TONE] style. Focus on these key points: [KEY_POINTS]. End with a strong call-to-action.'],
  marketing: ['Design a complete marketing campaign for [PRODUCT/SERVICE] targeting [TARGET_AUDIENCE]. The campaign should run for [DURATION] across these channels: [CHANNELS]. Create messaging for each funnel stage (awareness, consideration, conversion). Set a budget of [BUDGET] with expected ROI of [ROI_TARGET].', 'Create a content marketing strategy for [BRAND] in the [INDUSTRY] industry. The strategy should cover [TIME_PERIOD] and focus on [GOALS]. Include content pillars, posting frequency, channel distribution, and KPIs.'],
  code: ['Review the following [LANGUAGE] code for bugs, security issues, and performance improvements:\n\n```\n[CODE]\n```\n\nProvide specific suggestions with line references. Check for: memory leaks, SQL injection, race conditions, unhandled errors, and code smells. Rate the code quality 1-10 and explain your rating.', 'Write a [LANGUAGE] function that [FUNCTION_DESCRIPTION]. The function should handle edge cases, include input validation, and have comprehensive error handling. Include unit tests using [TEST_FRAMEWORK].'],
  image: ['A stunning [STYLE] portrait of [SUBJECT], featuring [DETAILS]. The lighting is [LIGHTING_TYPE] with [COLOR_PALETTE] tones. Shot on [CAMERA/LENS], [COMPOSITION], depth of field, [MOOD] atmosphere, highly detailed, 8k resolution, professional photography quality.', 'Create a [STYLE] illustration of [SUBJECT] in a [SETTING]. The composition should feature [COMPOSITION_DETAILS]. Use [COLOR_SCHEME] colors with [ARTISTIC_TECHNIQUE]. Include [ATMOSPHERE] lighting, ultra-detailed, masterpiece quality.'],
  analysis: ['Analyze the following dataset and provide insights:\n\n[DATASET]\n\nFocus on: trends over time, correlations between variables, outliers, and actionable recommendations. Create a summary suitable for executive stakeholders. The business context is [CONTEXT].', 'Build a [REPORT_TYPE] report using the following data:\n\n[DATA]\n\nInclude: executive summary, methodology, key findings with visual descriptions, recommendations, and next steps. Tailor the analysis for [AUDIENCE].'],
  brainstorming: ['Generate [NUMBER] innovative ideas for [CHALLENGE/GOAL] in the [INDUSTRY] industry. Use the SCAMPER technique (Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse). For each idea, include: a title, brief description, feasibility score (1-10), and potential impact.', 'Conduct a comprehensive SWOT analysis for [SUBJECT] considering these factors: [FACTORS]. For each strength, weakness, opportunity, and threat, provide 3-5 bullet points with supporting reasoning.'],
  learning: ['Create a comprehensive study guide on [SUBJECT] for [AUDIENCE_LEVEL] learners. Organize content into these sections: Key Concepts (with definitions), Important Formulas/Principles, Common Misconceptions, Practice Questions (with answers), and Additional Resources. Focus on [SPECIFIC_TOPICS].', 'Design a [DURATION]-week lesson plan on [SUBJECT] for [GRADE_LEVEL/audience]. Each week should include: learning objectives, suggested activities, assessment methods, and required materials. Align with [STANDARDS] if applicable.'],
  business: ['Write a professional business plan for [COMPANY/IDEA] in the [INDUSTRY] sector. Include: Executive Summary, Company Description, Market Analysis, Organization & Management, Service/Product Line, Marketing & Sales Strategy, Funding Request (if applicable), Financial Projections for [TIME_PERIOD], and Appendix suggestions.', 'Create a compelling pitch deck outline for [COMPANY/PRODUCT] seeking [FUNDING_AMOUNT] in [FUNDING_TYPE]. Structure it as: Problem, Solution, Market Opportunity, Business Model, Traction, Team, Financials, Ask. Include speaker notes for each slide.'],
  creative: ['Write a [GENRE] story opening of approximately [WORD_COUNT] words. The protagonist is [PROTAGONIST_DESCRIPTION] and the setting is [SETTING]. The story should begin with [OPENING_TYPE] and establish [THEMES] as central themes. Use [WRITING_STYLE] prose.', 'Create a detailed world-building document for a [GENRE] setting. Include: geography and climate, major cultures and societies, political systems, magic/technology rules, key historical events, and notable locations. The tone should be [TONE].'],
}

const seedVariables: Record<ContentCat, { name: string; label: string; defaultValue: string }[][]> = {
  writing: [
    [{ name: 'TOPIC', label: 'Topic', defaultValue: 'artificial intelligence in healthcare' }, { name: 'WORD_COUNT', label: 'Word Count', defaultValue: '1500' }, { name: 'AUDIENCE', label: 'Audience', defaultValue: 'healthcare professionals' }, { name: 'KEYWORDS', label: 'Keywords', defaultValue: 'AI healthcare, medical diagnosis, patient care' }, { name: 'TONE', label: 'Tone', defaultValue: 'professional and informative' }],
    [{ name: 'TOPIC', label: 'Topic', defaultValue: 'remote work best practices' }, { name: 'WORD_COUNT', label: 'Word Count', defaultValue: '1200' }, { name: 'AUDIENCE', label: 'Audience', defaultValue: 'business leaders' }, { name: 'TONE', label: 'Tone', defaultValue: 'conversational' }, { name: 'KEY_POINTS', label: 'Key Points', defaultValue: 'productivity, communication, work-life balance' }],
  ],
  marketing: [
    [{ name: 'PRODUCT/SERVICE', label: 'Product/Service', defaultValue: 'SaaS project management tool' }, { name: 'TARGET_AUDIENCE', label: 'Target Audience', defaultValue: 'remote teams' }, { name: 'DURATION', label: 'Duration', defaultValue: '3 months' }, { name: 'CHANNELS', label: 'Channels', defaultValue: 'LinkedIn, email, content marketing' }, { name: 'BUDGET', label: 'Budget', defaultValue: '$50,000' }],
    [{ name: 'BRAND', label: 'Brand', defaultValue: 'EcoFriendly Co' }, { name: 'INDUSTRY', label: 'Industry', defaultValue: 'sustainable consumer goods' }, { name: 'TIME_PERIOD', label: 'Time Period', defaultValue: 'Q3 2025' }, { name: 'GOALS', label: 'Goals', defaultValue: 'brand awareness, lead generation' }],
  ],
  code: [
    [{ name: 'LANGUAGE', label: 'Language', defaultValue: 'Python' }, { name: 'CODE', label: 'Code', defaultValue: 'def process_data(data):\n    result = []\n    for item in data:\n        result.append(item * 2)\n    return result' }],
    [{ name: 'LANGUAGE', label: 'Language', defaultValue: 'TypeScript' }, { name: 'FUNCTION_DESCRIPTION', label: 'Function Description', defaultValue: 'validates email addresses using regex' }, { name: 'TEST_FRAMEWORK', label: 'Test Framework', defaultValue: 'Jest' }],
  ],
  image: [
    [{ name: 'STYLE', label: 'Style', defaultValue: 'cinematic' }, { name: 'SUBJECT', label: 'Subject', defaultValue: 'a young woman with flowing red hair' }, { name: 'DETAILS', label: 'Details', defaultValue: 'freckles, green eyes, wearing a vintage leather jacket' }, { name: 'LIGHTING_TYPE', label: 'Lighting', defaultValue: 'golden hour side lighting' }, { name: 'COLOR_PALETTE', label: 'Color Palette', defaultValue: 'warm amber and deep burgundy' }],
    [{ name: 'STYLE', label: 'Style', defaultValue: 'digital art' }, { name: 'SUBJECT', label: 'Subject', defaultValue: 'a futuristic cyberpunk cityscape' }, { name: 'SETTING', label: 'Setting', defaultValue: 'rain-soaked streets at night' }, { name: 'COLOR_SCHEME', label: 'Color Scheme', defaultValue: 'neon blue and magenta' }],
  ],
  analysis: [
    [{ name: 'DATASET', label: 'Dataset', defaultValue: 'Monthly sales: Jan: 45k, Feb: 52k, Mar: 48k, Apr: 61k, May: 58k, Jun: 72k' }, { name: 'CONTEXT', label: 'Context', defaultValue: 'quarterly revenue review for a D2C e-commerce brand' }],
    [{ name: 'DATA', label: 'Data', defaultValue: 'Customer satisfaction scores: Product A: 4.2/5, Product B: 3.8/5, Product C: 4.6/5' }, { name: 'REPORT_TYPE', label: 'Report Type', defaultValue: 'comparative analysis' }, { name: 'AUDIENCE', label: 'Audience', defaultValue: 'product managers' }],
  ],
  brainstorming: [
    [{ name: 'NUMBER', label: 'Number of Ideas', defaultValue: '10' }, { name: 'CHALLENGE/GOAL', label: 'Challenge/Goal', defaultValue: 'reducing plastic waste in packaging' }, { name: 'INDUSTRY', label: 'Industry', defaultValue: 'consumer goods' }],
    [{ name: 'SUBJECT', label: 'Subject', defaultValue: 'a new mobile fitness app' }, { name: 'FACTORS', label: 'Factors', defaultValue: 'market saturation, user retention, technology trends' }],
  ],
  learning: [
    [{ name: 'SUBJECT', label: 'Subject', defaultValue: 'machine learning fundamentals' }, { name: 'AUDIENCE_LEVEL', label: 'Audience Level', defaultValue: 'beginner' }, { name: 'SPECIFIC_TOPICS', label: 'Specific Topics', defaultValue: 'supervised learning, neural networks, model evaluation' }],
    [{ name: 'DURATION', label: 'Duration (weeks)', defaultValue: '8' }, { name: 'SUBJECT', label: 'Subject', defaultValue: 'creative writing' }, { name: 'GRADE_LEVEL', label: 'Grade Level', defaultValue: 'high school juniors and seniors' }],
  ],
  business: [
    [{ name: 'COMPANY/IDEA', label: 'Company/Idea', defaultValue: 'SmartHome AI, a voice-controlled home automation system' }, { name: 'INDUSTRY', label: 'Industry', defaultValue: 'smart home technology' }, { name: 'TIME_PERIOD', label: 'Time Period', defaultValue: '3 years' }],
    [{ name: 'COMPANY/PRODUCT', label: 'Company/Product', defaultValue: 'CloudSync, a real-time collaboration platform' }, { name: 'FUNDING_AMOUNT', label: 'Funding Amount', defaultValue: '$2M' }, { name: 'FUNDING_TYPE', label: 'Funding Type', defaultValue: 'Series A' }],
  ],
  creative: [
    [{ name: 'GENRE', label: 'Genre', defaultValue: 'science fiction' }, { name: 'WORD_COUNT', label: 'Word Count', defaultValue: '800' }, { name: 'PROTAGONIST_DESCRIPTION', label: 'Protagonist', defaultValue: 'a retired astronaut haunted by memories of Mars' }, { name: 'SETTING', label: 'Setting', defaultValue: 'a dying Earth colony in 2157' }, { name: 'WRITING_STYLE', label: 'Writing Style', defaultValue: 'lyrical and atmospheric' }],
    [{ name: 'GENRE', label: 'Genre', defaultValue: 'high fantasy' }, { name: 'TONE', label: 'Tone', defaultValue: 'grimdark with moments of hope' }],
  ],
}

function generateTemplates(): Template[] {
  const templates: Template[] = []
  let idCounter = 1

  const catKeys: ContentCat[] = ['writing', 'marketing', 'code', 'image', 'analysis', 'brainstorming', 'learning', 'business', 'creative']

  catKeys.forEach((cat: ContentCat) => {
    const prefixes = seedPrefixes[cat]
    const descriptions = seedDescriptions[cat]
    const prompts = seedPrompts[cat]
    const variables = seedVariables[cat]

    prefixes.forEach((prefix: string, i: number) => {
      const descIdx = i % descriptions.length
      const promptIdx = i % prompts.length
      const varIdx = i % variables.length

      templates.push({
        id: `tpl-${idCounter++}`,
        title: prefix,
        description: descriptions[descIdx],
        category: cat,
        categoryLabel: getCategoryLabel(cat),
        coverImage: getCategoryCover(cat),
        rating: +(4.5 + Math.random() * 0.5).toFixed(1),
        uses: `${(Math.random() * 5 + 0.5).toFixed(1)}k`,
        prompt: prompts[promptIdx],
        variables: variables[varIdx],
      })
    })

    // Add more templates to reach 500+
    const extraCount = categories.find((c) => c.key === cat)?.count ?? 0
    const extraNeeded = extraCount - prefixes.length
    for (let j = 0; j < extraNeeded; j++) {
      const prefixIdx = j % prefixes.length
      const descIdx = j % descriptions.length
      const promptIdx = j % prompts.length
      const varIdx = j % variables.length

      templates.push({
        id: `tpl-${idCounter++}`,
        title: `${prefixes[prefixIdx]} ${['Pro', 'Advanced', 'V2', 'Premium', 'Ultimate', 'Elite'][j % 6]}`,
        description: descriptions[descIdx],
        category: cat,
        categoryLabel: getCategoryLabel(cat),
        coverImage: getCategoryCover(cat),
        rating: +(4.5 + Math.random() * 0.5).toFixed(1),
        uses: `${(Math.random() * 5 + 0.5).toFixed(1)}k`,
        prompt: prompts[promptIdx],
        variables: variables[varIdx],
      })
    }
  })

  return templates
}

const allTemplates = generateTemplates()

/* ───────────────────── TemplateCard ───────────────────── */
function TemplateCard({
  template,
  index,
  onSelect,
}: {
  template: Template
  index: number
  onSelect: (t: Template) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: easeOutExpo }}
      whileHover={{ y: -3 }}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-[rgba(19,19,31,0.6)] backdrop-blur-xl transition-all duration-300 hover:border-[#A855F7]/25 hover:shadow-[0_8px_32px_rgba(168,85,247,0.1)]"
      onClick={() => onSelect(template)}
    >
      {/* cover image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={template.coverImage}
          alt={template.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#13131F] to-transparent" />
      </div>

      {/* content */}
      <div className="p-5">
        <span className="inline-block rounded-full border border-[#A855F7]/20 bg-[#A855F7]/10 px-2.5 py-0.5 text-xs font-medium text-[#C4B5FD]">
          {template.categoryLabel}
        </span>

        <h3 className="mt-3 font-display text-base font-semibold text-white">{template.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#B4B4C7]">
          {template.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#6B7280]">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              {template.rating}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {template.uses} uses
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect(template)
            }}
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-[#A855F7] to-[#7C3AED] px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          >
            Use Template
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ───────────────────── TemplatePreviewModal ───────────────────── */
function TemplatePreviewModal({
  template,
  onClose,
}: {
  template: Template
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [varValues, setVarValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    template.variables.forEach((v) => {
      initial[v.name] = v.defaultValue
    })
    return initial
  })

  const processedPrompt = useMemo(() => {
    let prompt = template.prompt
    template.variables.forEach((v) => {
      prompt = prompt.replace(new RegExp(`\\[${v.name}\\]`, 'g'), varValues[v.name] || `[${v.name}]`)
    })
    return prompt
  }, [template, varValues])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(processedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: easeOutExpo }}
        className="relative flex max-h-[80vh] w-full max-w-[800px] flex-col overflow-hidden rounded-2xl border border-[#A855F7]/15 bg-[#13131F]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-start justify-between border-b border-white/5 p-6">
          <div>
            <span className="inline-block rounded-full border border-[#A855F7]/20 bg-[#A855F7]/10 px-2.5 py-0.5 text-xs font-medium text-[#C4B5FD]">
              {template.categoryLabel}
            </span>
            <h3 className="mt-2 font-display text-xl font-bold text-white">{template.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#6B7280] transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* prompt preview */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
              Template Prompt
            </label>
            <div className="relative mt-2 overflow-hidden rounded-xl bg-[#0A0A0F] p-5">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[#B4B4C7]">
                {processedPrompt}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute right-3 top-3 rounded-lg bg-white/5 p-2 text-[#6B7280] transition-colors hover:bg-white/10 hover:text-white"
              >
                {copied ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* customization fields */}
          {template.variables.length > 0 && (
            <div className="mt-6">
              <label className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                Customize Variables
              </label>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {template.variables.map((v) => (
                  <div key={v.name}>
                    <label className="mb-1 block text-xs text-[#B4B4C7]">{v.label}</label>
                    <input
                      type="text"
                      value={varValues[v.name] || ''}
                      onChange={(e) =>
                        setVarValues((prev) => ({ ...prev, [v.name]: e.target.value }))
                      }
                      className="w-full rounded-xl border border-[#A855F7]/15 bg-[#0A0A0F] px-4 py-2.5 text-sm text-white placeholder-[#6B7280] transition-all focus:border-[#A855F7] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.15)] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* actions */}
        <div className="flex flex-col gap-3 border-t border-white/5 p-6 sm:flex-row">
          <Link
            to="/optimize"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#7C3AED] px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            <Sparkles className="h-4 w-4" />
            Optimize This Prompt
          </Link>
          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#A855F7]/30 px-6 py-3 text-sm font-semibold text-[#B4B4C7] transition-all hover:border-[#A855F7] hover:bg-[#A855F7]/8 hover:text-white"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copy Raw Template
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ───────────────────── StatCounter ───────────────────── */
function StatCounter({ target, suffix = '', duration = 1.5 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = performance.now()
          const animate = (currentTime: number) => {
            const elapsed = (currentTime - startTime) / 1000
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 4)
            setCount(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <div ref={ref} className="font-display text-4xl font-bold md:text-5xl"
      style={{ background: 'linear-gradient(135deg, #A855F7, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      {count}{suffix}
    </div>
  )
}

/* ───────────────────── FloatingParticles ───────────────────── */
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w: number, h: number
    let particles: { x: number; y: number; vx: number; vy: number; r: number; color: string }[] = []
    let animId: number

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      w = rect.width
      h = rect.height
      canvas.width = w
      canvas.height = h
    }

    const init = () => {
      resize()
      particles = []
      const count = 200
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          color: Math.random() > 0.5 ? 'rgba(168,85,247,0.4)' : 'rgba(6,182,212,0.4)',
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }

    init()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0" style={{ opacity: 0.4 }} />
}

/* ───────────────────── main component ───────────────────── */
export default function Templates() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [sortOpen, setSortOpen] = useState(false)

  const filteredTemplates = useMemo(() => {
    let result = allTemplates
    if (activeCategory !== 'all') {
      result = result.filter((t) => t.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.categoryLabel.toLowerCase().includes(q),
      )
    }
    return result
  }, [activeCategory, searchQuery])

  const handleCloseModal = useCallback(() => setSelectedTemplate(null), [])

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedTemplate(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0F]">
      {/* ── Section 1: Page Header ── */}
      <section className="relative flex min-h-[320px] items-center overflow-hidden">
        <FloatingParticles />

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
            <span>Templates</span>
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="mt-4 font-display text-4xl font-bold text-white md:text-5xl"
          >
            500+ Battle-Tested Templates
          </motion.h1>

          {/* subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
            className="mt-3 max-w-[600px] text-lg text-[#B4B4C7]"
          >
            Professional prompts for every use case. Copy, customize, and optimize in one click.
          </motion.p>

          {/* search + filter row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: easeOutExpo }}
            className="mt-6 flex max-w-[720px] flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search templates (e.g., 'blog', 'code review', 'midjourney')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#A855F7]/15 bg-[#13131F] py-3.5 pl-12 pr-4 text-[15px] text-white placeholder-[#6B7280] transition-all focus:border-[#A855F7] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.15)] focus:outline-none"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#A855F7]/15 bg-[#13131F] px-4 py-3.5 text-sm text-[#B4B4C7] transition-all hover:border-[#A855F7]/40 sm:w-[180px]"
              >
                <span>All Categories</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-[#A855F7]/15 bg-[#1C1C2E] py-1 shadow-xl">
                  {categories.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => {
                        setActiveCategory(c.key)
                        setSortOpen(false)
                      }}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                        activeCategory === c.key ? 'bg-[#A855F7]/15 text-white' : 'text-[#B4B4C7] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {c.icon}
                      {c.label}
                      <span className="ml-auto text-xs text-[#6B7280]">{c.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Category Sidebar + Template Grid ── */}
      <section className="mx-auto max-w-[1280xl] px-6 py-12 lg:px-16">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="shrink-0 lg:w-60"
          >
            <div className="sticky top-24 border-r border-[#A855F7]/8 pr-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#6B7280]">Categories</h3>
              <nav className="flex flex-col gap-0.5">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.key
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm transition-all ${
                        isActive
                          ? 'bg-[#A855F7]/12 font-medium text-white'
                          : 'text-[#B4B4C7] hover:bg-[#A855F7]/6 hover:text-white'
                      }`}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                      <span className={`ml-auto text-xs ${isActive ? 'text-[#B4B4C7]' : 'text-[#6B7280]'}`}>
                        {cat.count}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </motion.aside>

          {/* template grid */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {filteredTemplates.length > 0 ? (
                <motion.div
                  key={activeCategory + searchQuery}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {filteredTemplates.map((template, i) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      index={i}
                      onSelect={setSelectedTemplate}
                    />
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
                  <p className="mt-4 text-lg text-[#B4B4C7]">No templates found</p>
                  <p className="text-sm text-[#6B7280]">Try adjusting your search or category filter</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Section 4: Community Templates Teaser ── */}
      <section className="mx-6 my-12 overflow-hidden rounded-3xl bg-[#13131F] lg:mx-12">
        <div className="px-6 py-16 text-center lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="font-display text-3xl font-bold text-white md:text-4xl"
          >
            Built by the Community
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
            className="mx-auto mt-3 max-w-lg text-[#B4B4C7]"
          >
            Our template library grows every day thanks to contributions from prompt engineers worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
            className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="text-center">
              <StatCounter target={500} suffix="+" />
              <p className="mt-2 text-xs uppercase tracking-wider text-[#6B7280]">Templates</p>
            </div>
            <div className="text-center">
              <StatCounter target={50} suffix="K+" />
              <p className="mt-2 text-xs uppercase tracking-wider text-[#6B7280]">Monthly Uses</p>
            </div>
            <div className="text-center">
              <StatCounter target={200} suffix="+" />
              <p className="mt-2 text-xs uppercase tracking-wider text-[#6B7280]">Contributors</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4, ease: easeOutExpo }}
            className="mt-8"
          >
            <button className="inline-flex items-center gap-2 rounded-xl border border-[#A855F7]/30 px-6 py-3 text-sm font-semibold text-[#B4B4C7] transition-all hover:border-[#A855F7] hover:bg-[#A855F7]/8 hover:text-white">
              <Upload className="h-4 w-4" />
              Submit a Template
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Section 5: CTA ── */}
      <section className="relative overflow-hidden py-24">
        {/* radial purple glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.15) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1280px] px-6 text-center lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="font-display text-3xl font-bold text-white md:text-4xl"
          >
            Can&apos;t Find What You Need?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
            className="mx-auto mt-3 max-w-lg text-lg text-[#B4B4C7]"
          >
            Our AI can generate a custom template for any use case in seconds.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
            className="mt-6 flex flex-col items-center gap-4"
          >
            <Link
              to="/optimize"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#7C3AED] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            >
              <Sparkles className="h-4 w-4" />
              Generate Custom Template
            </Link>
            <Link
              to="/optimize"
              className="text-sm font-medium text-[#C4B5FD] transition-colors hover:text-white"
            >
              Or write your own and optimize it →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selectedTemplate && (
          <TemplatePreviewModal template={selectedTemplate} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </div>
  )
}
