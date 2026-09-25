import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  RotateCcw,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Pause,
  Play,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { StudentProfile, StudyTask, Subject, Chapter } from '../../types';
import { AIService } from '../../services/aiService';

interface Props {
  profile: StudentProfile;
  tasks: StudyTask[];
  subjects: Subject[];
  chapters: Chapter[];
  onTaskStatusChange: (taskId: string, status: 'pending' | 'in_progress' | 'completed' | 'missed') => void;
  onAddTask: (newTask: StudyTask) => void;
  onRescheduleMissedTask: (taskId: string) => void;
  onRegeneratePlan: () => void;
}

export const StudyPlanner: React.FC<Props> = ({
  profile,
  tasks,
  subjects,
  chapters,
  onTaskStatusChange,
  onAddTask,
  onRescheduleMissedTask,
  onRegeneratePlan,
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isStudyPaused, setIsStudyPaused] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSlot, setNewTaskSlot] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Morning');
  const [newTaskDuration, setNewTaskDuration] = useState(60);
  const [newTaskSubject, setNewTaskSubject] = useState(subjects[0]?.id || '');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  const todayStr = new Date().toISOString().slice(0, 10);
  const daysLeft = Math.max(
    0,
    Math.round(
      (new Date(profile.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  const missedTasks = tasks.filter((t) => t.status === 'missed');
  const currentLevelSubjects = subjects.filter((s) => s.caLevel === profile.caLevel);

  const handleAskAiAssistant = async () => {
    setIsAiLoading(true);
    setShowAiModal(true);
    try {
      const res = await AIService.getPlannerAdvice({
        daysLeft,
        dailyHours: profile.dailyHours,
        weakSubjects: profile.weakSubjects,
        strongSubjects: profile.strongSubjects,
        currentCompletion: profile.currentPreparationLevel,
        missedTasksCount: missedTasks.length,
      });
      setAiAdvice(res.advice);
    } catch {
      setAiAdvice('Unable to generate AI study advice at this moment.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task: StudyTask = {
      id: `task_custom_${Date.now()}`,
      date: todayStr,
      timeSlot: newTaskSlot,
      startTime: newTaskSlot === 'Morning' ? '08:30' : newTaskSlot === 'Afternoon' ? '12:00' : newTaskSlot === 'Evening' ? '17:00' : '20:30',
      endTime: newTaskSlot === 'Morning' ? '10:00' : newTaskSlot === 'Afternoon' ? '13:00' : newTaskSlot === 'Evening' ? '18:30' : '21:30',
      subjectId: newTaskSubject || currentLevelSubjects[0]?.id || 'sub_acc',
      chapterId: 'custom',
      title: newTaskTitle.trim(),
      durationMinutes: newTaskDuration,
      status: 'pending',
      notes: newTaskNotes.trim() || undefined,
    };

    onAddTask(task);
    setNewTaskTitle('');
    setNewTaskNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Intelligent CA Study Planner
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
            {profile.caLevel} Study Roadmap
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Exam in {daysLeft} days · {profile.dailyHours} hrs/day · Prioritizing weak areas: {profile.weakSubjects.map((id) => subjects.find((s) => s.id === id)?.name || id).join(', ')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Pause Study Toggle */}
          <button
            onClick={() => setIsStudyPaused(!isStudyPaused)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
              isStudyPaused
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isStudyPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isStudyPaused ? 'Resume Study' : 'Pause Study'}</span>
          </button>

          {/* Regenerate Plan */}
          <button
            onClick={onRegeneratePlan}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate Plan</span>
          </button>

          {/* AI Strategy Assistant */}
          <button
            onClick={handleAskAiAssistant}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Plan Mentor</span>
          </button>

          {/* Add Custom Task */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-800" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Missed Tasks Alert & Rescheduling Notice */}
      {missedTasks.length > 0 && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                {missedTasks.length} Missed Study Task{missedTasks.length > 1 ? 's' : ''} Detected
              </h4>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                CA Master does not discard missed tasks. Our adaptive scheduler re-routes them into your next buffer slot without causing unrealistic overload.
              </p>
            </div>
          </div>
          <button
            onClick={() => onRescheduleMissedTask(missedTasks[0].id)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl transition-colors shrink-0 shadow-sm"
          >
            Auto-Reschedule Next Task
          </button>
        </div>
      )}

      {/* View Switcher: Daily, Weekly, Monthly */}
      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1">
          {(['daily', 'weekly', 'monthly'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                viewMode === mode
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {mode} Plan
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline">
          Today: {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* DAILY VIEW */}
      {viewMode === 'daily' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Morning', 'Afternoon', 'Evening', 'Night'].map((slotName) => {
              const slotTasks = tasks.filter((t) => t.timeSlot === slotName && t.date === todayStr);

              return (
                <div key={slotName} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-bold text-slate-900">{slotName} Slot</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {slotName === 'Morning' && 'Core Practical'}
                      {slotName === 'Afternoon' && 'Law / Theory'}
                      {slotName === 'Evening' && 'Tax / Costing'}
                      {slotName === 'Night' && 'MCQ & Revision'}
                    </span>
                  </div>

                  <div className="space-y-2.5 min-h-[140px]">
                    {slotTasks.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[11px] text-slate-400 py-6">
                        No tasks in this slot
                      </div>
                    ) : (
                      slotTasks.map((task) => {
                        const isCompleted = task.status === 'completed';
                        const isInProgress = task.status === 'in_progress';
                        const isMissed = task.status === 'missed';

                        return (
                          <div
                            key={task.id}
                            className={`p-3 rounded-xl border text-xs space-y-2 transition-all ${
                              isCompleted
                                ? 'bg-emerald-50/30 border-emerald-200'
                                : isInProgress
                                ? 'bg-white border-slate-900 ring-1 ring-slate-900'
                                : isMissed
                                ? 'bg-red-50/30 border-red-200'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-slate-900 line-clamp-2">
                                {task.title}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>
                                {task.startTime} - {task.endTime} ({task.durationMinutes}m)
                              </span>
                            </div>

                            {/* Status triggers */}
                            <div className="pt-1 flex items-center justify-end gap-1.5">
                              {isCompleted ? (
                                <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5">
                                  <CheckCircle2 className="w-3 h-3" /> Done
                                </span>
                              ) : isMissed ? (
                                <button
                                  onClick={() => onRescheduleMissedTask(task.id)}
                                  className="text-[10px] text-red-700 font-semibold hover:underline"
                                >
                                  Reschedule
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => onTaskStatusChange(task.id, 'completed')}
                                    className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded"
                                  >
                                    Done
                                  </button>
                                  <button
                                    onClick={() => onTaskStatusChange(task.id, 'missed')}
                                    className="px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-red-600 rounded"
                                  >
                                    Miss
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setNewTaskSlot(slotName as any);
                      setShowAddModal(true);
                    }}
                    className="w-full py-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-dashed border-slate-200 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add to {slotName}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEKLY & MONTHLY VIEW */}
      {viewMode !== 'daily' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {viewMode === 'weekly' ? '7-Day Weekly Breakdown' : '30-Day Milestone Horizon'}
            </h3>
            <span className="text-xs text-slate-500">
              Balanced syllabus coverage with built-in Sunday buffer blocks
            </span>
          </div>

          <div className="space-y-3">
            {[
              { day: 'Monday', focus: 'Advanced Accounting (Consolidation)', hours: 5, status: 'On Track' },
              { day: 'Tuesday', focus: 'Corporate Law (Accounts & Audit Sec 128-148)', hours: 5, status: 'On Track' },
              { day: 'Wednesday', focus: 'Taxation (PGBP Sec 28-44)', hours: 5, status: 'Pending' },
              { day: 'Thursday', focus: 'Costing (Standard Costing Variance)', hours: 5, status: 'Pending' },
              { day: 'Friday', focus: 'Taxation (GST Input Tax Credit Rules)', hours: 5, status: 'Pending' },
              { day: 'Saturday', focus: 'Weekly Cumulative Revision + 50 MCQs', hours: 5, status: 'Pending' },
              { day: 'Sunday', focus: 'Full Mock Test (2 Hours) + Buffer Catch-Up', hours: 4, status: 'Buffer Day' },
            ].map((row, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-900 w-24">{row.day}</span>
                  <span className="text-slate-700">{row.focus}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 tabular-nums">{row.hours} hrs</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                      row.status === 'On Track'
                        ? 'bg-emerald-100 text-emerald-800'
                        : row.status === 'Buffer Day'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI PLANNER ADVICE MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">AI CA Study Plan Mentor</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            {isAiLoading ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
                <span>Analyzing your syllabus timeline, weak subjects, and daily study capacity...</span>
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto prose prose-slate text-xs leading-relaxed space-y-2">
                <div className="whitespace-pre-line text-slate-700">{aiAdvice}</div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Adaptive strategy calculated for {profile.caLevel}</span>
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs hover:bg-slate-800"
              >
                Apply Recommendations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOM TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Study Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Solve 5 problems on Buyback of Shares"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={newTaskSlot}
                    onChange={(e) => setNewTaskSlot(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="240"
                    step="15"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject
                </label>
                <select
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  {currentLevelSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Study Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="Key concepts to focus on, specific questions to solve..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
