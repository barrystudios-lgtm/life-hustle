import React, { useState } from 'react';
import { INITIAL_JOBS } from '../data/cityData';
import { Job, PlayerStats } from '../types/game';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Briefcase, 
  DollarSign, 
  Brain, 
  Award, 
  TrendingUp, 
  Car, 
  ShoppingBag, 
  Radio, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';

interface Props {
  currentJobId: string | null;
  stats: PlayerStats;
  cash: number;
  education: string;
  onApplyJob: (job: Job) => void;
  onQuitJob: () => void;
  onWorkShift: () => void;
  onSideHustle: (type: 'rideshare' | 'sneakers' | 'dropship' | 'stream') => void;
}

export const JobPanel: React.FC<Props> = ({
  currentJobId,
  stats,
  cash,
  education,
  onApplyJob,
  onQuitJob,
  onWorkShift,
  onSideHustle,
}) => {
  const [selectedField, setSelectedField] = useState<string>('All');
  const currentJob = INITIAL_JOBS.find((j) => j.id === currentJobId);

  const fields = ['All', 'Tech', 'Finance', 'Service', 'Entertainment', 'Healthcare'];

  const filteredJobs = INITIAL_JOBS.filter((job) => {
    if (selectedField === 'All') return true;
    return job.field === selectedField;
  });

  return (
    <div className="space-y-6">
      {/* Current Employment Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Briefcase className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Primary Occupation
                </span>
                <h3 className="text-xl font-black text-white">
                  {currentJob ? currentJob.title : 'Unemployed Freelancer'}
                </h3>
              </div>
            </div>
            {currentJob && (
              <p className="text-xs text-slate-300 mt-2 max-w-md">
                {currentJob.description} • <span className="text-amber-400 font-semibold">{currentJob.companyName}</span>
              </p>
            )}
          </div>

          {currentJob && (
            <div className="flex flex-col sm:items-end">
              <div className="text-xs text-slate-400 font-mono">Weekly Salary</div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                ${currentJob.weeklySalary.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                ${currentJob.hourlyRate}/hr • 40 hrs/wk
              </div>
            </div>
          )}
        </div>

        {/* Current Job Actions */}
        {currentJob ? (
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (stats.energy >= 20) {
                  sound.playWork();
                  onWorkShift();
                } else {
                  sound.playError();
                }
              }}
              disabled={stats.energy < 20}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                stats.energy >= 20
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Work Overtime Shift (-20 Energy, +${Math.round(currentJob.hourlyRate * 8)})</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onQuitJob();
              }}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 border border-slate-700/80 transition-all cursor-pointer"
            >
              Resign / Quit Job
            </button>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            You currently do not have a salary job. Apply for an entry-level position below or grind American side hustles!
          </div>
        )}
      </div>

      {/* Side Hustles Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            American Gig Economy & Side Hustles
          </h4>
          <span className="text-xs text-slate-400">Instant Cash Opportunities</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Uber / Rideshare */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Car className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">+$75-$150</span>
              </div>
              <h5 className="font-bold text-sm text-white mt-2">Drive Rideshare</h5>
              <p className="text-xs text-slate-400 mt-1">
                Pick up airport passengers and midnight partygoers across town.
              </p>
            </div>
            <button
              onClick={() => onSideHustle('rideshare')}
              disabled={stats.energy < 15}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Drive Surge Shift (-15 Energy)
            </button>
          </div>

          {/* Sneaker Flipping */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
                  <ShoppingBag className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">+$120-$350</span>
              </div>
              <h5 className="font-bold text-sm text-white mt-2">Flip Rare Sneakers</h5>
              <p className="text-xs text-slate-400 mt-1">
                Camp outside hype releases in SoHo and flip on StockX.
              </p>
            </div>
            <button
              onClick={() => onSideHustle('sneakers')}
              disabled={cash < 100 || stats.energy < 15}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Buy & Resell (-$100, -15 Energy)
            </button>
          </div>

          {/* E-Commerce Dropship */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">+$300-$800</span>
              </div>
              <h5 className="font-bold text-sm text-white mt-2">E-Commerce Brand</h5>
              <p className="text-xs text-slate-400 mt-1">
                Run viral TikTok ad campaigns for trendy phone accessories.
              </p>
            </div>
            <button
              onClick={() => onSideHustle('dropship')}
              disabled={cash < 250 || stats.energy < 20}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Launch Ad Campaign (-$250)
            </button>
          </div>

          {/* Live Streaming */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Radio className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">+Followers & Tips</span>
              </div>
              <h5 className="font-bold text-sm text-white mt-2">Live Stream / Vlog</h5>
              <p className="text-xs text-slate-400 mt-1">
                Stream urban adventures, games, and build your digital fanbase.
              </p>
            </div>
            <button
              onClick={() => onSideHustle('stream')}
              disabled={stats.energy < 20}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Go Live (-20 Energy)
            </button>
          </div>
        </div>
      </div>

      {/* Career Openings */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
              Job Market & Career Ladders
            </h4>
            <span className="text-xs text-slate-400">
              Your Education: <span className="text-white font-semibold">{education}</span>
            </span>
          </div>

          {/* Field Filters */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {fields.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedField(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                  selectedField === f
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredJobs.map((job) => {
            const isCurrent = currentJobId === job.id;
            const meetsSmarts = stats.smarts >= job.requiredSmarts;
            const meetsCred = stats.streetCred >= job.requiredCred;
            const meetsDegree = !job.requiredDegree || education.includes(job.requiredDegree);
            const isQualified = meetsSmarts && meetsCred && meetsDegree;

            return (
              <div
                key={job.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {job.field} • Lvl {job.level}
                      </span>
                      {isCurrent && (
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Current Job
                        </span>
                      )}
                    </div>
                    <h5 className="font-bold text-base text-white mt-1">{job.title}</h5>
                    <div className="text-xs text-amber-400/90 font-medium">
                      {job.companyName}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-mono font-black text-emerald-400">
                      ${job.weeklySalary.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">/week (${job.hourlyRate}/hr)</div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2">{job.description}</p>

                {/* Requirements Pills */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                    meetsSmarts ? 'bg-indigo-500/15 text-indigo-300' : 'bg-rose-500/15 text-rose-400'
                  }`}>
                    <Brain className="w-3 h-3" /> Req {job.requiredSmarts} Smarts (You: {stats.smarts})
                  </span>

                  {job.requiredCred > 0 && (
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                      meetsCred ? 'bg-amber-500/15 text-amber-300' : 'bg-rose-500/15 text-rose-400'
                    }`}>
                      <Award className="w-3 h-3" /> Req {job.requiredCred} Cred
                    </span>
                  )}

                  {job.requiredDegree && (
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                      meetsDegree ? 'bg-purple-500/15 text-purple-300' : 'bg-rose-500/15 text-rose-400 font-bold'
                    }`}>
                      <GraduationCap className="w-3 h-3" /> {job.requiredDegree}
                    </span>
                  )}
                </div>

                {/* Action button */}
                <div className="mt-3">
                  {isCurrent ? (
                    <div className="text-center py-1.5 text-xs text-amber-400 font-semibold bg-amber-500/10 rounded-xl">
                      Currently Employed Here
                    </div>
                  ) : (
                    <button
                      disabled={!isQualified}
                      onClick={() => {
                        sound.playLevelUp();
                        confetti({ particleCount: 50, spread: 60 });
                        onApplyJob(job);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isQualified
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {isQualified ? 'Apply & Sign Employment Contract' : 'Prerequisites Not Met'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
