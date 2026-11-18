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
 * Geometric monogram mark for Naviable.id with GDGoC 4-color palette
 */
export function NaviableMark({
  className = "h-5 w-5",
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
      {/* Left Pillar: Google Blue */}
      <path
        d="M6 7.5C6 6.67 6.67 6 7.5 6H11V26H7.5C6.67 26 6 25.33 6 24.5V7.5Z"
        fill="#4285F4"
        stroke="#000000"
        strokeWidth="1.5"
      />
      {/* Diagonal Navigation Beam: Google Yellow */}
      <path
        d="M10.8 6H14L22.2 19.5V26H19L10.8 12.5V6Z"
        fill="#FBBC04"
        stroke="#000000"
        strokeWidth="1.5"
      />
      {/* Right Pillar: Google Green */}
      <path
        d="M21 6H24.5C25.33 6 26 6.67 26 7.5V24.5C26 25.33 25.33 26 24.5 26H21V6Z"
        fill="#34A853"
        stroke="#000000"
        strokeWidth="1.5"
      />
      {/* Waypoint Dot: Google Red */}
      <circle
        cx="23.5"
        cy="8.5"
        r="2.5"
        fill="#EA4335"
        stroke="#000000"
        strokeWidth="1"
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
      icon: "h-5 w-5",
      title: "text-base",
      tagline: "text-[8px]",
    },
    md: {
      box: "h-9.5 w-9.5 rounded-lg",
      icon: "h-5.5 w-5.5",
      title: "text-lg",
      tagline: "text-[9px]",
    },
    lg: {
      box: "h-11 w-11 rounded-xl",
      icon: "h-6.5 w-6.5",
      title: "text-xl",
      tagline: "text-[10px]",
    },
  };

  const currentSize = sizeConfig[size];

  const content = (
    <div className={cn("group flex items-center gap-2.5 select-none", className)}>
      {/* Mark Badge: Neo-Brutalist White Box with 2px Black Border & Hard Shadow */}
      <div
        className={cn(
          "relative flex items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0px_#000] transition-transform duration-150 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_#000]",
          currentSize.box
        )}
      >
        <NaviableMark className={currentSize.icon} />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-black tracking-tight leading-none text-black",
              currentSize.title,
              variant === "light" && "text-white"
            )}
          >
            naviable<span className="text-[#4285F4]">.id</span>
          </span>
          <span className="inline-block rounded-xs bg-[#FBBC04] border border-black px-1 py-0.2 text-[8px] font-black uppercase text-black shadow-[1px_1px_0px_#000]">
            KOMPETISI
          </span>
        </div>
        {showTagline && (
          <span
            className={cn(
              "font-mono font-bold uppercase tracking-wider mt-1 text-slate-500",
              currentSize.tagline,
              variant === "light" && "text-slate-400"
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
      <Link href={href} className="inline-block shrink-0 focus-visible:outline-black focus-visible:outline-2 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
