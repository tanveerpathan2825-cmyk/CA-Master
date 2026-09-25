import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, CheckSquare, RotateCcw, Briefcase, ChevronRight } from 'lucide-react';
import { Subject, Chapter, Lesson, PracticeQuestion, PracticalModule, RevisionItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  chapters: Chapter[];
  lessons: Lesson[];
  questions: PracticeQuestion[];
  practicalModules: PracticalModule[];
  revisionItems: RevisionItem[];
  onSelectResult: (type: string, id: string) => void;
}

export const GlobalSearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  subjects,
  chapters,
  lessons,
  questions,
  practicalModules,
  revisionItems,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();

    const matches: {
      type: 'subject' | 'chapter' | 'lesson' | 'question' | 'practical' | 'revision';
      id: string;
      title: string;
      subtitle: string;
    }[] = [];

    // Subjects
    subjects.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)) {
        matches.push({
          type: 'subject',
          id: s.id,
          title: `${s.code} · ${s.name}`,
          subtitle: `CA ${s.caLevel} Subject`,
        });
      }
    });

    // Chapters
    chapters.forEach((c) => {
      if (c.title.toLowerCase().includes(q)) {
        matches.push({
          type: 'chapter',
          id: c.id,
          title: c.title,
          subtitle: `Chapter ${c.chapterNumber} · ${c.importance} Priority`,
        });
      }
    });

    // Lessons
    lessons.forEach((l) => {
      if (
        l.title.toLowerCase().includes(q) ||
        l.simpleExplanation.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'lesson',
          id: l.id,
          title: l.title,
          subtitle: 'Concept Lesson',
        });
      }
    });

    // Questions
    questions.forEach((qu) => {
      if (
        qu.questionText.toLowerCase().includes(q) ||
        qu.relatedTopic.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'question',
          id: qu.id,
          title: qu.questionText.slice(0, 80) + '...',
          subtitle: `${qu.difficulty} ${qu.type.toUpperCase()} · ${qu.relatedTopic}`,
        });
      }
    });

    // Practical
    practicalModules.forEach((p) => {
      if (p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
        matches.push({
          type: 'practical',
          id: p.id,
          title: p.title,
          subtitle: `Practical Skill · ${p.category}`,
        });
      }
    });

    // Revision
    revisionItems.forEach((r) => {
      if (
        r.topicTitle.toLowerCase().includes(q) ||
        (r.keyFormulaOrSection && r.keyFormulaOrSection.toLowerCase().includes(q))
      ) {
        matches.push({
          type: 'revision',
          id: r.id,
          title: r.topicTitle,
          subtitle: r.keyFormulaOrSection || 'Flashcard / Spaced Repetition',
        });
      }
    });

    return matches.slice(0, 15);
  }, [query, subjects, chapters, lessons, questions, practicalModules, revisionItems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
        {/* Input header */}
        <div className="relative border-b border-slate-100 flex items-center px-4">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects, chapters, questions, AS/Ind AS standards, tax rules..."
            className="w-full text-sm py-4 px-3 focus:outline-none text-slate-900 placeholder:text-slate-400"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim().length >= 2 && results.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500">
              No matching topics or questions found for "{query}".
            </div>
          )}

          {query.trim().length < 2 && (
            <div className="p-4 text-xs text-slate-500 space-y-2">
              <span className="font-semibold text-slate-700 block">Suggested Searches:</span>
              <div className="flex flex-wrap gap-1.5">
                {['AS 10 Depreciation', 'HRA Exemption Sec 10(13A)', 'AGM Notice Sec 101', 'Break Even Sales', 'GST Input Tax Credit', 'Consolidated Accounts'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-xs transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.map((item) => {
            const getIcon = () => {
              switch (item.type) {
                case 'subject':
                case 'chapter':
                case 'lesson':
                  return <BookOpen className="w-4 h-4 text-sky-600" />;
                case 'question':
                  return <CheckSquare className="w-4 h-4 text-emerald-600" />;
                case 'practical':
                  return <Briefcase className="w-4 h-4 text-purple-600" />;
                case 'revision':
                  return <RotateCcw className="w-4 h-4 text-amber-600" />;
                default:
                  return <Search className="w-4 h-4 text-slate-400" />;
              }
            };

            return (
              <button
                key={`${item.type}_${item.id}`}
                onClick={() => {
                  onSelectResult(item.type, item.id);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors border-b border-slate-50 last:border-0"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2 bg-slate-100 rounded-lg shrink-0">
                    {getIcon()}
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-semibold text-slate-900 block truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-500">
          <span>{results.length} result(s)</span>
          <button
            onClick={onClose}
            className="hover:text-slate-800 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
