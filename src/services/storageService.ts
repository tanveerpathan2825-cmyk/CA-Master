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
} from '../types';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_SUBJECTS,
  INITIAL_CHAPTERS,
  INITIAL_LESSONS,
  INITIAL_PRACTICE_QUESTIONS,
  INITIAL_STUDY_TASKS,
  INITIAL_MOCK_TESTS,
  INITIAL_REVISION_ITEMS,
  INITIAL_PRACTICAL_MODULES,
  INITIAL_ACHIEVEMENTS,
  INITIAL_ANNOUNCEMENTS,
} from '../data/initialData';

const STORAGE_KEYS = {
  PROFILE: 'camaster_profile',
  SUBJECTS: 'camaster_subjects',
  CHAPTERS: 'camaster_chapters',
  LESSONS: 'camaster_lessons',
  QUESTIONS: 'camaster_questions',
  TASKS: 'camaster_tasks',
  TESTS: 'camaster_tests',
  TEST_RESULTS: 'camaster_test_results',
  REVISION: 'camaster_revision',
  PRACTICAL: 'camaster_practical',
  ACHIEVEMENTS: 'camaster_achievements',
  ANNOUNCEMENTS: 'camaster_announcements',
  DAILY_STATS: 'camaster_daily_stats',
};

// Safe JSON parser
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed reading storage key "${key}":`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed writing storage key "${key}":`, err);
  }
}

