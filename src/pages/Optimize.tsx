import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, Loader2, RefreshCw, Zap, KeyRound } from "lucide-react";

const MODELS = [
  { id: "gpt-4o", name: "GPT-4o", color: "#10A37F" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", color: "#10A37F" },
  { id: "claude-sonnet", name: "Claude 3.5", color: "#D4A574" },
  { id: "gemini", name: "Gemini Pro", color: "#4285F4" },
  { id: "midjourney", name: "Midjourney v6", color: "#FF6B6B" },
  { id: "dalle", name: "DALL-E 3", color: "#10A37F" },
];

export default function Optimize() {
  const [model, setModel] = useState(MODELS[0]);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [displayed, setDisplayed] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || "");
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    if (!result) return;
    let i = 0;
    const speed = result.length > 400 ? 6 : 12;
    const t = setInterval(() => { i++; setDisplayed(result.slice(0,i)); if (i>=result.length) clearInterval(t); }, speed);
    return () => clearInterval(t);
  }, [result]);

  const saveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("openai_api_key", key);
    setShowKeyInput(false);
  };

  const optimize = async () => {
    if (!prompt.trim()) return;
    if (!apiKey.trim()) { setShowKeyInput(true); return; }
    setLoading(true); setError(""); setResult(""); setDisplayed(""); setDone(true);
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: `You are an expert prompt engineer specializing in ${model.name}. Optimize user prompts to be more effective, specific, structured, and likely to produce high-quality results. Return ONLY the optimized prompt text. No markdown code blocks. No explanations.` },
            { role: "user", content: `Optimize this prompt for ${model.name}:\n\n${prompt}` }
          ],
          temperature: 0.3,
          max_tokens: 2048
        })
      });
      if (res.status === 401) throw new Error("Invalid API key. Check your OpenAI API key.");
      if (res.status === 429) throw new Error("Rate limit reached. Wait a moment and retry.");
      if (!res.ok) throw new Error(`API error ${res.status}. Try again.`);
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim() || "";
      setResult(text.replace(/^```[a-z]*\n?/gm,"").replace(/\n?```$/gm,"").trim());
    } catch (e: any) {
      setError(e.message || "Failed to optimize. Try again.");
      setDone(false);
    } finally { setLoading(false); }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false),2000); }
    catch { const t=document.createElement("textarea"); t.value=result; document.body.appendChild(t); t.select(); document.execCommand("copy"); document.body.removeChild(t); setCopied(true); setTimeout(()=>setCopied(false),2000); }
  };

  return (
    <div className="min-h-[calc(100dvh-72px)] bg-[#0A0A0F] pt-10 pb-20 px-4">
      <div className="max-w-[720px] mx-auto">
        {/* Header */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,ease:[0.16,1,0.3,1]}} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[rgba(168,85,247,0.12)] border border-[rgba(168,85,247,0.2)] rounded-full px-4 py-1.5 mb-4">
            <Zap className="w-4 h-4 text-[#A855F7]"/><span className="text-[#C4B5FD] text-sm font-medium">AI-Powered Optimization</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight" style={{fontFamily:"Space Grotesk,system-ui,sans-serif"}}>Optimize Your Prompt</h1>
          <p className="text-[#B4B4C7] text-lg">Select a model, paste your prompt, let AI make it perfect.</p>
        </motion.div>

        {/* API Key */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.05,ease:[0.16,1,0.3,1]}} className="mb-6">
          {showKeyInput || !apiKey ? (
            <div className="bg-[rgba(168,85,247,0.08)] border border-[rgba(168,85,247,0.2)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-4 h-4 text-[#A855F7]"/>
                <span className="text-[#C4B5FD] text-sm font-medium">Enter your OpenAI API Key</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={e=>setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1 bg-[#13131F] border border-[rgba(168,85,247,0.2)] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#A855F7]"
                  onKeyDown={e=>e.key==="Enter"&&saveKey(apiKey)}
                />
                <button onClick={()=>saveKey(apiKey)} className="px-4 py-2 bg-[#A855F7] text-white rounded-lg text-sm font-medium hover:bg-[#7C3AED] transition-colors">Save</button>
              </div>
              <p className="text-[#6B7280] text-xs mt-2">Your key is stored locally in your browser. Never shared.</p>
            </div>
          ) : (
            <button onClick={()=>setShowKeyInput(true)} className="flex items-center gap-2 text-[#6B7280] hover:text-[#C4B5FD] text-sm transition-colors">
              <KeyRound className="w-3.5 h-3.5"/><span>API Key configured • Click to change</span>
            </button>
          )}
        </motion.div>

        {/* Model Selector */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.1,ease:[0.16,1,0.3,1]}} className="mb-6">
          <label className="block text-[#B4B4C7] text-sm font-medium mb-3">Target Model</label>
          <div className="flex flex-wrap gap-2">
            {MODELS.map(m => (
              <button key={m.id} onClick={()=>setModel(m)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${model.id===m.id ? "bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white border-transparent shadow-[0_0_20px_rgba(168,85,247,0.3)]" : "bg-[#13131F] text-[#B4B4C7] border-[rgba(168,85,247,0.15)] hover:border-[rgba(168,85,247,0.4)] hover:text-white"}`}>
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{backgroundColor:m.color}}/>{m.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Input */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.2,ease:[0.16,1,0.3,1]}} className="bg-[rgba(19,19,31,0.7)] backdrop-blur-xl border border-[rgba(168,85,247,0.12)] rounded-2xl mb-4">
          <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder={`Enter your ${model.name} prompt...`} className="w-full h-48 bg-transparent text-white placeholder-[#6B7280] p-5 resize-none focus:outline-none text-[15px] leading-relaxed" style={{fontFamily:"JetBrains Mono,monospace"}} spellCheck={false}/>
          <div className="flex items-center justify-between px-5 pb-3">
            <span className="text-[#6B7280] text-xs">{prompt.length} chars</span>
            <AnimatePresence>{prompt.length>0 && <motion.button initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>{setPrompt("");setResult("");setDisplayed("");setDone(false);setError("");}} className="text-[#6B7280] hover:text-white text-xs transition-colors">Clear</motion.button>}</AnimatePresence>
          </div>
        </motion.div>

        {/* Optimize Button */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.3,ease:[0.16,1,0.3,1]}} className="mb-6">
          <motion.button whileHover={{scale:1.02,boxShadow:"0 0 40px rgba(168,85,247,0.4)"}} whileTap={{scale:0.98}} onClick={optimize} disabled={loading||!prompt.trim()} className="w-full py-4 rounded-2xl font-semibold text-white text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{background:"linear-gradient(135deg,#A855F7 0%,#7C3AED 40%,#06B6D4 100%)"}}>
            {loading ? <span className="flex items-center justify-center gap-3"><Loader2 className="w-5 h-5 animate-spin"/>Optimizing...</span> : <span className="flex items-center justify-center gap-3"><Sparkles className="w-5 h-5"/>Optimize Prompt</span>}
          </motion.button>
        </motion.div>

        {/* Error */}
        <AnimatePresence>{error && <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-xl p-4 mb-4 text-[#EF4444] text-sm text-center">{error}</motion.div>}</AnimatePresence>

        {/* Result */}
        <AnimatePresence>{done && <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.5,ease:[0.16,1,0.3,1]}} className="bg-[rgba(19,19,31,0.7)] backdrop-blur-xl border border-[rgba(6,182,212,0.2)] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(6,182,212,0.1)]">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"/><span className="text-[#10B981] text-sm font-medium">Optimized</span><span className="text-[#6B7280] text-xs ml-2">for {model.name}</span></div>
            <div className="flex items-center gap-2">
              <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={optimize} disabled={loading} className="p-2 rounded-lg bg-[#13131F] border border-[rgba(168,85,247,0.15)] text-[#B4B4C7] hover:text-white transition-all disabled:opacity-40"><RefreshCw className={`w-4 h-4 ${loading?"animate-spin":""}`}/></motion.button>
              <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={copy} className="p-2 rounded-lg bg-[#13131F] border border-[rgba(168,85,247,0.15)] text-[#B4B4C7] hover:text-white transition-all">{copied?<Check className="w-4 h-4 text-[#10B981]"/>:<Copy className="w-4 h-4"/>}</motion.button>
            </div>
          </div>
          <div className="p-6 min-h-[120px]">
            {loading&&!result ? <div className="flex flex-col items-center justify-center py-8 gap-3"><Loader2 className="w-8 h-8 text-[#A855F7] animate-spin"/><span className="text-[#6B7280] text-sm">Analyzing and improving...</span></div> : <div className="text-white text-[15px] leading-relaxed whitespace-pre-wrap" style={{fontFamily:"JetBrains Mono,monospace"}}>{displayed}{result && displayed.length < result.length && <span className="inline-block w-[2px] h-5 bg-[#A855F7] ml-0.5 animate-pulse align-middle"/>}</div>}
          </div>
          {result && <div className="px-6 py-3 border-t border-[rgba(6,182,212,0.1)] flex items-center justify-between"><span className="text-[#6B7280] text-xs">{result.length} chars</span><span className="text-[#10B981] text-xs">+{Math.max(0,result.length-prompt.length)} added</span></div>}
        </motion.div>}</AnimatePresence>

        {!done && <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} className="mt-10 text-center text-[#6B7280] text-sm">Tip: The more specific your prompt, the better the optimization.</motion.p>}
      </div>
    </div>
  );
}
