import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NaviableLogoProps {
  className?: string;
  showTagline?: boolean;
  taglineText?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  variant?: "dark" | "light";
}

/**
 * Bespoke geometric monogram mark for Naviable.id
 * Precision architectural 'N' with forward momentum geometry.
 * Designed to avoid generic AI-slop (no random sparkles, rainbow gradients, or stock trophy icons).
 */
export function NaviableMark({
  className = "h-5 w-5",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* Precision Geometric Monogram N */}
      {/* Left Pillar */}
      <path
        d="M6 7.5C6 6.67 6.67 6 7.5 6H11V26H7.5C6.67 26 6 25.33 6 24.5V7.5Z"
        fill={variant === "light" ? "#FFFFFF" : "#1E1B4B"}
      />
      {/* Dynamic Diagonal Navigation Beam */}
      <path
        d="M10.8 6H13.6L22.2 19V26H19.4L10.8 13V6Z"
        fill="#4F46E5"
      />
      {/* Right Pillar with upward momentum */}
      <path
        d="M21 6H24.5C25.33 6 26 6.67 26 7.5V24.5C26 25.33 25.33 26 24.5 26H21V6Z"
        fill={variant === "light" ? "#E0E7FF" : "#312E81"}
      />
      {/* Subtle precision waypoint accent on apex */}
      <circle
        cx="23.5"
        cy="8.5"
        r="1.75"
        fill="#38BDF8"
      />
    </svg>
  );
}

export default function NaviableLogo({
  className,
  showTagline = true,
  taglineText = "Direktori Kompetisi Pelajar",
  size = "md",
  href = "/",
  variant = "dark",
}: NaviableLogoProps) {
  const sizeConfig = {
    sm: {
      box: "h-8 w-8 rounded-lg",
      icon: "h-4.5 w-4.5",
      title: "text-base",
      tagline: "text-[8px]",
    },
    md: {
      box: "h-9.5 w-9.5 rounded-xl",
      icon: "h-5 w-5",
      title: "text-lg",
      tagline: "text-[9px]",
    },
    lg: {
      box: "h-11 w-11 rounded-2xl",
      icon: "h-6 w-6",
      title: "text-xl",
      tagline: "text-[10px]",
    },
  };

  const currentSize = sizeConfig[size];

  const content = (
    <div className={cn("group flex items-center gap-2.5 select-none", className)}>
      {/* Mark Badge: Crisp, solid, high-contrast container */}
      <div
        className={cn(
          "relative flex items-center justify-center border transition-all duration-200 group-hover:scale-105 group-hover:shadow-md",
          currentSize.box,
          variant === "light"
            ? "bg-slate-900 border-slate-800 shadow-slate-950/20"
            : "bg-white border-slate-200/90 shadow-xs"
        )}
      >
        <NaviableMark className={currentSize.icon} variant={variant === "light" ? "light" : "dark"} />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <span
          className={cn(
            "font-black tracking-tight leading-none transition-colors",
            currentSize.title,
            variant === "light" ? "text-white" : "text-slate-900"
          )}
        >
          naviable<span className="text-indigo-600">.id</span>
        </span>
        {showTagline && (
          <span
            className={cn(
              "font-bold uppercase tracking-wider mt-1",
              currentSize.tagline,
              variant === "light" ? "text-slate-400" : "text-slate-400"
            )}
          >
            {taglineText}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block shrink-0 focus-visible:outline-indigo-600 focus-visible:outline-2 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
