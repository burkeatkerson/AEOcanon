"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { mainNav, navCtas } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header>
      {/* hub strip */}
      <div className="bg-ink text-bg font-mono text-[11px] tracking-[0.05em]">
        <Container className="flex h-[30px] items-center gap-4">
          <span className="opacity-90">
            AEO Canon · the reference for answer-engine optimization
          </span>
          <span className="ml-auto hidden opacity-60 sm:inline">
            Get found by the AI your customers ask
          </span>
        </Container>
      </div>

      {/* primary nav */}
      <div className="border-line bg-bg/85 sticky top-0 z-50 border-b backdrop-blur-md">
        <Container className="flex h-16 items-center gap-7">
          <Logo />

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-[22px]">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "font-mono text-[12.5px] tracking-[0.02em] transition-colors",
                      isActive(pathname, item.href)
                        ? "text-ink"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Button
              href={navCtas.ghost.href}
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              {navCtas.ghost.label}
            </Button>
            <Button
              href={navCtas.primary.href}
              size="sm"
              className="hidden sm:inline-flex"
            >
              {navCtas.primary.label}
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="border-line-2 text-ink-2 grid size-9 place-items-center rounded-md border md:hidden"
            >
              {open ? (
                <X className="size-4.5" />
              ) : (
                <Menu className="size-4.5" />
              )}
            </button>
          </div>
        </Container>

        {/* mobile panel */}
        {open ? (
          <div className="border-line bg-bg border-t md:hidden">
            <Container className="flex flex-col gap-1 py-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 font-mono text-sm",
                    isActive(pathname, item.href)
                      ? "bg-accent-soft text-ink"
                      : "text-ink-2 hover:bg-paper",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-3">
                <Button href={navCtas.ghost.href} variant="ghost" size="sm">
                  {navCtas.ghost.label}
                </Button>
                <Button href={navCtas.primary.href} size="sm">
                  {navCtas.primary.label}
                </Button>
              </div>
            </Container>
          </div>
        ) : null}
      </div>
    </header>
  );
}