export const StorageService = {
  // PROFILE
  getProfile(): StudentProfile {
    return safeGet<StudentProfile>(STORAGE_KEYS.PROFILE, INITIAL_STUDENT_PROFILE);
  },
  saveProfile(profile: StudentProfile): void {
    safeSet(STORAGE_KEYS.PROFILE, profile);
  },
  updateProfile(partial: Partial<StudentProfile>): StudentProfile {
    const current = this.getProfile();
    const updated = { ...current, ...partial };
    this.saveProfile(updated);
    return updated;
  },

  // SUBJECTS
  getSubjects(): Subject[] {
    return safeGet<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
  },
  saveSubjects(subjects: Subject[]): void {
    safeSet(STORAGE_KEYS.SUBJECTS, subjects);
  },

  // CHAPTERS
  getChapters(): Chapter[] {
    return safeGet<Chapter[]>(STORAGE_KEYS.CHAPTERS, INITIAL_CHAPTERS);
  },
  saveChapters(chapters: Chapter[]): void {
    safeSet(STORAGE_KEYS.CHAPTERS, chapters);
  },

  // LESSONS
  getLessons(): Lesson[] {
    return safeGet<Lesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
  },
  saveLessons(lessons: Lesson[]): void {
    safeSet(STORAGE_KEYS.LESSONS, lessons);
  },

  // PRACTICE QUESTIONS
  getQuestions(): PracticeQuestion[] {
    return safeGet<PracticeQuestion[]>(STORAGE_KEYS.QUESTIONS, INITIAL_PRACTICE_QUESTIONS);
  },
  saveQuestions(questions: PracticeQuestion[]): void {
    safeSet(STORAGE_KEYS.QUESTIONS, questions);
  },
  recordQuestionAttempt(questionId: string, isCorrect: boolean): void {
    const questions = this.getQuestions();
    const idx = questions.findIndex((q) => q.id === questionId);
    if (idx !== -1) {
      questions[idx].attemptCount += 1;
      if (isCorrect) questions[idx].correctCount += 1;
      questions[idx].userLastResult = isCorrect ? 'correct' : 'incorrect';
      this.saveQuestions(questions);
    }
  },

  // STUDY TASKS & INTELLIGENT PLANNER
  getTasks(): StudyTask[] {
    return safeGet<StudyTask[]>(STORAGE_KEYS.TASKS, INITIAL_STUDY_TASKS);
  },
  saveTasks(tasks: StudyTask[]): void {
    safeSet(STORAGE_KEYS.TASKS, tasks);
  },
  updateTaskStatus(taskId: string, status: 'pending' | 'in_progress' | 'completed' | 'missed'): void {
    const tasks = this.getTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      this.saveTasks(tasks);

      // Add XP on completion
      if (status === 'completed') {
        const profile = this.getProfile();
        profile.xp += 25;
        this.saveProfile(profile);
      }
    }
  },
  // Missed task intelligent reallocation: moves to tomorrow or next available open slot
  rescheduleMissedTask(taskId: string): { success: boolean; newTask?: StudyTask; message: string } {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return { success: false, message: 'Task not found' };

    const task = tasks[taskIndex];
    task.status = 'missed';
    task.rescheduledCount = (task.rescheduledCount || 0) + 1;

    // Plan date for tomorrow or weekend buffer block
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    const newTask: StudyTask = {
      ...task,
      id: `task_${Date.now()}`,
      date: tomorrowStr,
      status: 'pending',
      originalDate: task.date,
      notes: `Rescheduled from ${task.date}. High priority recovery slot.`,
    };

    tasks.push(newTask);
    this.saveTasks(tasks);
    return {
      success: true,
      newTask,
      message: `Task rescheduled to tomorrow (${tomorrowStr}). Your daily workload remains balanced.`,
    };
  },

  // MOCK TESTS & RESULTS
  getMockTests(): MockTest[] {
    return safeGet<MockTest[]>(STORAGE_KEYS.TESTS, INITIAL_MOCK_TESTS);
  },
  saveMockTests(tests: MockTest[]): void {
    safeSet(STORAGE_KEYS.TESTS, tests);
  },
  getTestResults(): TestAttemptResult[] {
    return safeGet<TestAttemptResult[]>(STORAGE_KEYS.TEST_RESULTS, []);
  },
  saveTestResult(result: TestAttemptResult): void {
    const results = this.getTestResults();
    results.unshift(result);
    safeSet(STORAGE_KEYS.TEST_RESULTS, results);

    // Reward XP
    const profile = this.getProfile();
    profile.xp += 100;
    this.saveProfile(profile);
  },

  // REVISION (SPACED REPETITION)
  getRevisionItems(): RevisionItem[] {
    return safeGet<RevisionItem[]>(STORAGE_KEYS.REVISION, INITIAL_REVISION_ITEMS);
  },
  saveRevisionItems(items: RevisionItem[]): void {
    safeSet(STORAGE_KEYS.REVISION, items);
  },
  markRevisionComplete(itemId: string, rememberedWell: boolean): void {
    const items = this.getRevisionItems();
    const item = items.find((i) => i.id === itemId);
    if (item) {
      item.lastReviewedDate = new Date().toISOString().slice(0, 10);
      const nextDue = new Date();

      if (rememberedWell) {
        // Advance stage: 1->3 days, 2->7 days, 3->14 days, 4->30 days
        const intervals = [1, 3, 7, 14, 30];
        const nextStage = Math.min(5, (item.repetitionStage || 1) + 1) as 1 | 2 | 3 | 4 | 5;
        item.repetitionStage = nextStage;
        nextDue.setDate(nextDue.getDate() + (intervals[nextStage - 1] || 7));
        item.needsMorePractice = false;
      } else {
        // Reset to 1-day interval
        item.repetitionStage = 1;
        item.mistakesCount += 1;
        item.needsMorePractice = true;
        nextDue.setDate(nextDue.getDate() + 1);
      }
      item.nextDueDate = nextDue.toISOString().slice(0, 10);
      this.saveRevisionItems(items);
    }
  },

  // PRACTICAL MODULES
  getPracticalModules(): PracticalModule[] {
    return safeGet<PracticalModule[]>(STORAGE_KEYS.PRACTICAL, INITIAL_PRACTICAL_MODULES);
  },
  savePracticalModules(modules: PracticalModule[]): void {
    safeSet(STORAGE_KEYS.PRACTICAL, modules);
  },
  togglePracticalModuleComplete(moduleId: string): void {
    const modules = this.getPracticalModules();
    const m = modules.find((mod) => mod.id === moduleId);
    if (m) {
      m.isCompleted = !m.isCompleted;
      this.savePracticalModules(modules);
    }
  },

  // ACHIEVEMENTS
  getAchievements(): AchievementBadge[] {
    return safeGet<AchievementBadge[]>(STORAGE_KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS);
  },

  // ANNOUNCEMENTS
  getAnnouncements(): AdminAnnouncement[] {
    return safeGet<AdminAnnouncement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },
  saveAnnouncements(list: AdminAnnouncement[]): void {
    safeSet(STORAGE_KEYS.ANNOUNCEMENTS, list);
  },

  // RESET TO DEFAULT DEMO DATA
  resetAllData(): void {
    safeSet(STORAGE_KEYS.PROFILE, INITIAL_STUDENT_PROFILE);
    safeSet(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    safeSet(STORAGE_KEYS.CHAPTERS, INITIAL_CHAPTERS);
    safeSet(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
    safeSet(STORAGE_KEYS.QUESTIONS, INITIAL_PRACTICE_QUESTIONS);
    safeSet(STORAGE_KEYS.TASKS, INITIAL_STUDY_TASKS);
    safeSet(STORAGE_KEYS.TESTS, INITIAL_MOCK_TESTS);
    safeSet(STORAGE_KEYS.TEST_RESULTS, []);
    safeSet(STORAGE_KEYS.REVISION, INITIAL_REVISION_ITEMS);
    safeSet(STORAGE_KEYS.PRACTICAL, INITIAL_PRACTICAL_MODULES);
    safeSet(STORAGE_KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS);
    safeSet(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },

  // BACKUP EXPORT / IMPORT
  exportBackupJSON(): string {
    const bundle = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      subjects: this.getSubjects(),
      chapters: this.getChapters(),
      lessons: this.getLessons(),
      questions: this.getQuestions(),
      tasks: this.getTasks(),
      testResults: this.getTestResults(),
      revision: this.getRevisionItems(),
    };
    return JSON.stringify(bundle, null, 2);
  },
  importBackupJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) safeSet(STORAGE_KEYS.PROFILE, data.profile);
      if (data.subjects) safeSet(STORAGE_KEYS.SUBJECTS, data.subjects);
      if (data.chapters) safeSet(STORAGE_KEYS.CHAPTERS, data.chapters);
      if (data.lessons) safeSet(STORAGE_KEYS.LESSONS, data.lessons);
      if (data.questions) safeSet(STORAGE_KEYS.QUESTIONS, data.questions);
      if (data.tasks) safeSet(STORAGE_KEYS.TASKS, data.tasks);
      if (data.testResults) safeSet(STORAGE_KEYS.TEST_RESULTS, data.testResults);
      if (data.revision) safeSet(STORAGE_KEYS.REVISION, data.revision);
      return true;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
    }
  },
};
