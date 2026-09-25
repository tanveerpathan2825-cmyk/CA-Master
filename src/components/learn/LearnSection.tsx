import React, { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Bookmark,
} from 'lucide-react';
import { CALevel, Subject, Chapter, Lesson } from '../../types';

interface Props {
  caLevel: CALevel;
  subjects: Subject[];
  chapters: Chapter[];
  lessons: Lesson[];
  onOpenTutorForLesson: (lessonTitle: string, subjectName: string) => void;
  onNavigateToPractice: (subjectId: string, chapterId: string) => void;
}

export const LearnSection: React.FC<Props> = ({
  caLevel,
  subjects,
  chapters,
  lessons,
  onOpenTutorForLesson,
  onNavigateToPractice,
}) => {
  const currentSubjects = subjects.filter((s) => s.caLevel === caLevel);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(currentSubjects[0]?.id || '');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Quick quiz state inside active lesson
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || currentSubjects[0];
  const subjectChapters = chapters.filter((c) => c.subjectId === (activeSubject?.id || ''));
  const chapterLessons = selectedChapterId
    ? lessons.filter((l) => l.chapterId === selectedChapterId)
    : [];

  const handleOpenLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setQuizAnswers({});
    setShowQuizResults(false);
    setIsBookmarked(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Structured CA Learning
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
            CA {caLevel} Syllabus
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Original conceptual breakdowns, practical examples, common ICAI exam traps, and chapter summaries.
          </p>
        </div>

        {/* Subject selector tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
          {currentSubjects.map((sub) => {
            const isSelected = sub.id === (activeSubject?.id || '');
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubjectId(sub.id);
                  setSelectedChapterId(null);
                  setActiveLesson(null);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sub.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* LESSON DETAIL VIEW */}
      {activeLesson ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-6">
          {/* Lesson Top Bar */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveLesson(null)}
                className="p-2 hover:bg-slate-200/80 rounded-xl transition-colors text-slate-600"
                title="Back to chapters"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-xs font-semibold text-slate-500">
                  {activeSubject?.name} · Lesson #{activeLesson.order}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {activeLesson.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-xl border transition-colors ${
                  isBookmarked
                    ? 'border-amber-300 bg-amber-50 text-amber-700'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
                title="Bookmark Lesson"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => onOpenTutorForLesson(activeLesson.title, activeSubject?.name || 'CA')}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ask AI Tutor</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8 max-w-4xl mx-auto">
            {/* 1. Simple Explanation */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                1. Simple Conceptual Explanation
              </h3>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeLesson.simpleExplanation}
              </div>
            </div>

            {/* 2. Key Concepts */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                2. Key Principles & Rules
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {activeLesson.keyConcepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-100 bg-white flex items-start gap-2.5 text-xs text-slate-700 shadow-xs"
                  >
                    <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="leading-relaxed">{concept}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Examples & Step-by-Step Solutions */}
            {activeLesson.examples.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                  3. Concrete Practical Example
                </h3>
                {activeLesson.examples.map((ex, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-3.5 bg-slate-100/70 border-b border-slate-200 font-semibold text-xs text-slate-900 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>{ex.title}</span>
                    </div>
                    <div className="p-4 space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">Problem Scenario:</span>
                        <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                          {ex.scenario}
                        </p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">Step-by-Step Solution:</span>
                        <div className="text-slate-800 whitespace-pre-line leading-relaxed bg-emerald-50/40 p-3 rounded-lg border border-emerald-100 font-mono text-[11px]">
                          {ex.solution}
                        </div>
                      </div>
                      {ex.workingNotes && (
                        <div>
                          <span className="font-bold text-slate-700 block mb-1">ICAI Working Notes:</span>
                          <div className="text-slate-600 whitespace-pre-line text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            {ex.workingNotes}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Important Points & Common Mistakes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Important ICAI Points</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                  {activeLesson.importantPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-red-200 bg-red-50/30 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-red-900">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Common Exam Traps</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                  {activeLesson.commonMistakes.map((cm, i) => (
                    <li key={i}>{cm}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 5. Quick Check Quiz */}
            {activeLesson.quickQuiz.length > 0 && (
              <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-slate-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm font-bold text-slate-900">Quick Concept Quiz</h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    {activeLesson.quickQuiz.length} Question(s)
                  </span>
                </div>

                <div className="space-y-4">
                  {activeLesson.quickQuiz.map((q, qIndex) => {
                    const selected = quizAnswers[qIndex];
                    const isAnswered = selected !== undefined;
                    const isCorrect = selected === q.correctIndex;

                    return (
                      <div key={qIndex} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                        <span className="text-xs font-bold text-slate-900 block">
                          Q{qIndex + 1}: {q.question}
                        </span>

                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isChosen = selected === optIdx;
                            let btnStyle = 'border-slate-200 text-slate-700 hover:bg-slate-50';

                            if (showQuizResults) {
                              if (optIdx === q.correctIndex) {
                                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                              } else if (isChosen) {
                                btnStyle = 'border-red-500 bg-red-50 text-red-950 font-semibold';
                              }
                            } else if (isChosen) {
                              btnStyle = 'border-slate-900 bg-slate-900 text-white font-semibold';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={showQuizResults}
                                onClick={() => {
                                  setQuizAnswers({ ...quizAnswers, [qIndex]: optIdx });
                                }}
                                className={`text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {showQuizResults && (
                          <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-100">
                            <span className="font-bold text-slate-800">
                              {isCorrect ? 'Correct!' : 'Incorrect'}
                            </span>
                            <p className="text-slate-600">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  {!showQuizResults ? (
                    <button
                      onClick={() => setShowQuizResults(true)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                    >
                      Check Answers
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowQuizResults(false);
                        setQuizAnswers({});
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      Retry Quiz
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 6. Revision Summary & Action */}
            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span>High-Yield Revision Summary</span>
              </div>
              <ul className="text-xs text-amber-950 space-y-1 list-disc pl-4">
                {activeLesson.revisionSummary.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <div className="pt-2 flex items-center justify-between border-t border-amber-200/60">
                <span className="text-[11px] text-amber-800">Ready to test your understanding?</span>
                <button
                  onClick={() => onNavigateToPractice(activeSubject.id, activeLesson.chapterId)}
                  className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Practice Chapter MCQs
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CHAPTER / TOPIC LIST VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Subject overview card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: activeSubject?.color || '#0284c7' }}
              >
                {activeSubject?.code}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {activeSubject?.name}
                </h3>
                <span className="text-xs text-slate-500">{activeSubject?.weightageHint}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeSubject?.description}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-700">
                <span>Completed Chapters</span>
                <span className="font-bold tabular-nums">
                  {activeSubject?.completedChapters} / {activeSubject?.totalChapters}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.round(
                      ((activeSubject?.completedChapters || 0) /
                        (activeSubject?.totalChapters || 1)) *
                        100
                    )}%`,
                    backgroundColor: activeSubject?.color || '#0284c7',
                  }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">
                Syllabus Version: {activeSubject?.syllabusVersion}
              </span>
            </div>
          </div>

          {/* Right: Chapter list & Lessons (2 spans) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {activeSubject?.name} Chapters ({subjectChapters.length})
              </h3>
              <span className="text-xs text-slate-500">Select a chapter to explore lessons</span>
            </div>

            <div className="space-y-3">
              {subjectChapters.map((chapter) => {
                const isSelected = selectedChapterId === chapter.id;
                const chapterLessonsList = lessons.filter((l) => l.chapterId === chapter.id);

                return (
                  <div
                    key={chapter.id}
                    className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all hover:border-slate-300"
                  >
                    <div
                      onClick={() => setSelectedChapterId(isSelected ? null : chapter.id)}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {chapter.chapterNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              {chapter.importance} Exam Weightage
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[11px] text-slate-500">
                              ~{chapter.estimatedHours} hrs
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                            {chapter.title}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {chapter.isCompleted ? (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 tabular-nums">
                            {chapter.completionPercentage}%
                          </span>
                        )}
                        <ChevronRight
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            isSelected ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Lessons */}
                    {isSelected && (
                      <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-2">
                        <span className="text-xs font-semibold text-slate-600 block pt-2">
                          Available Lessons ({chapterLessonsList.length}):
                        </span>

                        {chapterLessonsList.length === 0 ? (
                          <div className="p-3 text-xs text-slate-500 bg-white rounded-xl border border-slate-100">
                            Study notes being synchronized for this chapter.
                          </div>
                        ) : (
                          chapterLessonsList.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => handleOpenLesson(lesson)}
                              className="w-full p-3 bg-white hover:bg-slate-100/70 border border-slate-200 rounded-xl text-left flex items-center justify-between gap-3 transition-colors group"
                            >
                              <div className="flex items-center gap-2.5">
                                <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                                <span className="text-xs font-semibold text-slate-900 group-hover:text-slate-950">
                                  {lesson.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                                <span>{lesson.estimatedMinutes} mins</span>
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </button>
                          ))
                        )}

                        <div className="pt-2 flex items-center justify-end">
                          <button
                            onClick={() => onNavigateToPractice(activeSubject.id, chapter.id)}
                            className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1"
                          >
                            <span>Practice Chapter Questions</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
