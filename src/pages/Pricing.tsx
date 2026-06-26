import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  Minus,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: easeOutExpo },
  }),
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const plans = [
  {
    key: 'free',
    title: 'Free',
    subtitle: 'Perfect for getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceLabel: '$0',
    priceSuffix: '/month',
    features: [
      '50 prompt optimizations/month',
      '5 model comparisons/day',
      'Access to 100+ templates',
      'Basic optimization settings',
      'Community support',
    ],
    cta: 'Get Started',
    ctaVariant: 'secondary' as const,
    checkColor: '#10B981',
    highlighted: false,
  },
  {
    key: 'pro',
    title: 'Pro',
    subtitle: 'For serious prompt engineers',
    monthlyPrice: 19,
    yearlyPrice: 15,
    priceLabel: null,
    priceSuffix: '/month',
    features: [
      'Unlimited prompt optimizations',
      'Unlimited model comparisons',
      'Full template library (500+)',
      'Advanced optimization controls',
      'API access (10,000 calls/day)',
      'Priority support',
      'Custom model tuning',
      'Team collaboration (up to 5)',
    ],
    cta: 'Start Pro Trial',
    ctaVariant: 'primary' as const,
    checkColor: '#A855F7',
    highlighted: true,
    trialNote: '14-day free trial',
  },
  {
    key: 'enterprise',
    title: 'Enterprise',
    subtitle: 'For organizations at scale',
    monthlyPrice: null,
    yearlyPrice: null,
    priceLabel: 'Custom',
    priceSuffix: '',
    features: [
      'Everything in Pro',
      'Unlimited API access',
      'SSO & SAML authentication',
      'Advanced team management',
      'Custom integrations',
      'Dedicated account manager',
      'SLA & uptime guarantee',
      'On-premise deployment option',
    ],
    cta: 'Contact Sales',
    ctaVariant: 'secondary' as const,
    checkColor: '#06B6D4',
    highlighted: false,
  },
]

const comparisonData = [
  { category: true, label: 'Optimization' },
  { feature: 'Monthly optimizations', free: '50', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Optimization strength', free: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
  { feature: 'Multi-model optimization', free: '1 model', pro: 'All models', enterprise: 'All models' },
  { feature: 'Batch optimization', free: false, pro: true, enterprise: true },
  { category: true, label: 'Models & Arena' },
  { feature: 'Daily comparisons', free: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Models supported', free: '8', pro: '20+', enterprise: '20+ + custom' },
  { feature: 'Arena side-by-side', free: '2 models', pro: '4 models', enterprise: 'Unlimited' },
  { category: true, label: 'Templates' },
  { feature: 'Template library', free: '100+', pro: '500+', enterprise: '500+ + custom' },
  { feature: 'Custom templates', free: false, pro: true, enterprise: true },
  { feature: 'Template sharing', free: false, pro: 'Team only', enterprise: 'Organization' },
  { category: true, label: 'API & Integration' },
  { feature: 'API calls/day', free: false, pro: '10,000', enterprise: 'Unlimited' },
  { feature: 'Webhooks', free: false, pro: true, enterprise: true },
  { feature: 'SDK access', free: false, pro: true, enterprise: true },
  { category: true, label: 'Support' },
  { feature: 'Support', free: 'Community', pro: 'Priority (24h)', enterprise: 'Dedicated manager' },
  { feature: 'SLA', free: false, pro: false, enterprise: '99.9% uptime' },
]

const faqItems = [
  { q: 'Is there really a free plan?', a: 'Yes! Our free plan includes 50 prompt optimizations per month, 5 daily model comparisons, and access to 100+ templates. No credit card required, no time limit.' },
  { q: 'What happens if I exceed my free tier limits?', a: "You'll be prompted to upgrade to Pro. We never charge unexpectedly \u2014 you'll always have the choice to upgrade or wait until your limits reset." },
  { q: 'Can I change plans at any time?', a: 'Absolutely. Upgrade instantly, or downgrade at your next billing cycle. No lock-in, no penalties.' },
  { q: 'Is there a trial for the Pro plan?', a: 'Yes \u2014 every new user gets a 14-day free trial of Pro features. No credit card required to start.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.' },
  { q: 'Can I get a refund?', a: "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact support for a full refund." },
  { q: 'Do you offer discounts for startups or students?', a: 'Yes! We have special programs for startups, students, and open-source projects. Contact us for details.' },
  { q: "What's included in Enterprise custom pricing?", a: 'Enterprise includes everything in Pro plus unlimited API access, SSO, dedicated support, custom integrations, and optional on-premise deployment. Pricing depends on your organization\'s needs.' },
]

/* ------------------------------------------------------------------ */
/*  Intersection-observer reveal hook                                  */
/* ------------------------------------------------------------------ */

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
/*  Section 1: Page Header                                             */
/* ------------------------------------------------------------------ */

function PageHeader() {
  return (
    <section
      className="relative flex h-[300px] w-full items-center justify-center overflow-hidden"
      style={{ background: '#0A0A0F' }}
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at top center, rgba(168,85,247,0.12) 0%, transparent 60%)',
        }}
      />
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 text-center lg:px-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-xs tracking-wide text-[#6B7280]"
        >
          <Link to="/" className="transition-colors hover:text-[#C4B5FD]">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#B4B4C7]">Pricing</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl"
        >
          Simple, Transparent Pricing
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: easeOutExpo }}
          className="mx-auto mt-4 max-w-xl text-lg text-[#B4B4C7]"
        >
          Start free. Upgrade when you need more power. No hidden fees, no surprises.
        </motion.p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 2: Billing Toggle + Pricing Cards                          */
