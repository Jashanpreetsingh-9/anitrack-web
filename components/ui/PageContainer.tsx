import { type ReactNode } from "react";

const widths = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
} as const;

export function PageContainer({
  children,
  width = "lg",
  className = "",
}: {
  children: ReactNode;
  width?: keyof typeof widths;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full px-4 py-10 sm:px-6 sm:py-12 ${widths[width]} ${className}`}
    >
      {children}
    </div>
  );
}
