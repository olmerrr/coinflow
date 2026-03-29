"use client";

import { useId } from "react";

type Props = {
  className?: string;
};

export function BrandMark({ className }: Props) {
  const raw = useId();
  const safe = raw.replace(/\W/g, "");
  const gid = `cf-g-${safe}`;
  const cid = `cf-c-${safe}`;

  const base =
    "h-9 w-9 shrink-0 drop-shadow-[0_1px_2px_rgba(15,23,42,0.12)]";
  const cls = className ? `${base} ${className}` : base;

  return (
    <svg
      className={cls}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gid}
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#0ea5e9" />
        </linearGradient>
        <clipPath id={cid}>
          <rect width="32" height="32" rx="7" ry="7" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${cid})`}>
        <rect width="32" height="32" rx="7" ry="7" fill={`url(#${gid})`} />
        <path
          d="M6 19.5L10.5 12l4 4.5L20 9l6 7"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
