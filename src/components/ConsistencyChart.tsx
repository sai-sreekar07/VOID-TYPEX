import React, { useState } from 'react';
import { Activity } from 'lucide-react';

interface DataPoint {
  shot: string;
  score: number;
  seed: number;
  status: 'Zero Morph' | 'Sub-pixel Stable' | 'Keyframe Locked';
}

const DEFAULT_DATA: DataPoint[] = [
  { shot: 'Shot 01 (Wide Fjord)', score: 99.8, seed: 89417201, status: 'Keyframe Locked' },
  { shot: 'Shot 02 (Dolly Push)', score: 99.2, seed: 89417202, status: 'Zero Morph' },
  { shot: 'Shot 03 (360 Orbit)', score: 98.7, seed: 89417203, status: 'Sub-pixel Stable' },
  { shot: 'Shot 04 (Rain Strobe)', score: 99.4, seed: 89417204, status: 'Zero Morph' },
  { shot: 'Shot 05 (Tunnel Exit)', score: 99.6, seed: 89417205, status: 'Keyframe Locked' },
  { shot: 'Shot 06 (Macro Headlight)', score: 99.9, seed: 89417206, status: 'Zero Morph' },
  { shot: 'Shot 07 (High-Speed Pan)', score: 98.9, seed: 89417207, status: 'Sub-pixel Stable' },
  { shot: 'Shot 08 (Dawn Horizon)', score: 99.7, seed: 89417208, status: 'Keyframe Locked' },
];

export const ConsistencyChart: React.FC<{ creatorName?: string }> = () => {
  const [activePoint, setActivePoint] = useState<DataPoint>(DEFAULT_DATA[3]);

  const width = 500;
  const height = 140;
  const padding = 25;

  const minScore = 98.0;
  const maxScore = 100.0;

  const getX = (index: number) => padding + (index / (DEFAULT_DATA.length - 1)) * (width - 2 * padding);
  const getY = (score: number) => height - padding - ((score - minScore) / (maxScore - minScore)) * (height - 2 * padding);

  const points = DEFAULT_DATA.map((d, i) => `${getX(i)},${getY(d.score)}`).join(' ');

  return (
    <div className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] space-y-3 font-mono tabular-nums">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="font-semibold text-[var(--text-main)]">
            Multi-Shot Temporal Stability Benchmark
          </span>
        </div>
        <span className="text-xs text-emerald-400 font-semibold">
          Average: 99.4% Zero-Morph
        </span>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-28 overflow-visible"
        >
          <line x1={padding} y1={getY(100)} x2={width - padding} y2={getY(100)} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
          <line x1={padding} y1={getY(99)} x2={width - padding} y2={getY(99)} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
          <line x1={padding} y1={getY(98)} x2={width - padding} y2={getY(98)} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />

          <polygon
            points={`${getX(0)},${height - padding} ${points} ${getX(DEFAULT_DATA.length - 1)},${height - padding}`}
            fill="var(--accent-primary)"
            fillOpacity="0.1"
          />

          <polyline
            points={points}
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {DEFAULT_DATA.map((d, i) => {
            const isSelected = activePoint.shot === d.shot;
            const cx = getX(i);
            const cy = getY(d.score);

            return (
              <g key={d.shot} className="cursor-pointer" onClick={() => setActivePoint(d)}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? 'var(--accent-primary)' : 'var(--bg-card)'}
                  stroke="var(--accent-primary)"
                  strokeWidth="2.5"
                  className="transition-transform hover:scale-125"
                />
              </g>
            );
          })}
        </svg>

        <div className="mt-2 pt-2.5 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <strong className="text-[var(--text-main)]">{activePoint.shot}</strong>
            <span aria-hidden="true">·</span>
            <span>Seed {activePoint.seed}</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-semibold">
              Likeness Match {activePoint.score}%
            </span>
            <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
            <span className="text-[var(--text-main)] font-medium">
              {activePoint.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
