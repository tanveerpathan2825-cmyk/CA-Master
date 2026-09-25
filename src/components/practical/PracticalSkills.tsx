import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Calculator,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { PracticalModule } from '../../types';

interface Props {
  modules: PracticalModule[];
  onToggleComplete: (moduleId: string) => void;
  onOpenTutor: (query: string) => void;
}

export const PracticalSkills: React.FC<Props> = ({
  modules,
  onToggleComplete,
  onOpenTutor,
}) => {
  const [activeModuleId, setActiveModuleId] = useState<string>(modules[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'learn' | 'simulation' | 'case' | 'quiz'>('simulation');

  // Interactive Journal Entry Sandbox State
  const [drAccount, setDrAccount] = useState('Office Equipment A/c');
  const [drAmount, setDrAmount] = useState('80000');
  const [itcAmount, setItcAmount] = useState('14400');
  const [crAccount, setCrAccount] = useState('Bank A/c');
  const [crAmount, setCrAmount] = useState('94400');
  const [journalValidated, setJournalValidated] = useState<boolean | null>(null);

  // Interactive BRS Simulator State
  const [startingCashBalance, setStartingCashBalance] = useState(120000);
  const [unpresentedCheques, setUnpresentedCheques] = useState(35000);
  const [directDeposit, setDirectDeposit] = useState(25000);
  const [bankCharges, setBankCharges] = useState(1200);
  const [userCalculatedPassbook, setUserCalculatedPassbook] = useState('');
  const [brsValidated, setBrsValidated] = useState<boolean | null>(null);

  // Interactive GST Set-Off State
  const [igstCredit, setIgstCredit] = useState(80000);
  const [cgstCredit, setCgstCredit] = useState(20000);
  const [sgstCredit, setSgstCredit] = useState(20000);
  const [igstLiability, setIgstLiability] = useState(60000);
  const [cgstLiability, setCgstLiability] = useState(40000);
  const [sgstLiability, setSgstLiability] = useState(40000);

  const activeModule = modules.find((m) => m.id === activeModuleId) || modules[0];

  const handleValidateJournal = () => {
    const totalDr = Number(drAmount) + Number(itcAmount);
    const totalCr = Number(crAmount);
    if (totalDr === totalCr && totalDr === 94400) {
      setJournalValidated(true);
    } else {
      setJournalValidated(false);
    }
  };

  const handleValidateBRS = () => {
    // Favourable cash book: Add unpresented cheques + direct deposit - bank charges
    const expected = startingCashBalance + unpresentedCheques + directDeposit - bankCharges; // 120000 + 35000 + 25000 - 1200 = 178800
    if (Number(userCalculatedPassbook) === expected) {
      setBrsValidated(true);
    } else {
      setBrsValidated(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Articleship & Industry Readiness
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
            Practical Accounting & Business Skills
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Hands-on workbenches for Journal Entries, BRS, GST Set-Off, and Excel workpapers without relying on external software.
          </p>
        </div>

        <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 max-w-sm">
          <strong>Educational Simulator:</strong> Not an official Tally, Microsoft, or ICAI product. Designed for conceptual CA articleship training.
        </div>
      </div>

      {/* Module Selector Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {modules.map((m) => {
          const isSelected = m.id === activeModuleId;
          return (
            <button
              key={m.id}
              onClick={() => {
                setActiveModuleId(m.id);
                setJournalValidated(null);
                setBrsValidated(null);
              }}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    isSelected ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {m.category}
                </span>
                {m.isCompleted && (
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-emerald-400' : 'text-emerald-600'
                    }`}
                  />
                )}
              </div>
              <h4 className="text-xs font-bold leading-snug line-clamp-2">{m.title}</h4>
              <span
                className={`text-[10px] block ${
                  isSelected ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                ~{m.readTimeMinutes} min simulator
              </span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE MODULE CONTAINER */}
      {activeModule && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-6">
          {/* Sub Navigation */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <span className="text-xs font-semibold text-slate-500">
                {activeModule.category} · Practical Module
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{activeModule.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              {(['simulation', 'learn', 'case', 'quiz'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                    activeTab === tab
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}

              <button
                onClick={() => onToggleComplete(activeModule.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  activeModule.isCompleted
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {activeModule.isCompleted ? 'Completed' : 'Mark Done'}
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* 1. INTERACTIVE SIMULATION TAB */}
            {activeTab === 'simulation' && (
              <div className="space-y-6 max-w-3xl mx-auto">
                {activeModule.practicalCase.interactiveTaskType === 'journal' && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-slate-900 block">Transaction Scenario:</span>
                      <p>{activeModule.practicalCase.problemDetails}</p>
                    </div>

                    {/* Interactive Dr / Cr Table */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <div className="grid grid-cols-12 bg-slate-100 p-2.5 font-bold text-slate-700 border-b border-slate-200">
                        <span className="col-span-6">Particulars / Account Head</span>
                        <span className="col-span-3 text-right">Debit (₹)</span>
                        <span className="col-span-3 text-right">Credit (₹)</span>
                      </div>

                      {/* Row 1: Office Equipment Dr. */}
                      <div className="grid grid-cols-12 p-3 border-b border-slate-100 items-center gap-2">
                        <div className="col-span-6">
                          <input
                            type="text"
                            value={drAccount}
                            onChange={(e) => setDrAccount(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-slate-200 font-mono text-xs"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={drAmount}
                            onChange={(e) => setDrAmount(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-slate-200 font-mono text-xs text-right"
                          />
                        </div>
                        <div className="col-span-3 text-right text-slate-400 font-mono">-</div>
                      </div>

                      {/* Row 2: Input IGST Dr. */}
                      <div className="grid grid-cols-12 p-3 border-b border-slate-100 items-center gap-2">
                        <div className="col-span-6 text-slate-700 font-mono pl-4">
                          Input IGST A/c (18% ITC)
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={itcAmount}
                            onChange={(e) => setItcAmount(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-slate-200 font-mono text-xs text-right"
                          />
                        </div>
                        <div className="col-span-3 text-right text-slate-400 font-mono">-</div>
                      </div>

                      {/* Row 3: Bank Cr. */}
                      <div className="grid grid-cols-12 p-3 border-b border-slate-100 items-center gap-2 bg-slate-50/50">
                        <div className="col-span-6 text-slate-700 font-mono pl-8">
                          To {crAccount}
                        </div>
                        <div className="col-span-3 text-right text-slate-400 font-mono">-</div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={crAmount}
                            onChange={(e) => setCrAmount(e.target.value)}
                            className="w-full px-2 py-1 rounded border border-slate-200 font-mono text-xs text-right"
                          />
                        </div>
                      </div>

                      {/* Narration */}
                      <div className="p-3 bg-slate-50 text-[11px] text-slate-500 font-mono italic">
                        (Being purchase of computer equipment with GST paid by cheque)
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-500 font-mono">
                        Total Debits: ₹{Number(drAmount) + Number(itcAmount)} | Total Credits: ₹
                        {Number(crAmount)}
                      </span>
                      <button
                        onClick={handleValidateJournal}
                        className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        Verify Journal Balancing
                      </button>
                    </div>

                    {journalValidated === true && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Perfect! Dual aspect balanced. Asset and Tax credit accounts correctly debited, and Bank credited.
                        </span>
                      </div>
                    )}
                    {journalValidated === false && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>
                          Imbalance detected! Total Debits must match total payment of ₹94,400.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {activeModule.practicalCase.interactiveTaskType === 'brs' && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-slate-900 block">Reconciliation Scenario:</span>
                      <p>{activeModule.practicalCase.problemDetails}</p>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="font-semibold text-slate-800">
                          Starting Balance as per Cash Book (Favourable)
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          ₹{startingCashBalance.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-emerald-700">
                        <span>(+) Cheques issued but not yet presented for payment</span>
                        <span className="font-mono font-semibold">+₹{unpresentedCheques.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex items-center justify-between text-emerald-700">
                        <span>(+) Direct customer transfer into bank</span>
                        <span className="font-mono font-semibold">+₹{directDeposit.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex items-center justify-between text-red-700 pb-2 border-b border-slate-100">
                        <span>(-) Bank maintenance charges debited by bank</span>
                        <span className="font-mono font-semibold">-₹{bankCharges.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-bold text-slate-900">
                          Enter Calculated Passbook Balance:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-mono">₹</span>
                          <input
                            type="number"
                            value={userCalculatedPassbook}
                            onChange={(e) => setUserCalculatedPassbook(e.target.value)}
                            placeholder="e.g. 178800"
                            className="w-32 px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        onClick={handleValidateBRS}
                        className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        Check BRS Reconciliation
                      </button>
                    </div>

                    {brsValidated === true && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Spot on! Balance as per Passbook is ₹1,78,800. Perfect reconciliation logic.
                        </span>
                      </div>
                    )}
                    {brsValidated === false && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>
                          Calculation incorrect. Formula: 1,20,000 + 35,000 + 25,000 - 1,200 = ₹1,78,800.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {activeModule.practicalCase.interactiveTaskType === 'gst_calc' && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-slate-900 block">Statutory Order of ITC Set-Off:</span>
                      <p>
                        Rule 88A mandate: IGST credit must be 100% utilized first towards IGST liability, then CGST and SGST in any order/proportion before touching CGST/SGST credits.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                        <span className="text-slate-500 block text-[10px]">IGST ITC</span>
                        <span className="text-base font-bold text-blue-900 tabular-nums font-mono">
                          ₹{igstCredit.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <span className="text-slate-500 block text-[10px]">CGST ITC</span>
                        <span className="text-base font-bold text-emerald-900 tabular-nums font-mono">
                          ₹{cgstCredit.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                        <span className="text-slate-500 block text-[10px]">SGST ITC</span>
                        <span className="text-base font-bold text-purple-900 tabular-nums font-mono">
                          ₹{sgstCredit.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                      <span className="font-bold text-slate-800 block">Step 1: Set off IGST liability</span>
                      <p className="text-slate-600">
                        IGST Liability ₹60,000 absorbed by IGST ITC. Remaining IGST ITC = ₹20,000.
                      </p>
                      <span className="font-bold text-slate-800 block pt-1">
                        Step 2: Set off CGST & SGST with remaining IGST ITC
                      </span>
                      <p className="text-slate-600">
                        ₹20,000 applied towards CGST (₹10,000) and SGST (₹10,000). Remaining liabilities cleared by respective CGST & SGST credits.
                      </p>
                    </div>
                  </div>
                )}

                {activeModule.practicalCase.interactiveTaskType === 'tax_slab' && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-slate-900 block">Excel Workpaper Trainer</span>
                      <p>
                        Articleship shortcut practice: What formula is best to calculate variable rate tax slabs without nested IFs?
                      </p>
                    </div>

                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 text-xs">
                      <div className="font-mono text-slate-800 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                        =VLOOKUP(Income, TaxTable, 2, TRUE) + (Income - VLOOKUP(Income, TaxTable, 1, TRUE)) * VLOOKUP(Income, TaxTable, 3, TRUE)
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        Using range lookup `TRUE` allows clean bracket matching and eliminates formula errors during statutory audit checks.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. LEARN TAB */}
            {activeTab === 'learn' && (
              <div className="space-y-4 max-w-2xl mx-auto">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                  Core Theoretical Foundations
                </h3>
                <div className="space-y-2.5">
                  {activeModule.coreConcepts.map((concept, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {i + 1}
                      </span>
                      <span>{concept}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. CASE STUDY TAB */}
            {activeTab === 'case' && (
              <div className="space-y-4 max-w-2xl mx-auto text-xs">
                <h3 className="text-sm font-bold text-slate-900">
                  {activeModule.practicalCase.problemTitle}
                </h3>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {activeModule.practicalCase.problemDetails}
                </p>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                  <span className="font-bold text-amber-950 block">Practical Articleship Takeaways:</span>
                  <ul className="text-slate-700 list-disc pl-4 space-y-1">
                    {activeModule.keyTakeaways.map((takeaway, i) => (
                      <li key={i}>{takeaway}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 4. QUIZ TAB */}
            {activeTab === 'quiz' && (
              <div className="space-y-4 max-w-xl mx-auto text-xs">
                <span className="text-sm font-bold text-slate-900 block">Concept Check</span>
                <div className="p-4 border border-slate-200 rounded-xl space-y-3">
                  <p className="font-semibold text-slate-900">
                    Why must non-refundable duties be included in asset acquisition cost while GST with ITC is excluded?
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Under AS 10 / Ind AS 16, taxes that are recoverable from taxing authorities (like GST where input credit is availed) do not form part of purchase price because they represent an asset/receivable, not an unrecoverable capital outflow.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
