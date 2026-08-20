"use client";

import Link from "next/link";
import { useState } from "react";

export type NavLink = {
  href: string;
  label: string;
  primary?: boolean;
  action?: "logout";
};

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className="rounded-sm border border-warm-gray p-2 font-mono text-xs uppercase tracking-wide text-ink focus-visible:ring-2 focus-visible:ring-ink"
      >
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <nav
          id="mobile-nav-panel"
          aria-label="Mobile"
          className="absolute left-0 right-0 top-full z-40 border-b border-warm-gray bg-paper px-4 py-4 shadow-sm"
        >
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.href + link.label}>
                {link.action === "logout" ? (
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="block w-full text-left font-mono text-xs uppercase tracking-wide text-warm-gray hover:text-stub focus-visible:ring-2 focus-visible:ring-ink"
                    >
                      {link.label}
                    </button>
                  </form>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={
                      link.primary
                        ? "block rounded-sm border border-ink bg-ink px-3 py-2 text-center font-mono text-xs uppercase tracking-wide text-paper"
                        : "block font-mono text-xs uppercase tracking-wide text-ink hover:text-stub focus-visible:ring-2 focus-visible:ring-ink"
                    }
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export function DesktopNav({ links }: { links: NavLink[] }) {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-4 md:flex">
      {links.map((link) =>
        link.primary ? (
          <Link
            key={link.href + link.label}
            href={link.href}
            className="rounded-sm border border-ink bg-ink px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-paper transition-colors hover:border-stub hover:bg-stub focus-visible:ring-2 focus-visible:ring-ink"
          >
            {link.label}
          </Link>
        ) : (
          <Link
            key={link.href + link.label}
            href={link.href}
            className="font-mono text-xs uppercase tracking-wide text-ink hover:text-stub focus-visible:ring-2 focus-visible:ring-ink"
          >
            {link.label}
          </Link>
        ),
      )}
    </nav>
  );
}
