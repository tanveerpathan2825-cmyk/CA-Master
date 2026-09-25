import React from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Briefcase,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { StudentProfile, StudyTask, Subject } from '../../types';
import { LegalDisclaimerBanner } from '../common/LegalDisclaimerBanner';

interface Props {
  profile: StudentProfile;
  tasks: StudyTask[];
  subjects: Subject[];
  onTaskStatusChange: (taskId: string, status: 'pending' | 'in_progress' | 'completed' | 'missed') => void;
  onNavigate: (tab: string, contextId?: string) => void;
  onOpenTutor: () => void;
  onRescheduleMissedTask: (taskId: string) => void;
}

export const HomeDashboard: React.FC<Props> = ({
  profile,
  tasks,
  subjects,
  onTaskStatusChange,
  onNavigate,
  onOpenTutor,
  onRescheduleMissedTask,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter((t) => t.date === todayStr);

  const completedTasks = todayTasks.filter((t) => t.status === 'completed');
  const completedMinutes = completedTasks.reduce((acc, t) => acc + t.durationMinutes, 0);
  const completedHours = (completedMinutes / 60).toFixed(1);

  // Recommended next task is the first task that is either 'in_progress' or 'pending'
  const nextTask = todayTasks.find((t) => t.status === 'in_progress' || t.status === 'pending');

  const currentLevelSubjects = subjects.filter((s) => s.caLevel === profile.caLevel);

  // Calculate days left to exam
  const daysLeft = Math.max(
    0,
    Math.round(
      (new Date(profile.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            CA {profile.caLevel} · {profile.attempt}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
            {getGreeting()}, {profile.name}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {daysLeft} days remaining until exam · Goal: {profile.dailyHours} hrs daily
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('mock')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
          >
            Take Mock Test
          </button>
          <button
            onClick={onOpenTutor}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Today's Progress Stat Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Hours Completed */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Study Hours</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                {completedHours}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ {profile.dailyHours}h</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-sky-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (Number(completedHours) / profile.dailyHours) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Tasks Done</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                {completedTasks.length}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ {todayTasks.length}</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              {todayTasks.length - completedTasks.length} pending today
            </span>
          </div>
        </div>

        {/* Questions Solved */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Questions Solved</span>
            <HelpCircle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                124
              </span>
              <span className="text-xs text-emerald-600 font-semibold">+18 today</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">78% accuracy rate</span>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                {profile.streakDays}
              </span>
              <span className="text-xs text-slate-500 font-medium">days in a row</span>
            </div>
            <span className="text-[11px] text-amber-700 block mt-1 font-medium">
              Keep it up tomorrow!
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Next Task Callout */}
      {nextTask && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Next Task</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">
                {nextTask.timeSlot} ({nextTask.startTime} - {nextTask.endTime})
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {nextTask.title}
            </h3>
            {nextTask.notes && (
              <p className="text-xs text-slate-300 line-clamp-1">{nextTask.notes}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {nextTask.status === 'in_progress' ? (
              <button
                onClick={() => onTaskStatusChange(nextTask.id, 'completed')}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Completed</span>
              </button>
            ) : (
              <button
                onClick={() => onTaskStatusChange(nextTask.id, 'in_progress')}
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Now</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid: Today's Plan & Overall Preparation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Plan (2 spans) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">Today's Study Plan</h2>
            </div>
            <button
              onClick={() => onNavigate('planner')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <span>Full Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todayTasks.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No tasks scheduled for today. Use the planner to generate today's slots!
              </div>
            ) : (
              todayTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const isInProgress = task.status === 'in_progress';
                const isMissed = task.status === 'missed';

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCompleted
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : isInProgress
                        ? 'border-slate-900 ring-1 ring-slate-900'
                        : isMissed
                        ? 'border-red-200 bg-red-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-center min-w-[65px] shrink-0">
                        <span className="text-[11px] font-mono text-slate-500 block tabular-nums">
                          {task.startTime}
                        </span>
                        <span className="text-[10px] text-slate-400 block tabular-nums">
                          to {task.endTime}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {task.timeSlot}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-[11px] font-medium text-slate-500">
                            {task.durationMinutes} mins
                          </span>
                        </div>
                        <h4
                          className={`text-sm font-semibold leading-snug ${
                            isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </h4>
                        {task.notes && (
                          <p className="text-xs text-slate-500">{task.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {isCompleted ? (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Done
                        </span>
                      ) : isInProgress ? (
                        <button
                          onClick={() => onTaskStatusChange(task.id, 'completed')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Complete
                        </button>
                      ) : isMissed ? (
                        <button
                          onClick={() => onRescheduleMissedTask(task.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reschedule
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onTaskStatusChange(task.id, 'in_progress')}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => onTaskStatusChange(task.id, 'missed')}
                            className="px-2 py-1.5 text-slate-400 hover:text-red-600 text-xs rounded-lg transition-colors"
                            title="Mark as missed"
                          >
                            Missed?
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Overall Preparation & Subject Performance */}
        <div className="space-y-6">
          {/* Overall Prep Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Overall Preparation</h3>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {profile.currentPreparationLevel}%
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-slate-900 h-full rounded-full transition-all duration-700"
                style={{ width: `${profile.currentPreparationLevel}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Based on your chapter completions, revision cycles, and mock test scores. Not an ICAI examination pass prediction.
            </p>

            {/* Subject-Wise Performance Breakdown */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="text-xs font-semibold text-slate-700 block">
                Subject Performance:
              </span>

              {currentLevelSubjects.slice(0, 4).map((sub) => {
                // Calculate percentage based on completed chapters
                const pct = Math.min(
                  100,
                  Math.round((sub.completedChapters / (sub.totalChapters || 1)) * 100)
                );
                return (
                  <div key={sub.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800 truncate max-w-[170px]">
                        {sub.name}
                      </span>
                      <span className="font-semibold text-slate-700 tabular-nums">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: sub.color || '#0f172a',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Shortcuts Bento */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-900 block">Preparation Modules</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('revision')}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-left transition-all"
              >
                <RotateCcw className="w-4 h-4 text-amber-600 mb-1" />
                <span className="font-semibold text-slate-900 block">Revision Hub</span>
                <span className="text-[10px] text-slate-500">Spaced recall</span>
              </button>
              <button
                onClick={() => onNavigate('practical')}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-left transition-all"
              >
                <Briefcase className="w-4 h-4 text-purple-600 mb-1" />
                <span className="font-semibold text-slate-900 block">Practical Skills</span>
                <span className="text-[10px] text-slate-500">BRS & Journal</span>
              </button>
              <button
                onClick={() => onNavigate('practice')}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-left transition-all"
              >
                <HelpCircle className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="font-semibold text-slate-900 block">Practice MCQs</span>
                <span className="text-[10px] text-slate-500">Case questions</span>
              </button>
              <button
                onClick={() => onNavigate('progress')}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-left transition-all"
              >
                <TrendingUp className="w-4 h-4 text-sky-600 mb-1" />
                <span className="font-semibold text-slate-900 block">CA Health</span>
                <span className="text-[10px] text-slate-500">Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <LegalDisclaimerBanner />
    </div>
  );
};
