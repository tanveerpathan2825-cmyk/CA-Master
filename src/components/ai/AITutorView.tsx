import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  HelpCircle,
  Copy,
  Check,
  AlertCircle,
  BookOpen,
  Scale,
  Calculator,
  RotateCcw,
} from 'lucide-react';
import { AIService } from '../../services/aiService';
import { StudentProfile } from '../../types';

interface Props {
  profile: StudentProfile;
  initialQuery?: string;
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  mode?: string;
  note?: string;
  timestamp: string;
}

export const AITutorView: React.FC<Props> = ({ profile, initialQuery, onClose }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [selectedMode, setSelectedMode] = useState<string>('simple_explanation');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${profile.name}! I am your **CA Master Study Assistant** for CA ${profile.caLevel}.\n\nHow can I support your study session today? You can choose a response mode below (Simple, Exam-Oriented, Case Example, or Quiz) and ask about accounting standards, tax provisions, case laws, or specific journal entries.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [quotaRemaining, setQuotaRemaining] = useState<number>(
    profile.aiQuestionsLimit - profile.dailyAIQuestionsUsed
  );

  const MODES = [
    { id: 'simple_explanation', label: 'Simple Explanation' },
    { id: 'detailed_explanation', label: 'Detailed Concept' },
    { id: 'exam_oriented', label: 'ICAI Exam Oriented' },
    { id: 'example', label: 'Numerical Example' },
    { id: 'quiz_me', label: 'Quiz Me (MCQs)' },
    { id: 'practice_questions', label: 'Practice Questions' },
    { id: 'revision_summary', label: 'Revision Summary' },
    { id: 'journal_entry', label: 'Journal Entry Breakdown' },
  ];

  const SAMPLE_QUERIES = [
    'Explain depreciation under AS 10 in simple language with an example',
    'What are the 3 conditions for HRA exemption u/s 10(13A)?',
    'Explain the dual aspect journal entry for buyback of shares at premium',
    'Give me 3 tricky case-based MCQs on AGM notice period under Sec 101',
    'How do I calculate Margin of Safety in Marginal Costing?',
  ];

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || query).trim();
    if (!promptText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: promptText,
      mode: selectedMode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await AIService.askTutor({
        prompt: promptText,
        mode: selectedMode,
        caLevel: profile.caLevel,
        subject: 'General CA Examination',
        userId: profile.id,
      });

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        note: response.note,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      if (response.remainingQuestions !== undefined) {
        setQuotaRemaining(response.remainingQuestions);
      }

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'ai',
          text: 'Sorry, I encountered an issue processing your question. Please verify your connection or try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 pb-12 max-w-4xl mx-auto">
      {/* Header with Quota Counter */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-900 text-white rounded-lg">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">AI CA Tutor</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personalized study companion for CA {profile.caLevel} syllabus concepts.
          </p>
        </div>

        {/* Quota & Cost Control Tracker */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Daily Free AI Quota
            </span>
            <span className="text-xs font-bold text-slate-800 tabular-nums">
              {quotaRemaining} / {profile.aiQuestionsLimit} queries left
            </span>
          </div>
          <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="bg-slate-900 h-full rounded-full transition-all"
              style={{
                width: `${Math.max(
                  0,
                  Math.min(100, (quotaRemaining / profile.aiQuestionsLimit) * 100)
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="bg-amber-50/80 border border-amber-200/80 px-4 py-2.5 rounded-xl text-xs text-amber-900 flex items-start gap-2 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-[11px]">
          <strong>Educational Notice:</strong> The AI CA Tutor is an automated study aid and does not represent a qualified Chartered Accountant or official ICAI examiner. Tax slabs, case laws, and accounting standards are time-sensitive; always verify against official ICAI updates and the relevant Finance Act for your attempt.
        </div>
      </div>

      {/* Response Mode Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-wrap gap-1.5">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedMode === mode.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Sample Query Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-semibold text-slate-500 mr-1">Try Asking:</span>
        {SAMPLE_QUERIES.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors truncate max-w-[280px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Conversation Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm min-h-[420px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                  isAi
                    ? 'bg-slate-50 text-slate-800 border border-slate-200/80'
                    : 'bg-slate-900 text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400 pb-1 border-b border-slate-200/40">
                  <span className="font-semibold">{isAi ? 'CA Master AI' : profile.name}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</div>

                {msg.note && (
                  <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-200/40">
                    {msg.note}
                  </p>
                )}

                {isAi && (
                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
              <span>Formulating structured ICAI concept breakdown...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Composer */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
        <textarea
          rows={2}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask any CA concept, entry, formula, section, or request MCQs..."
          className="flex-1 text-xs sm:text-sm p-2 focus:outline-none resize-none text-slate-900 placeholder:text-slate-400"
        />

        <button
          onClick={() => handleSend()}
          disabled={!query.trim() || isLoading}
          className="px-5 py-3 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 transition-all shadow-sm flex items-center gap-1.5 shrink-0 self-end active:scale-95"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
