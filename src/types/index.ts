export type CALevel = 'Foundation' | 'Intermediate' | 'Final';

export interface StudentProfile {
  id: string;
  name: string;
  email?: string;
  role: 'student' | 'admin';
  caLevel: CALevel;
  attempt: string; // e.g. "May 2026" or "Nov 2026"
  examDate: string; // ISO date string YYYY-MM-DD
  dailyHours: number; // e.g. 5
  preferredStudyTime: 'morning' | 'afternoon' | 'evening' | 'night' | 'split';
  currentPreparationLevel: number; // 0 - 100%
  strongSubjects: string[];
  weakSubjects: string[];
  selectedSubjects: string[];
  studyGoal: string;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  onboardingCompleted: boolean;
  dailyAIQuestionsUsed: number;
  aiQuestionsLimit: number;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface Subject {
  id: string;
  caLevel: CALevel;
  group?: 1 | 2; // For Intermediate & Final
  name: string;
  code: string; // e.g. "ACC", "LAW", "TAX"
  syllabusVersion: string; // e.g. "New Scheme 2024-2026"
  description: string;
  totalChapters: number;
  completedChapters: number;
  color: string;
  iconName: string;
  weightageHint: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  chapterNumber: number;
  estimatedHours: number;
  importance: 'High' | 'Medium' | 'Low';
  isCompleted: boolean;
  completionPercentage: number;
  topicsCount: number;
  lastStudied?: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  order: number;
  estimatedMinutes: number;
  simpleExplanation: string;
  keyConcepts: string[];
  examples: {
    title: string;
    scenario: string;
    solution: string;
    workingNotes?: string;
  }[];
  importantPoints: string[];
  commonMistakes: string[];
  quickQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  revisionSummary: string[];
  isCompleted?: boolean;
}

export type QuestionType = 'mcq' | 'numerical' | 'case_based' | 'true_false' | 'short_answer';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface PracticeQuestion {
  id: string;
  subjectId: string;
  chapterId: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  questionText: string;
  options?: string[];
  correctOptionIndex?: number; // for MCQ/TF
  modelAnswer?: string; // for numerical or short answer
  workingNotes?: string;
  explanation: string;
  relatedTopic: string;
  attemptCount: number;
  correctCount: number;
  userLastResult?: 'correct' | 'incorrect' | 'skipped';
  isBookmarked?: boolean;
  needsMorePractice?: boolean;
}

export interface StudyTask {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  subjectId: string;
  chapterId: string;
  title: string;
  durationMinutes: number;
  status: 'pending' | 'in_progress' | 'completed' | 'missed';
  notes?: string;
  rescheduledCount?: number;
  originalDate?: string;
}

export interface MockTest {
  id: string;
  title: string;
  caLevel: CALevel;
  subjectId?: string; // empty if full syllabus
  type: 'full_mock' | 'subject_mock' | 'chapter_test';
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  questions: {
    id: string;
    questionText: string;
    options: string[];
    correctIndex: number;
    marks: number;
    negativeMarks: number;
    explanation: string;
    subjectId: string;
    chapterName: string;
  }[];
}

export interface TestAttemptResult {
  id: string;
  testId: string;
  testTitle: string;
  date: string;
  timeTakenSeconds: number;
  score: number;
  totalMarks: number;
  accuracy: number;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  unansweredCount: number;
  weakTopics: string[];
  recommendedRevision: string[];
  userAnswers: Record<string, number>; // questionId -> optionIndex
}

export interface RevisionItem {
  id: string;
  subjectId: string;
  chapterId: string;
  topicTitle: string;
  summaryPoints: string[];
  keyFormulaOrSection?: string;
  lastReviewedDate: string;
  nextDueDate: string;
  repetitionStage: 1 | 2 | 3 | 4 | 5; // Day 1, 3, 7, 14, Final
  needsMorePractice: boolean;
  mistakesCount: number;
  notes?: string;
}

export interface PracticalModule {
  id: string;
  title: string;
  category: 'Accounting' | 'Taxation' | 'Auditing' | 'Software_Skills' | 'Analysis';
  description: string;
  readTimeMinutes: number;
  coreConcepts: string[];
  practicalCase: {
    problemTitle: string;
    problemDetails: string;
    sampleData: Record<string, any>;
    interactiveTaskType: 'journal' | 'brs' | 'ledger' | 'gst_calc' | 'tax_slab';
  };
  keyTakeaways: string[];
  isCompleted: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number; // 0 - 100
  category: 'consistency' | 'practice' | 'revision' | 'mastery';
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  category: 'Exam Alert' | 'Amendment' | 'Study Tip' | 'Feature';
  content: string;
  publishedDate: string;
  caLevelTarget: 'All' | CALevel;
  sourceUrl?: string;
  verified: boolean;
}
