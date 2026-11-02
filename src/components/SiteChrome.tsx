import Link from "next/link";
import { bookingHref, site } from "@/config/site";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  size = "md",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  size?: "md" | "lg";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[transform,box-shadow,border-color,background-color] duration-200 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2";
  const dims = size === "lg" ? "px-7 py-3.5 text-base" : "px-5 py-2.5 text-sm";
  const styles =
    variant === "primary"
      ? "btn-gradient text-white hover:-translate-y-0.5"
      : "glass text-text hover:border-accent/50 hover:bg-white/[0.06]";
  return (
    <Link href={href} className={`${base} ${dims} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 font-semibold tracking-tight ${className}`}>
      <span aria-hidden className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-accent via-accent-2 to-accent-3">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18V9M10 18V5M16 18v-7M22 18V3" />
        </svg>
      </span>
      <span>
        Hub<span className="gradient-text">AI</span>Ops
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-bg/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="flex items-center gap-1 text-sm">
          {site.nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`whitespace-nowrap rounded-full px-2 py-1.5 text-muted transition-colors hover:text-text sm:px-3 ${
                n.href === "/use-cases" ? "hidden sm:inline" : ""
              }`}
            >
              {n.label}
            </Link>
          ))}
          <span className="ml-2 hidden sm:block">
            <ButtonLink href={bookingHref()}>Book a strategy call</ButtonLink>
          </span>
        </nav>
      </Container>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <Container className="grid gap-8 py-12 text-sm text-muted sm:grid-cols-3">
        <div>
          <Logo className="text-text" />
          <p className="mt-3 max-w-xs">{site.tagline}.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/audit" className="hover:text-text">Free AI-readiness audit</Link>
          <Link href="/use-cases" className="hover:text-text">Use cases</Link>
          <Link href="/case-studies" className="hover:text-text">Case studies</Link>
        </div>
        <div>
          <p>Read-only HubSpot access. Tokens are deleted the moment your scan finishes, and no contact-level data is stored or sent to AI.</p>
          <p className="mt-4">© {new Date().getFullYear()} {site.name}</p>
        </div>
      </Container>
    </footer>
  );
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-2 ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
      {children}
    </p>
  );
}
