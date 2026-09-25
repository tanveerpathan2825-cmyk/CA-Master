/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  Subject,
  Chapter,
  Lesson,
  PracticeQuestion,
  StudyTask,
  MockTest,
  RevisionItem,
  PracticalModule,
  AchievementBadge,
  AdminAnnouncement,
  TestAttemptResult,
  CALevel,
} from './types';
import { StorageService } from './services/storageService';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { StudyPlanner } from './components/planner/StudyPlanner';
import { LearnSection } from './components/learn/LearnSection';
import { PracticeSection } from './components/practice/PracticeSection';
import { MockTestSimulator } from './components/mock/MockTestSimulator';
import { RevisionHub } from './components/revision/RevisionHub';
import { PracticalSkills } from './components/practical/PracticalSkills';
import { ProgressAnalytics } from './components/progress/ProgressAnalytics';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AITutorView } from './components/ai/AITutorView';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { LegalDisclaimerBanner } from './components/common/LegalDisclaimerBanner';
import { X, Check } from 'lucide-react';

export default function App() {
  // Core Entities from Storage
  const [profile, setProfile] = useState<StudentProfile>(() => StorageService.getProfile());
  const [subjects, setSubjects] = useState<Subject[]>(() => StorageService.getSubjects());
  const [chapters, setChapters] = useState<Chapter[]>(() => StorageService.getChapters());
  const [lessons, setLessons] = useState<Lesson[]>(() => StorageService.getLessons());
  const [questions, setQuestions] = useState<PracticeQuestion[]>(() => StorageService.getQuestions());
  const [tasks, setTasks] = useState<StudyTask[]>(() => StorageService.getTasks());
  const [mockTests, setMockTests] = useState<MockTest[]>(() => StorageService.getMockTests());
  const [revisionItems, setRevisionItems] = useState<RevisionItem[]>(() => StorageService.getRevisionItems());
  const [practicalModules, setPracticalModules] = useState<PracticalModule[]>(() => StorageService.getPracticalModules());
  const [achievements, setAchievements] = useState<AchievementBadge[]>(() => StorageService.getAchievements());
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>(() => StorageService.getAnnouncements());
  const [testResults, setTestResults] = useState<TestAttemptResult[]>(() => StorageService.getTestResults());

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);
  const [tutorInitialQuery, setTutorInitialQuery] = useState('');
  const [practiceSubjectFilter, setPracticeSubjectFilter] = useState<string | undefined>();
  const [practiceChapterFilter, setPracticeChapterFilter] = useState<string | undefined>();

  // Feedback Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard shortcut: Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Tasks
  const handleTaskStatusChange = (
    taskId: string,
    status: 'pending' | 'in_progress' | 'completed' | 'missed'
  ) => {
    StorageService.updateTaskStatus(taskId, status);
    setTasks(StorageService.getTasks());
    setProfile(StorageService.getProfile());

    if (status === 'completed') {
      showToast('Task marked as completed! +25 XP');
    } else if (status === 'missed') {
      showToast('Task marked as missed. You can reschedule it to maintain balance.');
    }
  };

  const handleRescheduleMissedTask = (taskId: string) => {
    const result = StorageService.rescheduleMissedTask(taskId);
    if (result.success) {
      setTasks(StorageService.getTasks());
      showToast(result.message);
    }
  };

  const handleAddTask = (newTask: StudyTask) => {
    const updated = [...tasks, newTask];
    StorageService.saveTasks(updated);
    setTasks(updated);
    showToast('New study task added successfully.');
  };

  const handleRegeneratePlan = () => {
    // Regenerate daily slots
    const todayStr = new Date().toISOString().slice(0, 10);
    const currentLevelSubs = subjects.filter((s) => s.caLevel === profile.caLevel);

    const regenerated: StudyTask[] = [
      {
        id: `task_gen_1_${Date.now()}`,
        date: todayStr,
        timeSlot: 'Morning',
        startTime: '08:30',
        endTime: '10:00',
        subjectId: profile.strongSubjects[0] || currentLevelSubs[0]?.id || 'sub_acc',
        chapterId: 'chap_1',
        title: `${currentLevelSubs[0]?.name || 'Accounting'}: Advanced Computation & Practical Drills`,
        durationMinutes: 90,
        status: 'pending',
        notes: 'Priority focus on illustration problems and working notes.',
      },
      {
        id: `task_gen_2_${Date.now()}`,
        date: todayStr,
        timeSlot: 'Afternoon',
        startTime: '11:30',
        endTime: '12:30',
        subjectId: currentLevelSubs[1]?.id || 'sub_law',
        chapterId: 'chap_2',
        title: `${currentLevelSubs[1]?.name || 'Corporate Law'}: Legal Section Analysis`,
        durationMinutes: 60,
        status: 'pending',
        notes: 'Review statutory wording and case studies.',
      },
      {
        id: `task_gen_3_${Date.now()}`,
        date: todayStr,
        timeSlot: 'Evening',
        startTime: '17:00',
        endTime: '18:30',
        subjectId: profile.weakSubjects[0] || currentLevelSubs[2]?.id || 'sub_tax',
        chapterId: 'chap_3',
        title: `${currentLevelSubs[2]?.name || 'Taxation'} (Weak Area Focus): Statutory Computations`,
        durationMinutes: 90,
        status: 'pending',
        notes: 'Solve 3 practice questions with step-by-step working notes.',
      },
      {
        id: `task_gen_4_${Date.now()}`,
        date: todayStr,
        timeSlot: 'Night',
        startTime: '20:30',
        endTime: '21:30',
        subjectId: currentLevelSubs[3]?.id || 'sub_cost',
        chapterId: 'chap_4',
        title: 'Daily Practice: 25 MCQs & Spaced Revision Checkpoints',
        durationMinutes: 60,
        status: 'pending',
        notes: 'Active recall and rapid flashcard quiz.',
      },
    ];

    StorageService.saveTasks(regenerated);
    setTasks(regenerated);
    showToast('Plan regenerated! Weak areas and available study hours balanced.');
  };

  // Handlers for Questions
  const handleRecordQuestionAttempt = (questionId: string, isCorrect: boolean) => {
    StorageService.recordQuestionAttempt(questionId, isCorrect);
    setQuestions(StorageService.getQuestions());
  };

  // Handlers for Revision
  const handleMarkRevisionComplete = (itemId: string, rememberedWell: boolean) => {
    StorageService.markRevisionComplete(itemId, rememberedWell);
    setRevisionItems(StorageService.getRevisionItems());
    if (rememberedWell) {
      showToast('Interval extended! Next review scheduled.');
    } else {
      showToast('Added to weak list for high-priority review tomorrow.');
    }
  };

  // Handlers for Practical Modules
  const handleTogglePracticalModule = (moduleId: string) => {
    StorageService.togglePracticalModuleComplete(moduleId);
    setPracticalModules(StorageService.getPracticalModules());
  };

  // Handlers for Mock Tests
  const handleSaveTestResult = (result: TestAttemptResult) => {
    StorageService.saveTestResult(result);
    setTestResults(StorageService.getTestResults());
    setProfile(StorageService.getProfile());
    showToast(`Test completed! Score: ${result.score}/${result.totalMarks} (+100 XP)`);
  };

  // Level & Profile
  const handleLevelChange = (newLevel: CALevel) => {
    const updated = StorageService.updateProfile({ caLevel: newLevel });
    setProfile(updated);
    showToast(`Switched syllabus to CA ${newLevel}.`);
  };

  const handleUpdateProfile = (partial: Partial<StudentProfile>) => {
    const updated = StorageService.updateProfile(partial);
    setProfile(updated);
  };

  // Reset & Backup
  const handleResetData = () => {
    StorageService.resetAllData();
    setProfile(StorageService.getProfile());
    setSubjects(StorageService.getSubjects());
    setChapters(StorageService.getChapters());
    setLessons(StorageService.getLessons());
    setQuestions(StorageService.getQuestions());
    setTasks(StorageService.getTasks());
    setMockTests(StorageService.getMockTests());
    setRevisionItems(StorageService.getRevisionItems());
    setPracticalModules(StorageService.getPracticalModules());
    setTestResults([]);
    showToast('All progress reset to clean demo data.');
  };

  const handleExportBackup = () => {
    const jsonStr = StorageService.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ca_master_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Study log downloaded.');
  };

  const handleImportBackup = (jsonStr: string) => {
    const ok = StorageService.importBackupJSON(jsonStr);
    if (ok) {
      setProfile(StorageService.getProfile());
      setSubjects(StorageService.getSubjects());
      setChapters(StorageService.getChapters());
      setLessons(StorageService.getLessons());
      setQuestions(StorageService.getQuestions());
      setTasks(StorageService.getTasks());
      setRevisionItems(StorageService.getRevisionItems());
      showToast('Backup restored successfully!');
    } else {
      showToast('Failed to parse backup JSON. Please check file format.');
    }
  };

  // Admin CMS Handlers
  const handleAddSubject = (newSubject: Subject) => {
    const updated = [...subjects, newSubject];
    StorageService.saveSubjects(updated);
    setSubjects(updated);
    showToast(`Subject "${newSubject.name}" created.`);
  };

  const handleDeleteSubject = (subjectId: string) => {
    const updated = subjects.filter((s) => s.id !== subjectId);
    StorageService.saveSubjects(updated);
    setSubjects(updated);
    showToast('Subject deleted.');
  };

  const handleAddAnnouncement = (ann: AdminAnnouncement) => {
    const updated = [ann, ...announcements];
    StorageService.saveAnnouncements(updated);
    setAnnouncements(updated);
    showToast('Announcement broadcasted to all students.');
  };

  const handleAddQuestion = (q: PracticeQuestion) => {
    const updated = [...questions, q];
    StorageService.saveQuestions(updated);
    setQuestions(updated);
    showToast('Question published to student question bank.');
  };

  const toggleAdmin = () => {
    const newRole = profile.role === 'admin' ? 'student' : 'admin';
    const updated = StorageService.updateProfile({ role: newRole });
    setProfile(updated);
    if (newRole === 'admin') {
      setActiveTab('admin');
      showToast('Switched to Admin CMS mode.');
    } else {
      setActiveTab('home');
      showToast('Returned to Student View.');
    }
  };

  // Navigation helpers
  const handleOpenTutorWithQuery = (queryText: string) => {
    setTutorInitialQuery(queryText);
    setIsTutorModalOpen(true);
  };

  const handleNavigateToPractice = (subjectId: string, chapterId: string) => {
    setPracticeSubjectFilter(subjectId);
    setPracticeChapterFilter(chapterId);
    setActiveTab('practice');
  };

  const handleSelectSearchResult = (type: string, id: string) => {
    if (type === 'subject' || type === 'chapter' || type === 'lesson') {
      setActiveTab('learn');
    } else if (type === 'question') {
      setActiveTab('practice');
    } else if (type === 'practical') {
      setActiveTab('practical');
    } else if (type === 'revision') {
      setActiveTab('revision');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Top Banner Disclaimer */}
      <LegalDisclaimerBanner compact />

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTutor={() => {
          setTutorInitialQuery('');
          setIsTutorModalOpen(true);
        }}
        onLevelChange={handleLevelChange}
        onToggleAdmin={toggleAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-20 lg:pb-12">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Home Dashboard */}
        {activeTab === 'home' && (
          <HomeDashboard
            profile={profile}
            tasks={tasks}
            subjects={subjects}
            onTaskStatusChange={handleTaskStatusChange}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenTutor={() => {
              setTutorInitialQuery('');
              setIsTutorModalOpen(true);
            }}
            onRescheduleMissedTask={handleRescheduleMissedTask}
          />
        )}

        {/* 2. Study Plan */}
        {activeTab === 'planner' && (
          <StudyPlanner
            profile={profile}
            tasks={tasks}
            subjects={subjects}
            chapters={chapters}
            onTaskStatusChange={handleTaskStatusChange}
            onAddTask={handleAddTask}
            onRescheduleMissedTask={handleRescheduleMissedTask}
            onRegeneratePlan={handleRegeneratePlan}
          />
        )}

        {/* 3. Learn */}
        {activeTab === 'learn' && (
          <LearnSection
            caLevel={profile.caLevel}
            subjects={subjects}
            chapters={chapters}
            lessons={lessons}
            onOpenTutorForLesson={(lessonTitle, subjectName) =>
              handleOpenTutorWithQuery(`Explain the core ICAI concept of ${lessonTitle} in ${subjectName}`)
            }
            onNavigateToPractice={handleNavigateToPractice}
          />
        )}

        {/* 4. Practice */}
        {activeTab === 'practice' && (
          <PracticeSection
            questions={questions}
            subjects={subjects}
            chapters={chapters}
            initialSubjectId={practiceSubjectFilter}
            initialChapterId={practiceChapterFilter}
            onRecordAttempt={handleRecordQuestionAttempt}
            onOpenTutorForQuestion={(qText, expl) =>
              handleOpenTutorWithQuery(`Why is this CA question answer correct? ${qText}\n\nExplanation: ${expl}`)
            }
          />
        )}

        {/* 5. Mock Tests */}
        {activeTab === 'mock' && (
          <MockTestSimulator
            mockTests={mockTests}
            subjects={subjects}
            onSaveResult={handleSaveTestResult}
            onNavigateToRevision={() => setActiveTab('revision')}
          />
        )}

        {/* 6. Revision Hub */}
        {activeTab === 'revision' && (
          <RevisionHub
            revisionItems={revisionItems}
            subjects={subjects}
            onMarkRevisionComplete={handleMarkRevisionComplete}
            onOpenTutor={(topic) =>
              handleOpenTutorWithQuery(`Provide a rapid high-yield revision summary for ${topic}`)
            }
          />
        )}

        {/* 7. Practical Skills */}
        {activeTab === 'practical' && (
          <PracticalSkills
            modules={practicalModules}
            onToggleComplete={handleTogglePracticalModule}
            onOpenTutor={(query) => handleOpenTutorWithQuery(query)}
          />
        )}

        {/* 8. Progress & Health */}
        {activeTab === 'progress' && (
          <ProgressAnalytics
            profile={profile}
            subjects={subjects}
            chapters={chapters}
            achievements={achievements}
            testResults={testResults}
          />
        )}

        {/* 9. Profile & Settings */}
        {activeTab === 'profile' && (
          <ProfileSettings
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onResetData={handleResetData}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onToggleAdmin={toggleAdmin}
          />
        )}

        {/* 10. Admin CMS */}
        {activeTab === 'admin' && (
          <AdminDashboard
            subjects={subjects}
            chapters={chapters}
            questions={questions}
            announcements={announcements}
            onAddSubject={handleAddSubject}
            onDeleteSubject={handleDeleteSubject}
            onAddAnnouncement={handleAddAnnouncement}
            onAddQuestion={handleAddQuestion}
            onExitAdmin={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Mobile Touch-First Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Dedicated AI Tutor Modal */}
      {isTutorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-4 sm:p-6 border border-slate-200 relative my-auto">
            <button
              onClick={() => setIsTutorModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <AITutorView
              profile={profile}
              initialQuery={tutorInitialQuery}
              onClose={() => setIsTutorModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        subjects={subjects}
        chapters={chapters}
        lessons={lessons}
        questions={questions}
        practicalModules={practicalModules}
        revisionItems={revisionItems}
        onSelectResult={handleSelectSearchResult}
      />

      {/* Onboarding Flow (for new students) */}
      <OnboardingModal
        isOpen={!profile.onboardingCompleted}
        subjects={subjects}
        onComplete={(newProfile, initialTasks) => {
          StorageService.saveProfile(newProfile);
          StorageService.saveTasks(initialTasks);
          setProfile(newProfile);
          setTasks(initialTasks);
          showToast(`Welcome ${newProfile.name}! Your personalized study plan is active.`);
        }}
      />
    </div>
  );
}
