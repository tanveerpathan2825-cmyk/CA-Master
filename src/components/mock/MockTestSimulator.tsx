import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Send,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  ChevronRight,
} from 'lucide-react';
import { MockTest, TestAttemptResult, Subject } from '../../types';

interface Props {
  mockTests: MockTest[];
  subjects: Subject[];
  onSaveResult: (result: TestAttemptResult) => void;
  onNavigateToRevision: () => void;
}

export const MockTestSimulator: React.FC<Props> = ({
  mockTests,
  subjects,
  onSaveResult,
  onNavigateToRevision,
}) => {
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [latestReport, setLatestReport] = useState<TestAttemptResult | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);

  // Countdown timer
  useEffect(() => {
    if (!activeTest || isTestSubmitted) return;

    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTest, isTestSubmitted]);

  const handleStartTest = (test: MockTest) => {
    setActiveTest(test);
    setCurrentQIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setTimeRemainingSeconds(test.durationMinutes * 60);
    setIsTestSubmitted(false);
    setLatestReport(null);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleClearAnswer = (questionId: string) => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const handleToggleReview = (questionId: string) => {
    setMarkedForReview((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;

    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    const weakTopicsSet = new Set<string>();

    activeTest.questions.forEach((q) => {
      const studentChoice = userAnswers[q.id];
      if (studentChoice !== undefined) {
        if (studentChoice === q.correctIndex) {
          score += q.marks;
          correctCount += 1;
        } else {
          score -= q.negativeMarks;
          incorrectCount += 1;
          weakTopicsSet.add(q.chapterName);
        }
      }
    });

    const totalQuestions = activeTest.questions.length;
    const answeredCount = Object.keys(userAnswers).length;
    const unansweredCount = totalQuestions - answeredCount;
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    const timeTaken = activeTest.durationMinutes * 60 - timeRemainingSeconds;

    const report: TestAttemptResult = {
      id: `result_${Date.now()}`,
      testId: activeTest.id,
      testTitle: activeTest.title,
      date: new Date().toISOString().slice(0, 10),
      timeTakenSeconds: timeTaken,
      score: Math.max(0, Math.round(score * 10) / 10),
      totalMarks: activeTest.totalMarks,
      accuracy,
      correctAnswersCount: correctCount,
      incorrectAnswersCount: incorrectCount,
      unansweredCount,
      weakTopics: Array.from(weakTopicsSet),
      recommendedRevision: [
        'Review statutory exceptions and formulas for missed questions',
        'Practice 10 high-difficulty caselet MCQs on identified weak chapters',
      ],
      userAnswers,
    };

    setLatestReport(report);
    setIsTestSubmitted(true);
    setShowConfirmSubmit(false);
    onSaveResult(report);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // IF TEST IS SUBMITTED: SHOW DETAILED PERFORMANCE REPORT
  if (latestReport && isTestSubmitted) {
    const isPassed = latestReport.score >= (activeTest?.passingMarks || 20);

    return (
      <div className="space-y-6 pb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Diagnostic Assessment Report
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
              {latestReport.testTitle}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Time taken: {Math.floor(latestReport.timeTakenSeconds / 60)} mins · Evaluated against standard ICAI negative marking
            </p>
          </div>

          <button
            onClick={() => setActiveTest(null)}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Back to Mock Hub
          </button>
        </div>

        {/* Big Scorecard Banner */}
        <div
          className={`p-6 rounded-2xl border ${
            isPassed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-amber-50/50 border-amber-200'
          } flex flex-col md:flex-row md:items-center justify-between gap-6`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                isPassed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-600">
                {isPassed ? 'Passing Benchmark Cleared' : 'Needs Reinforced Practice'}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {latestReport.score} / {latestReport.totalMarks} Marks
              </h2>
              <span className="text-xs text-slate-500">
                Passing Cutoff: {activeTest?.passingMarks} Marks · Accuracy: {latestReport.accuracy}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Correct</span>
              <span className="text-lg font-bold text-emerald-600 tabular-nums">
                {latestReport.correctAnswersCount}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Incorrect</span>
              <span className="text-lg font-bold text-red-600 tabular-nums">
                {latestReport.incorrectAnswersCount}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Unanswered</span>
              <span className="text-lg font-bold text-slate-500 tabular-nums">
                {latestReport.unansweredCount}
              </span>
            </div>
          </div>
        </div>

        {/* Diagnosis & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weak Topics */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
              <AlertCircle className="w-4 h-4" />
              <span>Identified Weak Topics</span>
            </div>
            {latestReport.weakTopics.length === 0 ? (
              <p className="text-xs text-slate-500">Great job! No prominent weak topics flagged.</p>
            ) : (
              <ul className="space-y-2 text-xs text-slate-700">
                {latestReport.weakTopics.map((topic, i) => (
                  <li
                    key={i}
                    className="p-2.5 rounded-lg bg-red-50/50 border border-red-100 flex items-center justify-between"
                  >
                    <span>{topic}</span>
                    <span className="text-[10px] font-semibold text-red-700">Add to Revision</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recommended Revision */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>Recommended Next Steps</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {latestReport.recommendedRevision.map((rec, i) => (
                <li key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  {rec}
                </li>
              ))}
            </ul>

            <button
              onClick={onNavigateToRevision}
              className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Go to Spaced Revision Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // IF TEST IS IN PROGRESS: FULL SCREEN SIMULATOR
  if (activeTest && !isTestSubmitted) {
    const currentQ = activeTest.questions[currentQIndex];
    const selectedOpt = userAnswers[currentQ?.id];
    const isMarked = markedForReview[currentQ?.id];

    return (
      <div className="space-y-4 pb-12">
        {/* Simulator Header */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
          <div className="truncate">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
              ICAI Examination Simulation Mode
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white truncate">
              {activeTest.title}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Countdown Clock */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-xl font-mono text-sm font-bold text-amber-400 border border-slate-700">
              <Clock className="w-4 h-4" />
              <span>{formatTimer(timeRemainingSeconds)}</span>
            </div>

            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Test</span>
            </button>
          </div>
        </div>

        {/* Main Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Stage (3 cols) */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-900">
                Question #{currentQIndex + 1} of {activeTest.questions.length}
              </span>
              <span className="text-slate-500 font-medium">
                Marks: +{currentQ.marks} | -{currentQ.negativeMarks}
              </span>
            </div>

            <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed whitespace-pre-line min-h-[80px]">
              {currentQ.questionText}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedOpt === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white font-medium shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-800 bg-white'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="leading-snug pt-0.5">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation & Controls */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleReview(currentQ.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                    isMarked
                      ? 'border-purple-300 bg-purple-50 text-purple-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>

                {selectedOpt !== undefined && (
                  <button
                    onClick={() => handleClearAnswer(currentQ.id)}
                    className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600"
                  >
                    Clear Response
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => prev - 1)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (currentQIndex < activeTest.questions.length - 1) {
                      setCurrentQIndex((prev) => prev + 1);
                    }
                  }}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </div>

          {/* Question Palette (1 col) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Question Palette
            </h4>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-500 inline-block" />
                <span>Marked Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
                <span>Not Visited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-200 inline-block" />
                <span>Unanswered</span>
              </div>
            </div>

            {/* Grid of buttons */}
            <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto">
              {activeTest.questions.map((q, idx) => {
                const isAns = userAnswers[q.id] !== undefined;
                const isRev = markedForReview[q.id];
                const isCurrent = currentQIndex === idx;

                let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
                if (isRev) badgeColor = 'bg-purple-500 text-white border-purple-600';
                else if (isAns) badgeColor = 'bg-emerald-500 text-white border-emerald-600';

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-9 rounded-lg font-bold text-xs border flex items-center justify-center transition-all ${badgeColor} ${
                      isCurrent ? 'ring-2 ring-slate-900 ring-offset-1' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SUBMIT CONFIRMATION MODAL */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Confirm Exam Submission?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have answered {Object.keys(userAnswers).length} out of {activeTest.questions.length} questions. Are you sure you want to finish and evaluate your test?
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Continue Test
                </button>
                <button
                  onClick={handleSubmitTest}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 shadow-sm"
                >
                  Yes, Submit Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // DEFAULT VIEW: LIST OF MOCK TESTS
  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            ICAI Exam Simulator
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Mock Test Series</h1>
          <p className="text-xs text-slate-600 mt-1">
            Simulate real exam pressure with strict countdown timers, negative marking, and diagnostic performance reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-slate-400">
                  {test.type.replace('_', ' ')}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {test.durationMinutes} mins
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{test.title}</h3>
              <p className="text-xs text-slate-600">
                Covers high-yield questions across subjects with real-time scoring.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                {test.totalMarks} Marks · {test.questions.length} MCQs
              </span>
              <button
                onClick={() => handleStartTest(test)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>Start Test</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
