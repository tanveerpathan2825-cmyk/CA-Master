import React, { useState } from 'react';
import {
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Bookmark,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { RevisionItem, Subject } from '../../types';

interface Props {
  revisionItems: RevisionItem[];
  subjects: Subject[];
  onMarkRevisionComplete: (itemId: string, rememberedWell: boolean) => void;
  onOpenTutor: (topic: string) => void;
}

export const RevisionHub: React.FC<Props> = ({
  revisionItems,
  subjects,
  onMarkRevisionComplete,
  onOpenTutor,
}) => {
  const [activeTab, setActiveTab] = useState<'due' | 'flashcards' | 'formulas' | 'weak'>('due');
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);
  const dueItems = revisionItems.filter((item) => item.nextDueDate <= todayStr);
  const weakItems = revisionItems.filter((item) => item.needsMorePractice || item.mistakesCount > 0);

  const activeFlashcard = revisionItems[currentFlashcardIndex] || null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Spaced Repetition Memory Engine
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Revision Hub</h1>
          <p className="text-xs text-slate-600 mt-1">
            Overcome the Ebbinghaus forgetting curve with automated 1, 3, 7, and 14-day recall intervals.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap p-1 bg-slate-100 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('due')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'due' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Due Today ({dueItems.length})
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'flashcards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'formulas' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Formula Sheets
          </button>
          <button
            onClick={() => setActiveTab('weak')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'weak' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weak Points ({weakItems.length})
          </button>
        </div>
      </div>

      {/* DUE REVISION LIST */}
      {activeTab === 'due' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Spaced Review Queue ({dueItems.length})
            </h3>
            <span className="text-xs text-slate-500">
              Complete these today to cement long-term retention
            </span>
          </div>

          {dueItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-semibold text-slate-700">All caught up! No due reviews for today.</p>
              <p>Great consistency. Check out Flashcards or Formula sheets to stay ahead.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dueItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-400 uppercase text-[10px]">
                        Stage {item.repetitionStage} Interval
                      </span>
                      {item.needsMorePractice && (
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-semibold text-[10px]">
                          Needs Practice
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{item.topicTitle}</h4>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      {item.summaryPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                    {item.keyFormulaOrSection && (
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-800 text-[11px] font-mono border border-slate-100">
                        {item.keyFormulaOrSection}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onOpenTutor(item.topicTitle)}
                      className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Ask AI</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onMarkRevisionComplete(item.id, false)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 font-semibold transition-colors"
                      >
                        Forgot
                      </button>
                      <button
                        onClick={() => onMarkRevisionComplete(item.id, true)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-sm"
                      >
                        Remembered
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FLASHCARDS INTERACTIVE MODE */}
      {activeTab === 'flashcards' && activeFlashcard && (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Card {currentFlashcardIndex + 1} of {revisionItems.length}
            </span>
            <span>Tap card to reveal core points</span>
          </div>

          {/* Flashcard container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer bg-white rounded-3xl border-2 border-slate-200 p-8 min-h-[300px] flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all select-none"
          >
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                CA REVISION FLASHCARD
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {activeFlashcard.topicTitle}
              </h3>
            </div>

            <div className="my-6">
              {!isFlipped ? (
                <div className="flex items-center justify-center text-xs text-slate-400 gap-1.5 py-8">
                  <Eye className="w-4 h-4" />
                  <span>Click anywhere to reveal answer & formula</span>
                </div>
              ) : (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <ul className="text-slate-700 space-y-1.5 list-disc pl-4">
                    {activeFlashcard.summaryPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                  {activeFlashcard.keyFormulaOrSection && (
                    <div className="p-2.5 bg-amber-50 rounded-xl font-mono text-[11px] text-amber-950 font-bold border border-amber-200">
                      {activeFlashcard.keyFormulaOrSection}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
              <span>Stage {activeFlashcard.repetitionStage} Interval</span>
              <span className="font-semibold text-slate-600">
                {isFlipped ? 'Answer Revealed' : 'Question Side'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button
              disabled={currentFlashcardIndex === 0}
              onClick={() => {
                setIsFlipped(false);
                setCurrentFlashcardIndex((prev) => prev - 1);
              }}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Previous Card
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                if (currentFlashcardIndex < revisionItems.length - 1) {
                  setCurrentFlashcardIndex((prev) => prev + 1);
                } else {
                  setCurrentFlashcardIndex(0);
                }
              }}
              className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 shadow-sm"
            >
              Next Card
            </button>
          </div>
        </div>
      )}

      {/* FORMULA SHEETS */}
      {activeTab === 'formulas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Exam Formula & Rule Cheat Sheets
            </h3>
            <span className="text-xs text-slate-500">
              High-yield numerical formulas for Accounting, Tax & Costing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {revisionItems
              .filter((item) => Boolean(item.keyFormulaOrSection))
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2"
                >
                  <span className="text-xs font-bold text-slate-900 block">{item.topicTitle}</span>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs font-semibold text-slate-800">
                    {item.keyFormulaOrSection}
                  </div>
                  <ul className="text-[11px] text-slate-600 list-disc pl-4 space-y-0.5 pt-1">
                    {item.summaryPoints.slice(0, 2).map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* WEAK POINTS */}
      {activeTab === 'weak' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Flagged Weak Points ({weakItems.length})
            </h3>
            <span className="text-xs text-slate-500">
              Items you marked as "Need More Practice" or answered incorrectly
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weakItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-red-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-red-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {item.mistakesCount} Recorded Mistake(s)
                  </span>
                  <button
                    onClick={() => onOpenTutor(item.topicTitle)}
                    className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Get AI Explanation</span>
                  </button>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{item.topicTitle}</h4>
                <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                  {item.summaryPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => onMarkRevisionComplete(item.id, true)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
