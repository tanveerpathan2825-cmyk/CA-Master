import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  Sparkles,
  ArrowRight,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { PracticeQuestion, Subject, Chapter, DifficultyLevel, QuestionType } from '../../types';

interface Props {
  questions: PracticeQuestion[];
  subjects: Subject[];
  chapters: Chapter[];
  onRecordAttempt: (questionId: string, isCorrect: boolean) => void;
  onOpenTutorForQuestion: (qText: string, explanation: string) => void;
  initialSubjectId?: string;
  initialChapterId?: string;
}

export const PracticeSection: React.FC<Props> = ({
  questions,
  subjects,
  chapters,
  onRecordAttempt,
  onOpenTutorForQuestion,
  initialSubjectId,
  initialChapterId,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectId || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Active question index in filtered list
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userSelectedOption, setUserSelectedOption] = useState<number | null>(null);
  const [numericalInput, setNumericalInput] = useState('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedSubject !== 'all' && q.subjectId !== selectedSubject) return false;
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      if (selectedType !== 'all' && q.type !== selectedType) return false;
      if (
        searchFilter &&
        !q.questionText.toLowerCase().includes(searchFilter.toLowerCase()) &&
        !q.relatedTopic.toLowerCase().includes(searchFilter.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [questions, selectedSubject, selectedDifficulty, selectedType, searchFilter]);

  const currentQ = filteredQuestions[currentIndex] || null;

  const handleSubmitAnswer = () => {
    if (!currentQ || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    let isCorrect = false;
    if (currentQ.type === 'mcq' || currentQ.type === 'true_false' || currentQ.type === 'case_based') {
      isCorrect = userSelectedOption === currentQ.correctOptionIndex;
    } else {
      // numerical or short answer
      isCorrect = Boolean(numericalInput.trim());
    }

    onRecordAttempt(currentQ.id, isCorrect);
  };

  const handleNextQuestion = () => {
    setUserSelectedOption(null);
    setNumericalInput('');
    setIsAnswerSubmitted(false);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Practice Arena
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
            ICAI Pattern Question Bank
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            MCQs, case-based scenarios, computational numericals, and true/false drills with step-by-step rationales.
          </p>
        </div>

        {/* Global Progress Tally */}
        <div className="flex items-center gap-4 text-xs font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div>
            <span className="text-slate-400 block text-[10px]">AVAILABLE</span>
            <span className="text-slate-900 font-bold tabular-nums">
              {filteredQuestions.length} Questions
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block text-[10px]">CURRENT</span>
            <span className="text-slate-900 font-bold tabular-nums">
              #{currentIndex + 1} of {filteredQuestions.length || 1}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Filters:</span>
        </div>

        {/* Subject Filter */}
        <select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setCurrentIndex(0);
            setIsAnswerSubmitted(false);
          }}
          className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
        >
          <option value="all">All Subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={selectedDifficulty}
          onChange={(e) => {
            setSelectedDifficulty(e.target.value);
            setCurrentIndex(0);
            setIsAnswerSubmitted(false);
          }}
          className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
        >
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Question Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentIndex(0);
            setIsAnswerSubmitted(false);
          }}
          className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
        >
          <option value="all">All Question Types</option>
          <option value="mcq">MCQ</option>
          <option value="case_based">Case-Based Scenario</option>
          <option value="true_false">True / False</option>
          <option value="numerical">Numerical Computation</option>
        </select>

        {/* Text Filter */}
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => {
            setSearchFilter(e.target.value);
            setCurrentIndex(0);
          }}
          placeholder="Filter by keyword / standard..."
          className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 flex-1 min-w-[160px] focus:outline-none"
        />
      </div>

      {/* QUESTION CARD */}
      {!currentQ ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            No questions match your current filter selections.
          </p>
          <button
            onClick={() => {
              setSelectedSubject('all');
              setSelectedDifficulty('all');
              setSelectedType('all');
              setSearchFilter('');
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          {/* Question Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-900">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 font-medium">{currentQ.relatedTopic}</span>
              <span className="text-slate-300">·</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                  currentQ.difficulty === 'Easy'
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentQ.difficulty === 'Medium'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {currentQ.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark(currentQ.id)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  bookmarkedMap[currentQ.id]
                    ? 'border-amber-300 bg-amber-50 text-amber-700'
                    : 'border-slate-200 text-slate-400 hover:text-slate-600'
                }`}
                title="Bookmark for review"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={() =>
                  onOpenTutorForQuestion(currentQ.questionText, currentQ.explanation)
                }
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Explain via AI</span>
              </button>
            </div>
          </div>

          {/* Question Statement */}
          <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
            {currentQ.questionText}
          </div>

          {/* Options / Input Form */}
          {currentQ.options && currentQ.options.length > 0 ? (
            <div className="space-y-2.5">
              {currentQ.options.map((optionText, optIdx) => {
                const isSelected = userSelectedOption === optIdx;
                let optStyle =
                  'border-slate-200 bg-white hover:border-slate-300 text-slate-800';

                if (isAnswerSubmitted) {
                  if (optIdx === currentQ.correctOptionIndex) {
                    optStyle =
                      'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                  } else if (isSelected) {
                    optStyle =
                      'border-red-500 bg-red-50 text-red-950 font-semibold ring-1 ring-red-500';
                  } else {
                    optStyle = 'border-slate-200 bg-slate-50 text-slate-400';
                  }
                } else if (isSelected) {
                  optStyle =
                    'border-slate-900 bg-slate-900 text-white font-medium shadow-sm';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => setUserSelectedOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 ${optStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected && !isAnswerSubmitted
                            ? 'bg-white text-slate-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-snug pt-0.5">{optionText}</span>
                    </div>

                    {isAnswerSubmitted && optIdx === currentQ.correctOptionIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && optIdx !== currentQ.correctOptionIndex && (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Your Answer / Computations
              </label>
              <textarea
                rows={3}
                disabled={isAnswerSubmitted}
                value={numericalInput}
                onChange={(e) => setNumericalInput(e.target.value)}
                placeholder="Type your final numerical answer or concise legal conclusion..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
              />
            </div>
          )}

          {/* Solution & Explanation Drawer */}
          {isAnswerSubmitted && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                {userSelectedOption === currentQ.correctOptionIndex ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct Answer</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Incorrect Answer</span>
                  </div>
                )}
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">
                  ICAI Working Method & Rationale
                </span>
              </div>

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200 font-mono text-[11px]">
                {currentQ.explanation}
              </div>

              {currentQ.workingNotes && (
                <div className="text-xs text-slate-600 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  <span className="font-bold text-amber-950 block mb-1">Working Note:</span>
                  <p>{currentQ.workingNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500 tabular-nums">
              Attempts: {currentQ.attemptCount} · Success Rate:{' '}
              {Math.round(((currentQ.correctCount || 0) / (currentQ.attemptCount || 1)) * 100)}%
            </span>

            <div className="flex items-center gap-2">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={
                    userSelectedOption === null &&
                    (!currentQ.options || currentQ.options.length === 0 ? !numericalInput.trim() : true)
                  }
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-sm"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all shadow-sm"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
