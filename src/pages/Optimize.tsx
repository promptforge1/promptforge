import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Bookmark,
  Download,
  ChevronDown,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Zap,
  MessageSquare,
  Image,
  Code,
  Terminal,
  TrendingUp,
  Mail,
  Lightbulb,
  Search,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Model {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface LogEntry {
  id: number;
  text: string;
  timestamp: number;
}

interface Metric {
  name: string;
  score: number;
  color: string;
}

interface HistoryItem {
  id: number;
  text: string;
  timestamp: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const MODELS: Model[] = [
  { id: 'gpt4o', name: 'GPT-4o', subtitle: 'OpenAI', icon: <Zap className="h-5 w-5" /> },
  { id: 'claude', name: 'Claude 3.5', subtitle: 'Anthropic', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'gemini', name: 'Gemini Pro', subtitle: 'Google', icon: <Search className="h-5 w-5" /> },
  { id: 'midjourney', name: 'Midjourney', subtitle: 'v6', icon: <Image className="h-5 w-5" /> },
  { id: 'dalle', name: 'DALL-E 3', subtitle: 'OpenAI', icon: <Image className="h-5 w-5" /> },
  { id: 'stable', name: 'Stable Diff.', subtitle: 'SDXL', icon: <Image className="h-5 w-5" /> },
  { id: 'llama', name: 'Llama 3', subtitle: 'Meta', icon: <Terminal className="h-5 w-5" /> },
  { id: 'mistral', name: 'Mistral', subtitle: 'Large', icon: <Code className="h-5 w-5" /> },
];

const TEMPLATES = [
  { label: 'Blog Post', icon: <MessageSquare className="h-3 w-3" /> },
  { label: 'Code Review', icon: <Code className="h-3 w-3" /> },
  { label: 'Image Gen', icon: <Image className="h-3 w-3" /> },
  { label: 'Email', icon: <Mail className="h-3 w-3" /> },
  { label: 'Brainstorm', icon: <Lightbulb className="h-3 w-3" /> },
  { label: 'Analyze', icon: <TrendingUp className="h-3 w-3" /> },
];

const LOG_MESSAGES = [
  'Analyzing prompt structure...',
  'Identifying target model patterns...',
  'Adding specificity and context...',
  'Applying tone adjustments...',
  'Reformatting for clarity...',
  'Adding structural markers...',
  'Final optimization complete',
];

const DEMO_ORIGINAL = `Write a blog post about AI tools.`;

const DEMO_OPTIMIZED = `Write a comprehensive, engaging blog post (1,200-1,500 words) about the latest AI tools transforming creative workflows in 2024.

Structure the post with:
- An attention-grabbing introduction highlighting a surprising statistic about AI adoption
- 5 clearly defined sections, each covering a different category of AI tools:
  1. AI writing assistants (e.g., Jasper, Copy.ai)
  2. AI image generators (e.g., Midjourney, DALL-E 3, Stable Diffusion)
  3. AI video creation tools (e.g., Runway, Synthesia)
  4. AI audio/voice tools (e.g., ElevenLabs, Murf)
  5. AI productivity enhancers (e.g., Notion AI, Mem)

For each tool, include:
- A brief description of what it does
- Key features and capabilities
- Pricing tier (free/freemium/paid)
- One concrete use case or example

Target audience: Creative professionals and content marketers curious about integrating AI into their workflow. Tone: Professional yet approachable, with a touch of enthusiasm.

End with a forward-looking conclusion about where AI tooling is headed in 2025, and include a call-to-action encouraging readers to experiment with at least one tool mentioned.`;

/* ------------------------------------------------------------------ */
/*  Easing                                                              */
/* ------------------------------------------------------------------ */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function TypewriterText({ text, speed = 8, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    indexRef.current = 0;

    const interval = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current <= text.length) {
        setDisplayed(text.slice(0, indexRef.current));
      } else {
        clearInterval(interval);
        setShowCursor(false);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className="font-mono-code text-sm leading-[1.7] text-white">
      {displayed}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="ml-0.5 inline-block h-4 w-[2px] bg-[#A855F7] align-middle"
        />
      )}
    </span>
  );
}

