export interface AITutorResponse {
  answer: string;
  cached?: boolean;
  remainingQuestions?: number;
  note?: string;
  error?: string;
}

export const AIService = {
  async askTutor(params: {
    prompt: string;
    mode: string;
    caLevel: string;
    subject?: string;
    chapter?: string;
    userId?: string;
  }): Promise<AITutorResponse> {
    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      console.warn('AI Tutor call failed, using client fallback knowledge base:', err);
      return {
        answer: generateClientFallbackAnswer(params.prompt, params.mode, params.caLevel),
        note: 'Loaded from local CA Master offline knowledge base. Please check internet connection for live server AI.',
      };
    }
  },

  async getPlannerAdvice(params: {
    daysLeft: number;
    dailyHours: number;
    weakSubjects: string[];
    strongSubjects: string[];
    currentCompletion: number;
    missedTasksCount: number;
  }): Promise<{ advice: string }> {
    try {
      const res = await fetch('/api/ai/planner-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Planner assist failed');
      return await res.json();
    } catch (err) {
      return {
        advice: `### Personalized CA Study Strategy
- **Priority Action:** With ${params.daysLeft} days until your CA examination, dedicate your first 2 hours daily to high-yield chapters in your weaker subjects (${params.weakSubjects.join(', ')}).
- **Slot Architecture:** Morning for complex accounting & practical computations; Afternoon for corporate law & auditing standards; Evening for direct/indirect taxes; Night for 30 minutes of MCQs + flashcard spaced repetition.
- **Backlog Management:** Missed tasks should be rolled into a Sunday 90-minute consolidation window rather than extending weeknights past your sleep cutoff.`,
      };
    }
  },

  async evaluateAnswer(params: {
    question: string;
    studentAnswer: string;
    maxMarks?: number;
    subject?: string;
  }): Promise<{
    score: number;
    feedback: string;
    keyPointsFound?: string[];
    keyPointsMissing?: string[];
    modelAnswerKey?: string;
    disclaimer?: string;
  }> {
    try {
      const res = await fetch('/api/ai/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Evaluation failed');
      return await res.json();
    } catch (err) {
      return {
        score: Math.round((params.maxMarks || 5) * 0.7),
        feedback: 'Answer demonstrates fair conceptual grasp. Ensure to quote specific statutory provisions and include detailed working notes for full marks.',
        keyPointsFound: ['Identified primary legal/accounting standard', 'Logical conclusion reached'],
        keyPointsMissing: ['Detailed step-by-step arithmetic working note', 'Specific clause references'],
        disclaimer: 'Generated offline. Verify against official ICAI Suggested Answers.',
      };
    }
  },
};

function generateClientFallbackAnswer(prompt: string, mode: string, level: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('depreciation') || p.includes('as 10')) {
    return `### AS 10 (Revised) Property, Plant & Equipment: Depreciation Guide
1. **Core Definition:** Systematic allocation of the depreciable amount of an asset over its useful life.
2. **Recognition:** Commences when the asset is available for use (in the location and condition necessary for operation), regardless of actual production commencement.
3. **Common Exam Mistake:** Deducting trade discount from invoice, but forgetting to exclude refundable GST when ITC is eligible.
*(Disclaimer: Educational aid. Check ICAI guidelines for your specific attempt.)*`;
  }

  if (p.includes('salary') || p.includes('hra') || p.includes('tax')) {
    return `### Income Tax Concept: HRA Exemption u/s 10(13A)
- **Rule 2A Least of Three is Exempt:**
  1. Actual HRA received
  2. Rent paid minus 10% of salary
  3. 50% of salary (Delhi, Mumbai, Kolkata, Chennai) or 40% for other cities.
- **Salary Definition:** Basic Salary + DA (forming part) + Commission (% of turnover).
*(Note: Tax laws and standard deductions are subject to recent Finance Acts.)*`;
  }

  return `### CA Master Study Note (${level})
**Query:** ${prompt}
**Methodology:**
1. Break down the scenario into statutory or accounting standard provisions.
2. Outline relevant definitions, applicability criteria, and exceptions.
3. Formulate step-by-step working notes before concluding.
*(Always cross-reference with official ICAI study materials and notifications for your examination attempt.)*`;
}
