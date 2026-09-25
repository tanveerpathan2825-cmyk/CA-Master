import React, { useState } from 'react';
import {
  User,
  Settings,
  Bell,
  Moon,
  Sun,
  Download,
  Upload,
  RotateCcw,
  Shield,
  HelpCircle,
  Save,
  Check,
  AlertCircle,
} from 'lucide-react';
import { StudentProfile, CALevel } from '../../types';
import { LegalDisclaimerBanner } from '../common/LegalDisclaimerBanner';

interface Props {
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onResetData: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => void;
  onToggleAdmin: () => void;
}

export const ProfileSettings: React.FC<Props> = ({
  profile,
  onUpdateProfile,
  onResetData,
  onExportBackup,
  onImportBackup,
  onToggleAdmin,
}) => {
  const [name, setName] = useState(profile.name);
  const [dailyHours, setDailyHours] = useState(profile.dailyHours);
  const [attempt, setAttempt] = useState(profile.attempt);
  const [examDate, setExamDate] = useState(profile.examDate);
  const [notifications, setNotifications] = useState(profile.notificationsEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim(),
      dailyHours,
      attempt,
      examDate,
      notificationsEnabled: notifications,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleImportSubmit = () => {
    if (!importJson.trim()) return;
    onImportBackup(importJson);
    setShowImportBox(false);
    setImportJson('');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
            <span className="text-xs text-slate-500">
              CA {profile.caLevel} Aspirant · {profile.attempt} Attempt
            </span>
          </div>
        </div>

        <button
          onClick={onToggleAdmin}
          className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-purple-300 bg-purple-50 text-purple-900 hover:bg-purple-100 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Shield className="w-4 h-4 text-purple-700" />
          <span>Switch to Admin CMS</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">Study Preferences & Goals</h2>
          </div>
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Settings Saved
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target CA Level</label>
            <select
              value={profile.caLevel}
              onChange={(e) => onUpdateProfile({ caLevel: e.target.value as CALevel })}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="Foundation">CA Foundation</option>
              <option value="Intermediate">CA Intermediate</option>
              <option value="Final">CA Final</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Examination Attempt</label>
            <select
              value={attempt}
              onChange={(e) => setAttempt(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="May 2026">May 2026</option>
              <option value="September 2026">September 2026</option>
              <option value="November 2026">November 2026</option>
              <option value="January 2027">January 2027</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Exam Start Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Daily Study Target: {dailyHours} Hours/Day
            </label>
            <input
              type="range"
              min="2"
              max="12"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg accent-slate-900 cursor-pointer mt-2"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Study Notifications</label>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  notifications ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-slate-600">
                {notifications ? 'Study reminders enabled' : 'Notifications muted'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Backup, Export & Offline Sync */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Data Management & Offline Backup</h3>
        <p className="text-xs text-slate-500">
          All progress is safely cached on your device. Export your complete study history or restore from a backup JSON file anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={onExportBackup}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Study Log (JSON)</span>
          </button>

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Import Backup</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all tasks, questions, and revision history to initial demo state?')) {
                onResetData();
              }
            }}
            className="px-4 py-2 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Demo Data</span>
          </button>
        </div>

        {showImportBox && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 pt-3">
            <label className="block text-xs font-semibold text-slate-700">Paste Backup JSON</label>
            <textarea
              rows={4}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste previously exported CA Master JSON string here..."
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 bg-white"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowImportBox(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Restore Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Disclaimer */}
      <LegalDisclaimerBanner />
    </div>
  );
};