function AnimatedScore({ score }: { score: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(score * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      className="text-center"
    >
      <div className="font-display text-5xl font-bold text-gradient">
        {current}
        <span className="text-2xl text-[#6B7280]">/100</span>
      </div>
      <div className="mt-1 text-xs font-medium text-[#6B7280]">Quality Score</div>
    </motion.div>
  );
}

function MetricBars({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="mt-4 space-y-3">
      {metrics.map((m, i) => (
        <div key={m.name} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#B4B4C7]">{m.name}</span>
            <span className="text-xs font-medium text-white">{m.score}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#1C1C2E]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${m.score}%` }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: easeOutExpo }}
              className="h-full rounded-full"
              style={{ background: m.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DiffViewer({ original, optimized }: { original: string; optimized: string }) {
  const diffParts = computeDiff(original, optimized);

  return (
    <div className="font-mono-code text-sm leading-[1.7]">
      {diffParts.map((part, i) => (
        <span
          key={i}
          className={cn(
            part.type === 'added' && 'rounded bg-[rgba(16,185,129,0.15)] px-0.5 text-[#10B981]',
            part.type === 'kept' && 'text-white',
            part.type === 'removed' && 'rounded bg-[rgba(239,68,68,0.15)] px-0.5 text-[#EF4444] line-through opacity-50'
          )}
        >
          {part.text}
        </span>
      ))}
    </div>
  );
}

/* Simple diff: split by whitespace, compare tokens */
function computeDiff(original: string, optimized: string) {
  const origTokens = original.split(/(\s+)/);
  const optTokens = optimized.split(/(\s+)/);
  const parts: { text: string; type: 'kept' | 'added' | 'removed' }[] = [];

  let oi = 0;
  for (const token of optTokens) {
    if (token.match(/^\s+$/)) {
      parts.push({ text: token, type: 'kept' });
      continue;
    }
    const foundIdx = origTokens.indexOf(token, oi);
    if (foundIdx !== -1) {
      while (oi < foundIdx) {
        const skipped = origTokens[oi];
        if (skipped && !skipped.match(/^\s+$/)) {
          parts.push({ text: skipped + (origTokens[oi + 1]?.match(/^\s+$/) ? origTokens[oi + 1] : ''), type: 'removed' });
        }
        oi++;
      }
      parts.push({ text: token, type: 'kept' });
      oi = foundIdx + 1;
    } else {
      parts.push({ text: token, type: 'added' });
    }
  }

  if (parts.length === 0 && optTokens.length > 0) {
    return optTokens.map(t => ({ text: t, type: 'added' as const }));
  }

  return parts.length > 0 ? parts : optTokens.map(t => ({ text: t, type: 'added' as const }));
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */
export default function Optimize() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt4o');
  const [strength, setStrength] = useState([75]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [optimizedText, setOptimizedText] = useState('');
  const [activeTab, setActiveTab] = useState<'optimized' | 'compare' | 'preview'>('optimized');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const showLeftPanel = true;
  const showCenterPanel = true;
  const [qualityScore, setQualityScore] = useState(0);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 1, text: 'Write a compelling product description for wireless earbuds with noise cancellation...', timestamp: '2m ago' },
    { id: 2, text: 'Explain quantum computing to a 10-year-old in simple terms with analogies...', timestamp: '15m ago' },
    { id: 3, text: 'Generate a creative marketing email campaign for a fitness app launch...', timestamp: '1h ago' },
  ]);
  const [copied, setCopied] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [promptLength, setPromptLength] = useState<'concise' | 'balanced' | 'detailed'>('balanced');
  const [tone, setTone] = useState('Professional');
  const [includeExamples, setIncludeExamples] = useState(true);
  const [addStructure, setAddStructure] = useState(true);
  const [includeConstraints, setIncludeConstraints] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const logIdRef = useRef(0);

  /* Scroll logs to bottom */
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = useCallback((text: string) => {
    logIdRef.current += 1;
    setLogs(prev => [...prev, { id: logIdRef.current, text, timestamp: Date.now() }]);
  }, []);

  const handleOptimize = useCallback(() => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }

    setIsOptimizing(true);
    setIsOptimized(false);
    setOptimizedText('');
    setLogs([]);
    setQualityScore(0);
    setMetrics([]);

    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < LOG_MESSAGES.length) {
        addLog(LOG_MESSAGES[logIdx]);
        logIdx++;
      }
    }, 350);

    setTimeout(() => {
      clearInterval(logInterval);
      addLog('Final optimization complete ✓');
      setOptimizedText(DEMO_OPTIMIZED);
      setQualityScore(94);
      setMetrics([
        { name: 'Clarity', score: 96, color: 'linear-gradient(90deg, #A855F7, #7C3AED)' },
        { name: 'Specificity', score: 92, color: 'linear-gradient(90deg, #7C3AED, #06B6D4)' },
        { name: 'Structure', score: 95, color: 'linear-gradient(90deg, #A855F7, #06B6D4)' },
        { name: 'Context', score: 93, color: 'linear-gradient(90deg, #06B6D4, #10B981)' },
      ]);
      setIsOptimizing(false);
      setIsOptimized(true);
      setActiveTab('optimized');
    }, 2800);
  }, [prompt, addLog]);

  const handleCopy = useCallback(async () => {
    if (!optimizedText) return;
    await navigator.clipboard.writeText(optimizedText);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }, [optimizedText]);

  const handleNewOptimization = useCallback(() => {
    setPrompt('');
    setIsOptimized(false);
    setOptimizedText('');
    setLogs([]);
    setQualityScore(0);
    setMetrics([]);
    setActiveTemplate(null);
  }, []);

  const handleTemplateClick = useCallback((label: string) => {
    setActiveTemplate(label);
    const templates: Record<string, string> = {
      'Blog Post': 'Write a blog post about the future of artificial intelligence and its impact on society.',
      'Code Review': 'Review this code for performance issues and suggest optimizations.',
      'Image Gen': 'A serene mountain landscape at sunset with a crystal clear lake reflection, photorealistic, 8k resolution.',
      'Email': 'Write a professional follow-up email after a job interview.',
      'Brainstorm': 'Generate 10 creative marketing campaign ideas for a sustainable fashion brand.',
      'Analyze': 'Analyze the strengths and weaknesses of the current business model for a SaaS startup.',
    };
    setPrompt(templates[label] || '');
  }, []);

  const handleHistoryClick = useCallback((item: HistoryItem) => {
    setPrompt(item.text);
  }, []);

  const handleSavePrompt = useCallback(() => {
    if (!prompt.trim()) {
      toast.error('Nothing to save');
      return;
    }
    toast.success('Prompt saved to library');
  }, [prompt]);

  /* ---- Panels visibility (tablet responsive) ---- */
  const [mobileShowLeft, setMobileShowLeft] = useState(false);
  const [mobileShowCenter, setMobileShowCenter] = useState(false);

  /* ---------------------------------------------------------------- */
  /*  Render                                                            */
  /* ---------------------------------------------------------------- */
  return (
    <div className="relative flex h-[calc(100dvh-72px)] flex-col overflow-hidden bg-[#0A0A0F]">
      {/* ====== TOP ACTION BAR ====== */}
      <motion.div
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: easeOutExpo }}
        className="flex h-14 shrink-0 items-center justify-between border-b border-[rgba(168,85,247,0.08)] px-4 lg:px-6"
        style={{
          background: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Left group */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewOptimization}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-[#B4B4C7] transition-colors hover:bg-[rgba(168,85,247,0.08)] hover:text-white"
            style={{
              background: 'rgba(19, 19, 31, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New</span>
          </button>
          <button
            onClick={handleSavePrompt}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-[#B4B4C7] transition-colors hover:bg-[rgba(168,85,247,0.08)] hover:text-white"
            style={{
              background: 'rgba(19, 19, 31, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-[#B4B4C7] transition-colors hover:bg-[rgba(168,85,247,0.08)] hover:text-white"
            style={{
              background: 'rgba(19, 19, 31, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Mobile panel toggles */}
          <button
            onClick={() => setMobileShowLeft(!mobileShowLeft)}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(168,85,247,0.15)] text-[#B4B4C7] transition-colors hover:text-white lg:hidden"
          >
            {mobileShowLeft ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileShowCenter(!mobileShowCenter)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(168,85,247,0.15)] text-[#B4B4C7] transition-colors hover:text-white lg:hidden"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>

        {/* Center group — Model */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2 rounded-xl px-4 py-2" style={{ background: '#13131F', border: '1px solid rgba(168,85,247,0.2)' }}>
            <span className="text-xs text-[#6B7280]">Model:</span>
            <span className="text-sm font-medium text-white">{MODELS.find(m => m.id === selectedModel)?.name || 'GPT-4o'}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#6B7280]" />
          </div>
        </div>

        {/* Right group */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-xs text-[#6B7280]">Strength</span>
            <Slider
              value={strength}
              onValueChange={setStrength}
              max={100}
              step={1}
              className="w-[100px]"
            />
            <span className="w-8 text-xs font-medium text-white">{strength[0]}</span>
          </div>
          <motion.button
            onClick={handleOptimize}
            disabled={isOptimizing}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'relative flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2 text-sm font-semibold text-white transition-shadow',
              isOptimizing && 'cursor-not-allowed opacity-80'
            )}
            style={{
              background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 40%, #06B6D4 100%)',
              boxShadow: isOptimizing
                ? '0 0 20px rgba(168,85,247,0.3)'
                : '0 0 30px rgba(168,85,247,0.3)',
            }}
          >
            {isOptimizing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Optimize
              </>
            )}
            {!isOptimizing && (
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-xl"
                animate={{ boxShadow: ['0 0 20px rgba(168,85,247,0.2)', '0 0 40px rgba(168,85,247,0.35)', '0 0 20px rgba(168,85,247,0.2)'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* ====== MAIN 3-PANEL LAYOUT ====== */}
      <div className="relative flex flex-1 overflow-hidden lg:flex-row">
        {/* ====== LEFT PANEL ====== */}
        <AnimatePresence>
          {(showLeftPanel && !mobileShowLeft) && (
            <motion.div
              initial={{ x: -380, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -380, opacity: 0 }}
              transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.1 }}
              className={cn(
                'absolute inset-y-0 left-0 z-20 w-[340px] overflow-y-auto border-r border-[rgba(168,85,247,0.08)] bg-[#0A0A0F] p-5 lg:relative lg:block lg:w-[380px]',
                mobileShowLeft && 'hidden'
              )}
            >
              {/* Mobile close */}
              <button
                onClick={() => setMobileShowLeft(false)}
                className="absolute right-3 top-3 text-[#6B7280] hover:text-white lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>

              <ScrollArea className="h-full">
                {/* Input Label */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#6B7280]">Your Prompt</span>
                  <span className="text-xs text-[#6B7280]">{prompt.length} / 4000</span>
                </div>

                {/* Textarea */}
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt here... Be as specific or vague as you want. We'll handle the rest."
                  className={cn(
                    'min-h-[260px] resize-y rounded-2xl border-[rgba(168,85,247,0.15)] bg-[#13131F] p-5 font-mono-code text-sm leading-[1.7] text-white placeholder:text-[#6B7280] focus:border-[#A855F7] focus:ring-[3px] focus:ring-[rgba(168,85,247,0.1)]'
                  )}
                />

                {/* Quick Templates */}
                <div className="mt-5">
                  <span className="mb-2 block text-xs font-medium text-[#6B7280]">Quick Templates</span>
                  <div className="flex flex-wrap gap-2">
                    {TEMPLATES.map((t, i) => (
                      <motion.button
                        key={t.label}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03, duration: 0.3 }}
                        onClick={() => handleTemplateClick(t.label)}
                        className={cn(
                          'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all',
                          activeTemplate === t.label
                            ? 'border-[#A855F7] bg-[#A855F7] text-white'
                            : 'border-[rgba(168,85,247,0.15)] bg-[rgba(168,85,247,0.08)] text-[#B4B4C7] hover:border-[#A855F7] hover:bg-[rgba(168,85,247,0.15)]'
                        )}
                      >
                        {t.icon}
                        {t.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="mt-6">
                  <div
                    className="mb-3 flex cursor-pointer items-center justify-between"
                  >
                    <span className="text-sm font-medium text-white">Advanced Settings</span>
                    <ChevronDown className="h-4 w-4 text-[#6B7280]" />
                  </div>

                  <div className="space-y-4">
                    {/* Prompt Length */}
                    <div>
                      <span className="mb-2 block text-xs text-[#6B7280]">Prompt Length</span>
                      <div className="flex gap-2">
                        {(['concise', 'balanced', 'detailed'] as const).map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setPromptLength(opt)}
                            className={cn(
                              'flex-1 rounded-lg border px-2 py-1.5 text-center text-xs capitalize transition-all',
                              promptLength === opt
                                ? 'border-[#A855F7] bg-[rgba(168,85,247,0.15)] text-white'
                                : 'border-[rgba(255,255,255,0.05)] bg-[#13131F] text-[#B4B4C7] hover:border-[rgba(168,85,247,0.3)]'
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tone */}
                    <div>
                      <span className="mb-2 block text-xs text-[#6B7280]">Tone</span>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full rounded-xl border border-[rgba(168,85,247,0.15)] bg-[#13131F] px-3 py-2 text-sm text-white outline-none focus:border-[#A855F7]"
                      >
                        {['Professional', 'Casual', 'Academic', 'Creative', 'Technical'].map((t) => (
                          <option key={t} value={t} className="bg-[#13131F]">{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* Output Format */}
                    <div>
                      <span className="mb-2 block text-xs text-[#6B7280]">Output Format</span>
                      <div className="space-y-2">
                        {[
                          { label: 'Include examples', checked: includeExamples, onChange: setIncludeExamples },
                          { label: 'Add structure/sections', checked: addStructure, onChange: setAddStructure },
                          { label: 'Include constraints', checked: includeConstraints, onChange: setIncludeConstraints },
                        ].map((cb) => (
                          <label key={cb.label} className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={cb.checked}
                              onChange={(e) => cb.onChange(e.target.checked)}
                              className="h-4 w-4 accent-[#A855F7]"
                            />
                            <span className="text-xs text-[#B4B4C7]">{cb.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <span className="mb-2 block text-xs text-[#6B7280]">Language</span>
                      <select className="w-full rounded-xl border border-[rgba(168,85,247,0.15)] bg-[#13131F] px-3 py-2 text-sm text-white outline-none focus:border-[#A855F7]">
                        {['English', 'French', 'Spanish', 'German', 'Japanese', 'Chinese'].map((l) => (
                          <option key={l} value={l} className="bg-[#13131F]">{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Recent Prompts */}
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Recent</span>
                    <button
                      onClick={() => setHistory([])}
                      className="text-xs text-[#6B7280] transition-colors hover:text-[#C4B5FD]"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-2">
                    {history.map((item, i) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        onClick={() => handleHistoryClick(item)}
                        className="w-full rounded-xl p-3 text-left transition-colors hover:bg-[rgba(168,85,247,0.08)]"
                        style={{
                          background: 'rgba(19, 19, 31, 0.7)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(168, 85, 247, 0.1)',
                        }}
                      >
                        <p className="line-clamp-2 text-xs leading-relaxed text-[#B4B4C7]">
                          {item.text}
                        </p>
                        <span className="mt-1 block text-[10px] text-[#6B7280]">{item.timestamp}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== CENTER PANEL ====== */}
        <AnimatePresence>
          {(showCenterPanel && !mobileShowCenter) && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.2 }}
              className={cn(
                'absolute inset-y-0 left-0 z-10 w-[260px] overflow-y-auto border-r border-[rgba(168,85,247,0.08)] bg-[#0A0A0F] p-5 lg:relative lg:block lg:w-[280px]',
                mobileShowCenter && 'hidden'
              )}
            >
              {/* Mobile close */}
              <button
                onClick={() => setMobileShowCenter(false)}
                className="absolute right-3 top-3 text-[#6B7280] hover:text-white lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Model Selector */}
              <div className="mb-6">
                <span className="mb-3 block text-xs font-medium text-[#6B7280]">Target Model</span>
                <div className="grid grid-cols-2 gap-2">
                  {MODELS.map((model, i) => (
                    <motion.button
                      key={model.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      onClick={() => setSelectedModel(model.id)}
                      className={cn(
                        'flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all',
                        selectedModel === model.id
                          ? 'border-[#A855F7] bg-[rgba(168,85,247,0.1)] shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                          : 'border-[rgba(255,255,255,0.05)] bg-[#13131F] hover:border-[rgba(168,85,247,0.3)]'
                      )}
                    >
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg',
                        selectedModel === model.id ? 'text-[#A855F7]' : 'text-[#6B7280]'
                      )}>
                        {model.icon}
                      </div>
                      <span className={cn(
                        'text-xs font-medium',
                        selectedModel === model.id ? 'text-white' : 'text-[#B4B4C7]'
                      )}>
                        {model.name}
                      </span>
                      <span className="text-[10px] text-[#6B7280]">{model.subtitle}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Optimize Button (Large) */}
              <motion.button
                onClick={handleOptimize}
                disabled={isOptimizing}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  'mb-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold text-white transition-shadow',
                  isOptimizing && 'cursor-not-allowed opacity-80'
                )}
                style={{
                  background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 40%, #06B6D4 100%)',
                  boxShadow: '0 0 30px rgba(168,85,247,0.3)',
                }}
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Optimize
                  </>
                )}
              </motion.button>

              {/* Optimization Log */}
              <div className="mb-6">
                <span className="mb-2 block text-xs font-medium text-[#6B7280]">Optimization Log</span>
                <div className="max-h-[200px] space-y-1 overflow-y-auto rounded-xl bg-[#13131F] p-3">
                  <AnimatePresence>
                    {logs.map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="font-mono-code text-[11px] leading-relaxed text-[#6B7280]"
                      >
                        {log.text}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={logEndRef} />
                </div>
              </div>

              {/* Metrics Preview */}
              <AnimatePresence>
                {isOptimized && qualityScore > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: easeOutExpo }}
                    className="rounded-2xl p-4"
                    style={{
                      background: 'rgba(19, 19, 31, 0.6)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(168, 85, 247, 0.1)',
                    }}
                  >
                    <AnimatedScore score={qualityScore} />
                    <MetricBars metrics={metrics} />
                    <div className="mt-4 flex justify-center">
                      <Badge
                        className="bg-[rgba(16,185,129,0.15)] text-[#10B981] border-[rgba(16,185,129,0.2)]"
                      >
                        +47% better
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== RIGHT PANEL ====== */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.3 }}
          className="relative flex flex-1 flex-col overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex items-center border-b border-[rgba(255,255,255,0.05)] px-6">
            {(['optimized', 'compare', 'preview'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-3 text-sm capitalize transition-colors',
                  activeTab === tab
                    ? 'border-b-2 border-[#A855F7] font-medium text-white'
                    : 'border-b-2 border-transparent text-[#6B7280] hover:text-[#B4B4C7]'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {/* --- Optimized Tab --- */}
              {activeTab === 'optimized' && (
                <motion.div
                  key="optimized"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {!isOptimized && !isOptimizing && (
                    <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(168,85,247,0.1)]">
                        <Sparkles className="h-8 w-8 text-[#A855F7]" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-white">Ready to Optimize</h3>
                      <p className="mt-2 max-w-sm text-sm text-[#6B7280]">
                        Enter your prompt on the left, select a model, and click Optimize to see the magic happen.
                      </p>
                    </div>
                  )}

                  {isOptimized && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: easeOutExpo }}
                      className="rounded-2xl p-6"
                      style={{
                        background: 'rgba(19, 19, 31, 0.7)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(168, 85, 247, 0.15)',
                      }}
                    >
                      {/* Header */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h4 className="font-display text-sm font-medium text-white">Optimized Prompt</h4>
                          <Badge
                            variant="outline"
                            className="border-[rgba(168,85,247,0.3)] bg-[rgba(168,85,247,0.12)] text-[#C4B5FD]"
                          >
                            {MODELS.find(m => m.id === selectedModel)?.name || 'GPT-4o'} Optimized
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCopy}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#B4B4C7] transition-colors hover:bg-[rgba(168,85,247,0.1)] hover:text-white"
                            style={{
                              background: 'rgba(19, 19, 31, 0.7)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                            }}
                          >
                            {copied ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={handleSavePrompt}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#B4B4C7] transition-colors hover:bg-[rgba(168,85,247,0.1)] hover:text-white"
                            style={{
                              background: 'rgba(19, 19, 31, 0.7)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                            }}
                          >
                            <Bookmark className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Output */}
                      <div className="min-h-[300px] rounded-xl border border-[rgba(16,185,129,0.2)] bg-[#13131F] p-5">
                        {isOptimized ? (
                          <TypewriterText text={optimizedText} speed={2} />
                        ) : (
                          <span className="font-mono-code text-sm text-[#6B7280]">Your optimized prompt will appear here...</span>
                        )}
                      </div>

                      {/* Tags */}
                      {isOptimized && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="mt-4 flex flex-wrap items-center gap-2"
                        >
                          <span className="text-xs text-[#6B7280]">Optimization applied: +3 sections, +2 examples, tone: {tone}</span>
                          <div className="flex gap-1.5">
                            {['Enhanced', 'Structured', 'Specific'].map((tag) => (
                              <Badge
                                key={tag}
                                className="bg-[rgba(168,85,247,0.12)] text-[#C4B5FD] border-[rgba(168,85,247,0.2)] text-[10px]"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* --- Compare Tab --- */}
              {activeTab === 'compare' && (
                <motion.div
                  key="compare"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {isOptimized ? (
                    <>
                      {/* Diff Summary Bar */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 rounded-xl bg-[#13131F] px-4 py-3 text-xs"
                      >
                        <span className="text-[#10B981]">+247 words added</span>
                        <span className="text-[#6B7280]">&bull;</span>
                        <span className="text-[#10B981]">3 sections added</span>
                        <span className="text-[#6B7280]">&bull;</span>
                        <span className="text-[#06B6D4]">Tone adjusted</span>
                      </motion.div>

                      {/* Side by Side */}
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* Original */}
                        <motion.div
                          initial={{ x: -30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.4, ease: easeOutExpo }}
                        >
                          <h4 className="mb-2 text-xs font-medium text-[#6B7280]">Original</h4>
                          <div className="min-h-[400px] rounded-xl border border-[rgba(168,85,247,0.15)] bg-[#13131F] p-5">
                            <span className="font-mono-code text-sm leading-[1.7] text-[#B4B4C7]">{prompt || DEMO_ORIGINAL}</span>
                          </div>
                        </motion.div>

                        {/* Optimized */}
                        <motion.div
                          initial={{ x: 30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.1 }}
                        >
                          <h4 className="mb-2 text-xs font-medium text-[#10B981]">Optimized</h4>
                          <div className="min-h-[400px] rounded-xl border border-[rgba(16,185,129,0.2)] bg-[#13131F] p-5">
                            <DiffViewer original={prompt || DEMO_ORIGINAL} optimized={optimizedText} />
                          </div>
                        </motion.div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <p className="text-sm text-[#6B7280]">Optimize a prompt to see the comparison.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- Preview Tab --- */}
              {activeTab === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isOptimized ? (
                    <div className="space-y-4">
                      {/* Chat Bubble */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: easeOutExpo }}
                        className="max-w-[700px] rounded-[16px_16px_16px_4px] bg-[#13131F] p-5"
                      >
                        <p className="text-sm leading-relaxed text-[#B4B4C7]">
                          {optimizedText.slice(0, 200)}...
                        </p>
                      </motion.div>

                      <p className="text-xs italic text-[#6B7280]">
                        This is a simulated preview based on the optimized prompt
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <p className="text-sm text-[#6B7280]">Optimize a prompt to see a preview.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Bar */}
          <AnimatePresence>
            {isOptimized && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="flex shrink-0 flex-wrap items-center gap-3 border-t border-[rgba(168,85,247,0.08)] px-6 py-4"
                style={{
                  background: 'rgba(10, 10, 15, 0.9)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="border-[rgba(168,85,247,0.3)] bg-transparent text-[#B4B4C7] hover:border-[#A855F7] hover:bg-[rgba(168,85,247,0.08)] hover:text-white"
                >
                  {copied ? <Check className="mr-2 h-4 w-4 text-[#10B981]" /> : <Copy className="mr-2 h-4 w-4" />}
                  Copy to Clipboard
                </Button>
                <Button
                  onClick={handleSavePrompt}
                  variant="ghost"
                  className="text-[#B4B4C7] hover:text-white"
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save to Library
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
