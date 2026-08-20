import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

const base =
  "inline-flex items-center justify-center rounded-sm font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "border border-ink bg-ink px-4 py-2 text-paper hover:border-stub hover:bg-stub",
  secondary:
    "border border-warm-gray bg-paper px-4 py-2 text-ink hover:border-ink",
  ghost:
    "border border-warm-gray bg-transparent px-2 py-1 text-ink hover:border-ink",
  link: "border-0 bg-transparent p-0 text-ink underline underline-offset-2 hover:text-stub",
} as const;

type Variant = keyof typeof variants;

type ButtonProps = {
  variant?: Variant;
  href?: string;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  href,
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    if (href.startsWith("http")) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export function OAuthLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={`${base} ${variants.secondary} w-full`}>
      {children}
    </a>
  );
}
