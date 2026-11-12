"use client";

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

/**
 * Tiny sparkline used inside dashboard KPI cards.
 * Points are normalised into a small fixed viewBox so every card renders the
 * same shape regardless of container width.
 */
export function Sparkline({
  data,
  color = "#10b981",
  height = 20,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const width = 92;
  const h = height;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const last = data.length - 1;

  const points = data
    .map((v, i) => {
      const x = last === 0 ? width / 2 : 10 + (i / last) * (width - 20);
      const y = h - ((v - min) / range) * (h - 6) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={h}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-80 shrink-0"
    >
      <polyline points={points} />
    </svg>
  );
}
