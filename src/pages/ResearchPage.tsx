import React, { useState } from 'react';
import { RESEARCH_TOPICS } from '../data/researchContent';
import { BookOpen, ExternalLink, ShieldCheck, ChevronRight, Hash, Bookmark } from 'lucide-react';

export const ResearchPage: React.FC = () => {
  const [activeTopicId, setActiveTopicId] = useState<string>(RESEARCH_TOPICS[0].id);

  const activeTopic = RESEARCH_TOPICS.find((t) => t.id === activeTopicId) || RESEARCH_TOPICS[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600 border border-teal-200">
              <BookOpen className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Acoustic Research &amp; Scientific Compendium
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Academic literature review exploring sound physics, urban acoustics, physiological impacts, and verified standards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            Verified Citations Only
          </span>
        </div>
      </div>

      {/* Academic Citation Integrity Banner */}
      <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-teal-800">Academic Citation Integrity:</strong> All standards, regulatory decibel levels, and epidemiological health impacts in this compendium cite established publications from the World Health Organization (WHO), the Central Pollution Control Board (CPCB), the International Organization for Standardization (ISO), and the International Electrotechnical Commission (IEC).
        </p>
      </div>

      {/* 2-Column Research Layout: Table of Contents Sidebar + Detailed Topic Article */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar (10 Topics) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs sticky top-20">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
              RESEARCH MODULES ({RESEARCH_TOPICS.length})
            </span>
            <div className="mt-1 space-y-1">
              {RESEARCH_TOPICS.map((topic) => {
                const isActive = topic.id === activeTopic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTopicId(topic.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs text-left transition-all ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200/70'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] ${
                          isActive
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {topic.number}
                      </span>
                      <span className="line-clamp-1">{topic.title}</span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-teal-600' : 'text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Topic Article Content */}
        <div className="lg:col-span-8">
          <article className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Topic Header */}
            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-mono text-teal-700 font-bold mb-1">
                <span>MODULE {activeTopic.number.toString().padStart(2, '0')}</span>
                <span>/</span>
                <span>10</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {activeTopic.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
                {activeTopic.summary}
              </p>
            </div>

            {/* Key Empirical Takeaways */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-teal-600" />
                <span>Fundamental Principles</span>
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {activeTopic.keyPoints.map((pt, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* In-depth Scientific Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Scientific Context &amp; Analytical Framework
              </h3>
              <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                {activeTopic.details.map((d, i) => (
                  <p key={i} className="bg-white p-3 rounded-lg border border-slate-100">
                    {d}
                  </p>
                ))}
              </div>
            </div>

            {/* Metrics or Standard Values (if available) */}
            {activeTopic.metricsOrStandards && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Reference Quantitative Standards
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeTopic.metricsOrStandards.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 flex flex-col justify-between"
                    >
                      <span className="text-[11px] font-semibold text-slate-600">
                        {m.label}
                      </span>
                      <span className="text-base font-extrabold font-mono text-teal-800 my-1">
                        {m.value}
                      </span>
                      {m.notes && (
                        <span className="text-[10px] text-slate-500">
                          {m.notes}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Authoritative Citations & References */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>Authoritative References &amp; Standards</span>
              </h3>
              <div className="space-y-2">
                {activeTopic.citations.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <h5 className="font-semibold text-slate-800">{c.title}</h5>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-700">{c.organization}</span>
                        <span>•</span>
                        <span>Year: {c.year}</span>
                        {c.documentRef && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-slate-600">{c.documentRef}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs hover:bg-slate-50 shrink-0"
                      >
                        <span>Official Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
