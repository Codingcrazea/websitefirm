import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Wrench, FileCode, Flame } from 'lucide-react';

interface AuditBug {
  title: string;
  severity: string;
  file: string;
  issue: string;
  impact: string;
  fix: string;
  darkGlow?: boolean;
}

interface AuditFindingsListProps {
  highlights?: string[];
  bugs?: AuditBug[];
}

export default function AuditFindingsList({ highlights, bugs }: AuditFindingsListProps) {
  if ((!highlights || highlights.length === 0) && (!bugs || bugs.length === 0)) return null;

  return (
    <div className="space-y-8">
      {/* Highlights Section */}
      {highlights && highlights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Architecture & Code Integrity Positives</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-surface-dark border border-emerald-500/20 text-slate-300 text-xs flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <p className="leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bugs Section */}
      {bugs && bugs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>Technical Audit Findings & Vulnerabilities</span>
            </h3>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {bugs.length} Defects Uncovered
            </span>
          </div>

          <div className="space-y-4">
            {bugs.map((bug, idx) => {
              const isHigh = bug.severity.toLowerCase().includes('high');
              const isMedium = bug.severity.toLowerCase().includes('medium');

              return (
                <div
                  key={idx}
                  className={`glass-panel rounded-2xl p-6 border space-y-4 transition-all ${
                    isHigh
                      ? 'border-red-500/30 bg-red-950/10 hover:border-red-500/50'
                      : isMedium
                      ? 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/50'
                      : 'border-slate-800 bg-surface-dark hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      {isHigh ? (
                        <Flame className="w-5 h-5 text-red-400 animate-pulse" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                      )}
                      <h4 className="text-lg font-bold text-white">{bug.title}</h4>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto border ${
                        isHigh
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : isMedium
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {bug.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-gold-400 bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 w-fit max-w-full overflow-x-auto">
                    <FileCode className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>{bug.file}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 p-3.5 rounded-xl bg-surface-dark/80 border border-slate-800">
                      <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                        Issue Description
                      </span>
                      <p className="text-slate-200 leading-relaxed">{bug.issue}</p>
                    </div>

                    <div className="space-y-1 p-3.5 rounded-xl bg-surface-dark/80 border border-slate-800">
                      <span className="text-red-400 font-semibold uppercase text-[10px] tracking-wider">
                        Business Impact
                      </span>
                      <p className="text-slate-200 leading-relaxed">{bug.impact}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                    <Wrench className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block mb-0.5">
                        Architectural Fix Action
                      </span>
                      <p className="text-slate-200 text-xs leading-relaxed">{bug.fix}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
