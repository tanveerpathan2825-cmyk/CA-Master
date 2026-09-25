import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  Megaphone,
  BookOpen,
  CheckSquare,
  Users,
  AlertCircle,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import { Subject, Chapter, PracticeQuestion, AdminAnnouncement, CALevel } from '../../types';

interface Props {
  subjects: Subject[];
  chapters: Chapter[];
  questions: PracticeQuestion[];
  announcements: AdminAnnouncement[];
  onAddSubject: (newSubject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
  onAddAnnouncement: (announcement: AdminAnnouncement) => void;
  onAddQuestion: (question: PracticeQuestion) => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<Props> = ({
  subjects,
  chapters,
  questions,
  announcements,
  onAddSubject,
  onDeleteSubject,
  onAddAnnouncement,
  onAddQuestion,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'questions' | 'announcements'>('overview');

  // New announcement form state
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<'Exam Alert' | 'Amendment' | 'Study Tip' | 'Feature'>('Amendment');
  const [annContent, setAnnContent] = useState('');

  // New subject form state
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subLevel, setSubLevel] = useState<CALevel>('Intermediate');
  const [subVersion, setSubVersion] = useState('New Scheme 2024-2026');
  const [subDesc, setSubDesc] = useState('');

  // New question form state
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [qText, setQText] = useState('');
  const [qSubjectId, setQSubjectId] = useState(subjects[0]?.id || '');
  const [qDifficulty, setQDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrectIdx, setQCorrectIdx] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qTopic, setQTopic] = useState('');

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    const ann: AdminAnnouncement = {
      id: `ann_${Date.now()}`,
      title: annTitle.trim(),
      category: annCategory,
      content: annContent.trim(),
      publishedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      caLevelTarget: 'All',
      verified: true,
    };

    onAddAnnouncement(ann);
    setAnnTitle('');
    setAnnContent('');
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subCode.trim()) return;

    const s: Subject = {
      id: `sub_${Date.now()}`,
      caLevel: subLevel,
      name: subName.trim(),
      code: subCode.trim().toUpperCase(),
      syllabusVersion: subVersion,
      description: subDesc.trim() || 'Comprehensive syllabus module under current ICAI scheme.',
      totalChapters: 8,
      completedChapters: 0,
      color: '#0284c7',
      iconName: 'BookOpen',
      weightageHint: '100 Marks',
    };

