import React from 'react';
import { Search, Flame, Shield, GraduationCap, Sparkles } from 'lucide-react';
import { CALevel, StudentProfile } from '../../types';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: StudentProfile;
  onOpenSearch: () => void;
  onOpenTutor: () => void;
  onLevelChange: (level: CALevel) => void;
  onToggleAdmin: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenSearch,
  onOpenTutor,
  onLevelChange,
  onToggleAdmin,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight group-hover:bg-slate-800 transition-colors">
              CA
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              CA Master
            </span>
          </button>

          {/* Level Switcher Dropdown */}
          <div className="relative">
            <select
              value={profile.caLevel}
              onChange={(e) => onLevelChange(e.target.value as CALevel)}
              aria-label="Select CA Exam Level"
              className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-2.5 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-slate-900 transition-colors"
            >
              <option value="Foundation">CA Foundation</option>
              <option value="Intermediate">CA Intermediate</option>
              <option value="Final">CA Final</option>
            </select>
          </div>
        </div>

        {/* Zone 2: Primary navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors hover:text-slate-900 py-1 ${
              activeTab === 'home' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`transition-colors hover:text-slate-900 py-1 ${
              activeTab === 'planner' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
            }`}
          >
            Study Plan
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`transition-colors hover:text-slate-900 py-1 ${
              activeTab === 'learn' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
            }`}
          >
            Learn
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`transition-colors hover:text-slate-900 py-1 ${
              activeTab === 'practice' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
            }`}
          >
            Practice
          </button>
          <button
            onClick={() => setActiveTab('mock')}
            className={`transition-colors hover:text-slate-900 py-1 ${
              activeTab === 'mock' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
            }`}
          >
            Mock Tests
          </button>
          <button
            onClick={() => setActiveTab('revision')}
            className={`transition-colors hover:text-slate-900 py-1 ${
              activeTab === 'revision' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
            }`}
          >
            Revision
          </button>
          <button
            onClick={() => setActiveTab('practical')}
            className={`transition-colors hover:text-slate-900 py-1 ${
              activeTab === 'practical' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
            }`}
          >
            Practical Skills
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`transition-colors hover:text-slate-900 py-1 ${
              activeTab === 'progress' ? 'text-slate-900 font-semibold border-b-2 border-slate-900' : ''
            }`}
          >
            Progress
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5">
          {/* AI Tutor Quick Button */}
          <button
            onClick={onOpenTutor}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search syllabus and questions"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Study Streak */}
          <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>{profile.streakDays}d streak</span>
          </div>

          {/* Role Toggle Button (Student / Admin) */}
          <button
            onClick={onToggleAdmin}
            title={profile.role === 'admin' ? 'Switch to Student View' : 'Switch to Admin CMS'}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors ${
              profile.role === 'admin'
                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{profile.role === 'admin' ? 'Admin Mode' : 'Admin'}</span>
          </button>

          {/* Profile Trigger */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'ring-2 ring-slate-900 bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {profile.name.charAt(0)}
          </button>
        </div>
      </div>
    </header>
  );
};
