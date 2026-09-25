import React, { useState } from 'react';
import { Check, ArrowRight, BookOpen, Clock, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { CALevel, StudentProfile, Subject, StudyTask } from '../../types';

interface Props {
  isOpen: boolean;
  onComplete: (profile: StudentProfile, initialTasks: StudyTask[]) => void;
  subjects: Subject[];
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onComplete, subjects }) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState('Demo Student');
  const [caLevel, setCaLevel] = useState<CALevel>('Intermediate');
  const [attempt, setAttempt] = useState('May 2026');
  const [examDate, setExamDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 120);
    return d.toISOString().slice(0, 10);
  });
  const [dailyHours, setDailyHours] = useState(5);
  const [preferredStudyTime, setPreferredStudyTime] = useState<'morning' | 'afternoon' | 'evening' | 'night' | 'split'>('split');
  const [currentPrep, setCurrentPrep] = useState(65);
  const [studyGoal, setStudyGoal] = useState('Pass Both Groups on First Attempt');
  const [weakSubjects, setWeakSubjects] = useState<string[]>(['sub_int_tax']);
  const [strongSubjects, setStrongSubjects] = useState<string[]>(['sub_int_acc']);

  // Diagnostic Quiz Answers
  const [diagnosticScore, setDiagnosticScore] = useState<number>(0);
  const [q1Answer, setQ1Answer] = useState<number | null>(null);
  const [q2Answer, setQ2Answer] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentLevelSubjects = subjects.filter((s) => s.caLevel === caLevel);

  const toggleSubjectSelection = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
    if (list.includes(id)) {
      setList(list.filter((x) => x !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleFinish = () => {
    // Generate intelligent slot schedule based on inputs
    const todayStr = new Date().toISOString().slice(0, 10);

    const generatedTasks: StudyTask[] = [
      {
        id: `task_onb_1_${Date.now()}`,
        date: todayStr,
        timeSlot: 'Morning',
        startTime: '08:30',
        endTime: '10:00',
        subjectId: strongSubjects[0] || currentLevelSubjects[0]?.id || 'sub_int_acc',
        chapterId: 'chap_acc_consolidation',
        title: `${currentLevelSubjects[0]?.name || 'Accounting'}: Core Numerical Problem Solving`,
        durationMinutes: 90,
        status: 'pending',
        notes: 'High focus slot: Work through textbook illustrations and working notes.',
      },
      {
        id: `task_onb_2_${Date.now()}`,
        date: todayStr,
        timeSlot: 'Afternoon',
        startTime: '11:30',
        endTime: '12:30',
        subjectId: currentLevelSubjects[1]?.id || 'sub_int_law',
        chapterId: 'chap_law_management',
        title: `${currentLevelSubjects[1]?.name || 'Corporate Law'}: Legal Provisions & Case Studies`,
        durationMinutes: 60,
        status: 'pending',
        notes: 'Read statutory provisions carefully and practice structured legal phrasing.',
      },
      {
        id: `task_onb_3_${Date.now()}`,
        date: todayStr,
        timeSlot: 'Evening',
        startTime: '17:00',
        endTime: '18:30',
        subjectId: weakSubjects[0] || currentLevelSubjects[2]?.id || 'sub_int_tax',
        chapterId: 'chap_tax_salary',
        title: `${currentLevelSubjects[2]?.name || 'Taxation'} (Weak Area Focus): Statutory Computations`,
        durationMinutes: 90,
        status: 'pending',
        notes: 'Priority focus area: Revisit rules, exemptions, and deductions step-by-step.',
      },
      {
        id: `task_onb_4_${Date.now()}`,
        date: todayStr,
        timeSlot: 'Night',
        startTime: '20:30',
        endTime: '21:30',
        subjectId: currentLevelSubjects[3]?.id || 'sub_int_cost',
        chapterId: 'chap_cost_marginal',
        title: 'Daily Practice: 20 MCQs + Formula Flashcard Revision',
        durationMinutes: 60,
        status: 'pending',
        notes: 'Rapid active recall and time-bound question solving.',
      },
    ];

    const newProfile: StudentProfile = {
      id: `student_${Date.now()}`,
      name: name.trim() || 'CA Aspirant',
      role: 'student',
      caLevel,
      attempt,
      examDate,
      dailyHours,
      preferredStudyTime,
      currentPreparationLevel: currentPrep,
      strongSubjects,
      weakSubjects,
      selectedSubjects: currentLevelSubjects.map((s) => s.id),
      studyGoal,
      xp: 250 + diagnosticScore * 50,
      streakDays: 1,
      lastActiveDate: todayStr,
      onboardingCompleted: true,
      dailyAIQuestionsUsed: 0,
      aiQuestionsLimit: 25,
      notificationsEnabled: true,
      theme: 'light',
    };

    onComplete(newProfile, generatedTasks);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 my-8 border border-slate-200">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Welcome to CA Master
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              {step === 1 && 'Step 1: Your Exam Profile'}
              {step === 2 && 'Step 2: Study Availability & Priorities'}
              {step === 3 && 'Step 3: Quick Diagnostic Assessment'}
              {step === 4 && 'Step 4: Your Personalized Plan is Ready!'}
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {step} of 4
          </span>
        </div>

        {/* STEP 1: Basic Profile */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CA Level
                </label>
                <select
                  value={caLevel}
                  onChange={(e) => setCaLevel(e.target.value as CALevel)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="Foundation">CA Foundation</option>
                  <option value="Intermediate">CA Intermediate</option>
                  <option value="Final">CA Final</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Attempt
                </label>
                <select
                  value={attempt}
                  onChange={(e) => setAttempt(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="May 2026">May 2026</option>
                  <option value="September 2026">September 2026</option>
                  <option value="November 2026">November 2026</option>
                  <option value="January 2027">January 2027</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Exam Start Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Syllabus Preparedness: {currentPrep}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentPrep}
                  onChange={(e) => setCurrentPrep(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg accent-slate-900 cursor-pointer mt-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Study Goal
              </label>
              <input
                type="text"
                value={studyGoal}
                onChange={(e) => setStudyGoal(e.target.value)}
                placeholder="e.g. Rank 1-50 or Clear in First Attempt"
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Study Habits & Subjects */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Daily Available Study Time: <span className="font-bold text-slate-900">{dailyHours} hours/day</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg accent-slate-900 cursor-pointer mt-2"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Recommended for CA: 5–8 hours daily
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Peak Time
                </label>
                <select
                  value={preferredStudyTime}
                  onChange={(e) => setPreferredStudyTime(e.target.value as any)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="split">Split Routine (Morning + Evening)</option>
                  <option value="morning">Early Morning Focused</option>
                  <option value="afternoon">Afternoon & Evening</option>
                  <option value="night">Night Owl</option>
                </select>
              </div>
            </div>

            {/* Weak subjects */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Subjects Requiring Extra Attention (Weak Areas)
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {currentLevelSubjects.map((sub) => {
                  const isWeak = weakSubjects.includes(sub.id);
                  return (
                    <button
                      type="button"
                      key={sub.id}
                      onClick={() => toggleSubjectSelection(weakSubjects, setWeakSubjects, sub.id)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                        isWeak
                          ? 'border-red-500 bg-red-50/60 text-red-950 font-medium'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="truncate">{sub.name}</span>
                      {isWeak && <Check className="w-3.5 h-3.5 text-red-600 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Strong subjects */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Confident / Strong Subjects
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {currentLevelSubjects.map((sub) => {
                  const isStrong = strongSubjects.includes(sub.id);
                  return (
                    <button
                      type="button"
                      key={sub.id}
                      onClick={() => toggleSubjectSelection(strongSubjects, setStrongSubjects, sub.id)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                        isStrong
                          ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-medium'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="truncate">{sub.name}</span>
                      {isStrong && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Diagnostic Mini-Quiz */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Diagnostic Check:</span> Answer these 2 quick questions to help the planner calibrate your starting task difficulty. (Not an official ICAI test).
            </div>

            <div className="space-y-3">
              <div className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-2">
                <span className="text-xs font-bold text-slate-800">
                  Q1: Under Accounting Standards (AS 10 / Ind AS 16), which cost cannot be capitalized?
                </span>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  {['Site preparation costs', 'Launch or inauguration ceremony expense', 'Initial trial run testing costs'].map((opt, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => {
                        setQ1Answer(i);
                        if (i === 1) setDiagnosticScore((s) => s + 1);
                      }}
                      className={`text-left p-2 rounded-lg border transition-colors ${
                        q1Answer === i
                          ? 'border-slate-900 bg-slate-900 text-white font-medium'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-2">
                <span className="text-xs font-bold text-slate-800">
                  Q2: Under Companies Act 2013, standard notice period for an AGM is:
                </span>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  {['14 clear days', '21 clear days', '30 days'].map((opt, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => {
                        setQ2Answer(i);
                        if (i === 1) setDiagnosticScore((s) => s + 1);
                      }}
                      className={`text-left p-2 rounded-lg border transition-colors ${
                        q2Answer === i
                          ? 'border-slate-900 bg-slate-900 text-white font-medium'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review Generated Plan */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Intelligent Slot Allocation Generated</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Based on your daily goal of {dailyHours} hours, exam target ({attempt}), and weak subject priorities, your daily schedule is structured into 4 balanced slots:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-900 block">Morning (08:30 - 10:00)</span>
                  <span className="text-slate-600">Accounting / Practical Computations · 1.5 hrs</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-900 block">Afternoon (11:30 - 12:30)</span>
                  <span className="text-slate-600">Corporate & Business Law · 1 hr</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-900 block">Evening (17:00 - 18:30)</span>
                  <span className="text-slate-600">Taxation (Weak Focus) · 1.5 hrs</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-900 block">Night (20:30 - 21:30)</span>
                  <span className="text-slate-600">Daily Practice & Spaced MCQs · 1 hr</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>If you miss a task, the planner automatically shifts it to a buffer slot rather than deleting it.</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              <span>Start My Preparation</span>
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