    onAddSubject(s);
    setSubName('');
    setSubCode('');
    setSubDesc('');
    setShowSubjectModal(false);
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim()) return;

    const q: PracticeQuestion = {
      id: `pq_admin_${Date.now()}`,
      subjectId: qSubjectId,
      chapterId: 'admin_added',
      type: 'mcq',
      difficulty: qDifficulty,
      questionText: qText.trim(),
      options: [qOptA, qOptB, qOptC, qOptD].filter(Boolean),
      correctOptionIndex: qCorrectIdx,
      explanation: qExplanation.trim() || 'Refer to relevant standard provisions.',
      relatedTopic: qTopic.trim() || 'General Syllabus',
      attemptCount: 0,
      correctCount: 0,
    };

    onAddQuestion(q);
    setQText('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQExplanation('');
    setQTopic('');
    setShowQuestionModal(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Admin Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-600 rounded-lg text-white">
              <Shield className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Admin CMS Control Panel
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">CA Master Course Management</h1>
          <p className="text-xs text-slate-400">
            Publish syllabus updates, broadcast official statutory amendments, and maintain question banks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onExitAdmin}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Exit to Student View
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-wrap gap-1">
        {[
          { id: 'overview', label: 'Platform Analytics', icon: TrendingUp },
          { id: 'subjects', label: `Subjects (${subjects.length})`, icon: BookOpen },
          { id: 'questions', label: `Question Bank (${questions.length})`, icon: CheckSquare },
          { id: 'announcements', label: `Amendments & Alerts (${announcements.length})`, icon: Megaphone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-xs font-medium text-slate-500">Active Students</span>
              <span className="text-2xl font-bold text-slate-900 block tabular-nums">2,840</span>
              <span className="text-[10px] text-emerald-700 font-semibold">+18% this month</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-xs font-medium text-slate-500">Total Subjects</span>
              <span className="text-2xl font-bold text-slate-900 block tabular-nums">
                {subjects.length}
              </span>
              <span className="text-[10px] text-slate-500">All 3 CA levels configured</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-xs font-medium text-slate-500">Verified Questions</span>
              <span className="text-2xl font-bold text-slate-900 block tabular-nums">
                {questions.length}
              </span>
              <span className="text-[10px] text-purple-700 font-semibold">ICAI Format MCQ / TF</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-xs font-medium text-slate-500">Published Alerts</span>
              <span className="text-2xl font-bold text-slate-900 block tabular-nums">
                {announcements.length}
              </span>
              <span className="text-[10px] text-amber-700 font-semibold">Finance Act updates</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Syllabus Compliance & Versioning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with the ICAI New Scheme of Education and Training, Intermediate Paper 1 covers Advanced Accounting, Paper 2 covers Corporate Laws, and Paper 3 covers Taxation (Direct & Indirect Tax). Admin changes propagate immediately to student devices without requiring full app reinstallation.
            </p>
          </div>
        </div>
      )}

      {/* SUBJECTS TAB */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Configured Subjects</h3>
            <button
              onClick={() => setShowSubjectModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {subjects.map((sub) => (
              <div key={sub.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{sub.code}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-slate-800">{sub.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      CA {sub.caLevel}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Scheme: {sub.syllabusVersion} · {sub.totalChapters} Chapters
                  </span>
                </div>

                <button
                  onClick={() => onDeleteSubject(sub.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete subject"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUESTIONS TAB */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Question Repository</h3>
            <button
              onClick={() => setShowQuestionModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">{q.relatedTopic}</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                      q.difficulty === 'Easy'
                        ? 'bg-emerald-100 text-emerald-800'
                        : q.difficulty === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>
                <p className="font-medium text-slate-900 leading-snug">{q.questionText}</p>
                <span className="text-[10px] text-slate-400 block">
                  Attempts: {q.attemptCount} · Correct: {q.correctCount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANNOUNCEMENTS TAB */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Post Form */}
          <form
            onSubmit={handleCreateAnnouncement}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs"
          >
            <h3 className="text-sm font-bold text-slate-900">Broadcast Official Notice</h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="e.g. Finance (No. 2) Act 2024 Amendments for May 2026"
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={annCategory}
                onChange={(e) => setAnnCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-slate-900"
              >
                <option value="Amendment">Statutory Amendment</option>
                <option value="Exam Alert">ICAI Exam Notification</option>
                <option value="Study Tip">Study Strategy</option>
                <option value="Feature">Platform Feature</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notice Content</label>
              <textarea
                rows={4}
                required
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder="Provide clear educational guidance and cite official gazette / notification numbers..."
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
            >
              Publish Announcement
            </button>
          </form>

          {/* List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Published Notices ({announcements.length})</h3>
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                      {ann.category}
                    </span>
                    <span className="text-slate-400">{ann.publishedDate}</span>
                  </div>
                  <h4 className="font-bold text-slate-900">{ann.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD SUBJECT MODAL */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubject}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add CA Subject</h3>
              <button
                type="button"
                onClick={() => setShowSubjectModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject Name</label>
              <input
                type="text"
                required
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="e.g. Advanced Financial Management"
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Code</label>
                <input
                  type="text"
                  required
                  value={subCode}
                  onChange={(e) => setSubCode(e.target.value)}
                  placeholder="e.g. AFM"
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">CA Level</label>
                <select
                  value={subLevel}
                  onChange={(e) => setSubLevel(e.target.value as CALevel)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  <option value="Foundation">CA Foundation</option>
                  <option value="Intermediate">CA Intermediate</option>
                  <option value="Final">CA Final</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Syllabus Scheme</label>
              <input
                type="text"
                value={subVersion}
                onChange={(e) => setSubVersion(e.target.value)}
                placeholder="New Scheme 2024-2026"
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubjectModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
              >
                Save Subject
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD QUESTION MODAL */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateQuestion}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-3.5 text-xs max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Practice Question</h3>
              <button
                type="button"
                onClick={() => setShowQuestionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <select
                value={qSubjectId}
                onChange={(e) => setQSubjectId(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Question Statement</label>
              <textarea
                rows={3}
                required
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Enter complete ICAI examination question text..."
                className="w-full p-2 rounded-lg border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Option A</label>
                <input
                  type="text"
                  required
                  value={qOptA}
                  onChange={(e) => setQOptA(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Option B</label>
                <input
                  type="text"
                  required
                  value={qOptB}
                  onChange={(e) => setQOptB(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Option C</label>
                <input
                  type="text"
                  required
                  value={qOptC}
                  onChange={(e) => setQOptC(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Option D</label>
                <input
                  type="text"
                  required
                  value={qOptD}
                  onChange={(e) => setQOptD(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Correct Option</label>
                <select
                  value={qCorrectIdx}
                  onChange={(e) => setQCorrectIdx(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={qDifficulty}
                  onChange={(e) => setQDifficulty(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Related Topic / Section</label>
              <input
                type="text"
                value={qTopic}
                onChange={(e) => setQTopic(e.target.value)}
                placeholder="e.g. AS 10 Capitalization"
                className="w-full p-2 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Detailed Solution Rationale</label>
              <textarea
                rows={2}
                value={qExplanation}
                onChange={(e) => setQExplanation(e.target.value)}
                placeholder="Explain the statutory rule or step-by-step arithmetic..."
                className="w-full p-2 rounded-lg border border-slate-200"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowQuestionModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
              >
                Publish Question
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
