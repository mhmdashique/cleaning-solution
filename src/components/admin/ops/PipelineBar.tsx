"use client";

import ChartCard from "./ChartCard";

interface PipelineCounts {
  completed: number;
  inProgress: number;
  confirmed: number;
  pending: number;
}

interface PipelineBarProps {
  percentage: number;
  summary: string;
  counts: PipelineCounts;
}

export default function PipelineBar({
  percentage,
  summary,
  counts,
}: PipelineBarProps) {
  const total = counts.completed + counts.inProgress + counts.confirmed + counts.pending || 1;

  const segments = [
    { label: "Completed", count: counts.completed, color: "#0F6B54", width: (counts.completed / total) * 100 },
    { label: "In progress", count: counts.inProgress, color: "#2F7FC1", width: (counts.inProgress / total) * 100 },
    { label: "Confirmed", count: counts.confirmed, color: "#6C5BC9", width: (counts.confirmed / total) * 100 },
    { label: "Pending", count: counts.pending, color: "#B57F0A", width: (counts.pending / total) * 100 },
  ];

  return (
    <ChartCard
      title="Pipeline fulfilment"
      subtitle={summary}
      ariaLabel="Pipeline fulfilment status"
    >
      <div className="space-y-4">
        {/* Big percentage & fulfilled summary */}
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-[32px] font-bold text-[#12201B] leading-none">
            {percentage}%
          </span>
          <span className="text-[13px] text-[#5D6B65]">
            {summary}
          </span>
        </div>

        {/* Segmented horizontal bar */}
        <div 
          className="h-3 w-full rounded-full bg-[#F1F4F2] border border-[#E3E8E5] flex overflow-hidden p-0.5 gap-0.5"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {segments.map((s, idx) => (
            s.width > 0 && (
              <div
                key={idx}
                style={{ width: `${s.width}%`, backgroundColor: s.color }}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
                title={`${s.label}: ${s.count}`}
              />
            )
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-[12px] pt-1">
          {segments.map((s, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[#5D6B65]">{s.label}</span>
              <span className="font-semibold text-[#12201B] ml-auto">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
