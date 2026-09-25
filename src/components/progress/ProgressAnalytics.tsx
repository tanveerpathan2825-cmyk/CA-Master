import React from 'react';
import {
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  Target,
  BarChart2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { StudentProfile, Subject, Chapter, AchievementBadge, TestAttemptResult } from '../../types';

interface Props {
  profile: StudentProfile;
  subjects: Subject[];
  chapters: Chapter[];
  achievements: AchievementBadge[];
  testResults: TestAttemptResult[];
}

export const ProgressAnalytics: React.FC<Props> = ({
  profile,
  subjects,
  chapters,
  achievements,
  testResults,
}) => {
  const currentSubjects = subjects.filter((s) => s.caLevel === profile.caLevel);
  const totalChaptersCount = currentSubjects.reduce((acc, s) => acc + s.totalChapters, 0);
  const completedChaptersCount = currentSubjects.reduce((acc, s) => acc + s.completedChapters, 0);

  // CA Preparation Health Indicators (5 Dimensions)
  const healthMetrics = [
    {
      category: 'Syllabus Coverage',
      score: Math.min(100, Math.round((completedChaptersCount / (totalChaptersCount || 1)) * 100)),
      color: '#0284c7',
      hint: `${completedChaptersCount} of ${totalChaptersCount} chapters completed`,
    },
    {
      category: 'Practice Volume',
      score: 78,
      color: '#059669',
      hint: '124 questions attempted · 78% accuracy',
    },
    {
      category: 'Revision Retention',
      score: 82,
      color: '#d97706',
      hint: '14 of 16 scheduled spaced recall items cleared',
    },
    {
      category: 'Mock Test Readiness',
      score: testResults.length > 0 ? testResults[0].accuracy : 65,
      color: '#7c3aed',
      hint: `${testResults.length} mock tests attempted · Diagnostic active`,
    },
    {
      category: 'Study Consistency',
      score: Math.min(100, profile.streakDays * 14),
      color: '#ea580c',
      hint: `${profile.streakDays} day unbroken streak · ${profile.dailyHours}h daily goal`,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Preparation Intelligence
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
            CA Preparation Analytics
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Holistic tracking across syllabus coverage, practice accuracy, spaced revision, and streak consistency.
          </p>
        </div>

        {/* Gamification summary pill */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>{profile.streakDays} Day Streak</span>
          </div>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>{profile.xp} XP</span>
          </div>
        </div>
      </div>

      {/* CA PREPARATION HEALTH (5 CATEGORIES) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">CA Preparation Health</h3>
            <p className="text-xs text-slate-500">
              Evaluates your habit equilibrium across 5 key pillars. Not a prediction of passing examination marks.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Overall Readiness: {profile.currentPreparationLevel}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {healthMetrics.map((hm, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-700 block">{hm.category}</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums block mt-1">
                  {hm.score}%
                </span>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${hm.score}%`, backgroundColor: hm.color }}
                  />
                </div>
              </div>
              <span className="text-[10px] text-slate-500 block pt-1 leading-snug">{hm.hint}</span>
            </div>
          ))}
        </div>
      </div>

      {/* METRICS & CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Hours Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Weekly Study Hours</h4>
            <span className="text-xs text-slate-500">Target: {profile.dailyHours}h/day</span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100">
            {[
              { day: 'Mon', hours: 5.0, height: 80 },
              { day: 'Tue', hours: 5.5, height: 90 },
              { day: 'Wed', hours: 4.5, height: 70 },
              { day: 'Thu', hours: 6.0, height: 100 },
              { day: 'Fri', hours: 5.0, height: 80 },
              { day: 'Sat', hours: 6.5, height: 105 },
              { day: 'Sun', hours: 4.0, height: 65 },
            ].map((col, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-mono text-slate-600 tabular-nums">
                  {col.hours}h
                </span>
                <div
                  className="w-full max-w-[28px] bg-slate-900 rounded-t-lg transition-all hover:bg-slate-700"
                  style={{ height: `${Math.min(100, col.height)}%` }}
                />
                <span className="text-[10px] text-slate-400 font-medium">{col.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total This Week: 36.5 hours</span>
            <span className="text-emerald-700 font-semibold">+4.2 hours vs last week</span>
          </div>
        </div>

        {/* Subject Completion Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Syllabus Completion by Subject</h4>
            <span className="text-xs text-slate-500">CA {profile.caLevel}</span>
          </div>

          <div className="space-y-3">
            {currentSubjects.map((sub) => {
              const pct = Math.min(
                100,
                Math.round((sub.completedChapters / (sub.totalChapters || 1)) * 100)
              );
              return (
                <div key={sub.id} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{sub.name}</span>
                    <span className="font-mono text-slate-600">
                      {sub.completedChapters}/{sub.totalChapters} Chaps ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: sub.color || '#0284c7' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* GAMIFICATION & MILESTONE BADGES */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">Study Milestones & Badges</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Non-manipulative progress rewards</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {achievements.map((badge) => {
            const isUnlocked = Boolean(badge.unlockedAt);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                  isUnlocked
                    ? 'border-amber-200 bg-amber-50/40 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      <Award className="w-4 h-4" />
                    </span>
                    {isUnlocked && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-2">{badge.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-snug">
                    {badge.description}
                  </p>
                </div>

                {!isUnlocked && (
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-400 h-full rounded-full"
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