/* ------------------------------------------------------------------ */

function PricingCards() {
  const [yearly, setYearly] = useState(false)
  const { ref, visible } = useReveal()

  return (
    <section className="w-full bg-[#0A0A0F] px-6 pb-16 pt-12 lg:px-16">
      <div ref={ref} className="mx-auto max-w-[1100px]">
        {/* Billing Toggle */}
        <motion.div
          className="mb-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        >
          <div
            className="inline-flex rounded-xl p-1"
            style={{ background: '#13131F' }}
          >
            {(['monthly', 'yearly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setYearly(mode === 'yearly')}
                className="relative rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
                style={{ color: yearly === (mode === 'yearly') ? '#FFF' : '#6B7280' }}
              >
                {yearly === (mode === 'yearly') && (
                  <motion.div
                    layoutId="billing-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: '#1C1C2E' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {mode === 'monthly' ? 'Monthly' : 'Yearly'}
                  {mode === 'yearly' && (
                    <span
                      className="ml-1 text-[11px] font-medium"
                      style={{
                        background: 'rgba(16,185,129,0.15)',
                        color: '#10B981',
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}
                    >
                      Save 20%
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              custom={i}
              initial="hidden"
              animate={visible ? 'visible' : 'hidden'}
              variants={fadeUp}
              className="relative flex flex-col"
            >
              <div
                className="flex flex-1 flex-col rounded-[20px] p-8 transition-all duration-300"
                style={{
                  background: 'rgba(19, 19, 31, 0.6)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: plan.highlighted
                    ? '1px solid #A855F7'
                    : '1px solid rgba(168, 85, 247, 0.1)',
                  boxShadow: plan.highlighted
                    ? '0 0 40px rgba(168,85,247,0.15)'
                    : undefined,
                }}
              >
                {/* Most Popular Badge */}
                {plan.highlighted && (
                  <div
                    className="absolute right-0 top-0 text-xs font-semibold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #A855F7, #7C3AED)',
                      padding: '6px 16px',
                      borderRadius: '0 16px 0 12px',
                    }}
                  >
                    Most Popular
                  </div>
                )}

                {/* Plan Title */}
                <h3 className="font-display text-2xl font-medium text-white">{plan.title}</h3>
                <p className="mt-1 text-sm text-[#B4B4C7]">{plan.subtitle}</p>

                {/* Price */}
                <div className="mt-5 flex items-baseline gap-1">
                  {plan.priceLabel ? (
                    <span className="font-display text-4xl font-bold text-white">{plan.priceLabel}</span>
                  ) : (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={yearly ? 'yearly' : 'monthly'}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="font-display text-5xl font-bold text-white"
                        >
                          ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-sm text-[#6B7280]">{plan.priceSuffix}</span>
                    </>
                  )}
                </div>
                {plan.highlighted && yearly && (
                  <p className="mt-1 text-xs text-[#6B7280]">billed annually</p>
                )}

                {/* Divider */}
                <div className="my-5 border-t border-[rgba(255,255,255,0.05)]" />

                {/* Features */}
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: plan.checkColor }} />
                      <span className="text-sm text-[#B4B4C7]">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className="w-full rounded-xl py-3.5 text-[15px] font-semibold transition-all duration-200"
                  style={
                    plan.ctaVariant === 'primary'
                      ? {
                          background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
                          color: '#FFF',
                        }
                      : {
                          background: 'transparent',
                          color: '#B4B4C7',
                          border: '1px solid rgba(168, 85, 247, 0.3)',
                        }
                  }
                  onMouseEnter={(e) => {
                    if (plan.ctaVariant === 'primary') {
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(168, 85, 247, 0.4)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    } else {
                      e.currentTarget.style.borderColor = '#A855F7'
                      e.currentTarget.style.color = '#FFF'
                      e.currentTarget.style.background = 'rgba(168, 85, 247, 0.08)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (plan.ctaVariant === 'primary') {
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.transform = 'translateY(0)'
                    } else {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)'
                      e.currentTarget.style.color = '#B4B4C7'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {plan.cta}
                </button>
                {'trialNote' in plan && (
                  <p className="mt-2 text-center text-xs text-[#6B7280]">{plan.trialNote}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 3: Feature Comparison Table                                */
/* ------------------------------------------------------------------ */

function FeatureComparison() {
  const { ref, visible } = useReveal()

  return (
    <section className="w-full bg-[#0A0A0F] px-6 py-16 lg:px-16">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: easeOutExpo }}
        className="mx-auto max-w-[1280px] overflow-hidden rounded-3xl"
        style={{ background: '#13131F' }}
      >
        <div className="px-6 pb-12 pt-16 text-center md:px-12">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Compare Plans</h2>
          <p className="mt-3 text-[#B4B4C7]">See exactly what you get with each plan.</p>
        </div>

        <div className="overflow-x-auto px-4 pb-12 md:px-8">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr style={{ background: 'rgba(168,85,247,0.08)' }}>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#B4B4C7]">Feature</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[#B4B4C7]">Free</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[#C4B5FD]">Pro</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-[#B4B4C7]">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => {
                if ('category' in row && row.category) {
                  return (
                    <motion.tr
                      key={`cat-${row.label}`}
                      initial={{ opacity: 0 }}
                      animate={visible ? { opacity: 1 } : {}}
                      transition={{ delay: idx * 0.03, duration: 0.3 }}
                    >
                      <td
                        colSpan={4}
                        className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          color: '#A855F7',
                        }}
                      >
                        {row.label}
                      </td>
                    </motion.tr>
                  )
                }
                const r = row as { feature: string; free: string | boolean; pro: string | boolean; enterprise: string | boolean }
                const cell = (val: string | boolean) => {
                  if (typeof val === 'boolean') {
                    return val
                      ? <Check className="mx-auto h-4 w-4" style={{ color: '#10B981' }} />
                      : <Minus className="mx-auto h-4 w-4 text-[#6B7280]" />
                  }
                  return <span className="text-sm text-[#B4B4C7]">{val}</span>
                }
                return (
                  <motion.tr
                    key={r.feature}
                    initial={{ opacity: 0 }}
                    animate={visible ? { opacity: 1 } : {}}
                    transition={{ delay: idx * 0.03, duration: 0.3 }}
                    className="border-b border-[rgba(255,255,255,0.03)]"
                  >
                    <td className="px-4 py-3 text-sm text-white">{r.feature}</td>
                    <td className="px-4 py-3 text-center">{cell(r.free)}</td>
                    <td className="px-4 py-3 text-center">{cell(r.pro)}</td>
                    <td className="px-4 py-3 text-center">{cell(r.enterprise)}</td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 4: FAQ                                                     */
/* ------------------------------------------------------------------ */

function FAQ() {
  const { ref, visible } = useReveal()

  return (
    <section className="w-full bg-[#0A0A0F] px-6 py-24 lg:px-16">
      <div ref={ref} className="mx-auto max-w-[800px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-3 text-[#B4B4C7]">Everything you need to know about pricing and plans.</p>
        </motion.div>

        <AccordionPrimitive.Root type="single" collapsible>
          {faqItems.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              animate={visible ? 'visible' : 'hidden'}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: i * 0.06, duration: 0.4, ease: easeOutExpo },
                },
              }}
            >
              <AccordionPrimitive.Item
                value={`faq-${i}`}
                className="border-b border-[rgba(255,255,255,0.05)]"
              >
                <AccordionPrimitive.Header>
                  <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between py-5 text-left">
                    <span className="text-base font-medium text-white">{item.q}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-[#6B7280] transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content
                  className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                >
                  <p className="pb-5 text-[15px] leading-relaxed text-[#B4B4C7]">
                    {item.a}
                  </p>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            </motion.div>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 5: Testimonial                                             */
/* ------------------------------------------------------------------ */

function Testimonial() {
  const { ref, visible } = useReveal()

  return (
    <section
      className="w-full px-6 py-16 lg:px-16"
      style={{
        background: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(6,182,212,0.05) 100%)',
      }}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: easeOutExpo }}
        className="mx-auto max-w-[700px] text-center"
      >
        <Sparkles className="mx-auto mb-4 h-8 w-8 text-[#A855F7]" />
        <p className="text-lg italic leading-relaxed text-white md:text-xl">
          "We switched our entire team to PromptForge Pro and saw a 3x improvement in our AI output quality. The ROI was clear within the first week."
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <img
            src="/testimonial-avatars/avatar2.jpg"
            alt="David Kim"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="text-left">
            <p className="text-sm font-medium text-white">David Kim</p>
            <p className="text-xs text-[#6B7280]">VP of Engineering, ScaleAI</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Section 6: Final CTA                                               */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  const { ref, visible } = useReveal()

  return (
    <section className="w-full bg-[#0A0A0F] px-6 py-24 lg:px-16">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: easeOutExpo }}
        className="mx-auto max-w-[1280px] text-center"
      >
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Ready to Get Started?</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/optimize"
            className="rounded-xl px-7 py-3.5 text-[15px] font-semibold text-[#B4B4C7] transition-all duration-200 hover:-translate-y-px hover:text-white"
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
            Start Free
          </Link>
          <Link
            to="/pricing"
            className="rounded-xl px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            style={{
              background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
            }}
          >
            Try Pro for 14 Days
          </Link>
        </div>
        <p className="mt-4 text-xs text-[#6B7280]">No credit card required &bull; Cancel anytime</p>
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                        */
/* ------------------------------------------------------------------ */

export default function Pricing() {
  return (
    <div className="w-full">
      <PageHeader />
      <PricingCards />
      <FeatureComparison />
      <FAQ />
      <Testimonial />
      <FinalCTA />
    </div>
  )
}
