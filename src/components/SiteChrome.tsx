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
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-[transform,background-color,border-color] duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  const styles =
    variant === "primary"
      ? "bg-accent text-accent-ink hover:bg-[#ff8d5f]"
      : "border border-line text-text hover:border-muted";
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
          <span aria-hidden className="grid h-7 w-7 place-items-center rounded-md bg-accent font-mono text-xs font-bold text-accent-ink">
            AI
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>
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
            <ButtonLink href={bookingHref()}>Book a call</ButtonLink>
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
          <p className="font-medium text-text">{site.name}</p>
          <p className="mt-2 max-w-xs">{site.tagline}.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/audit" className="hover:text-text">Free AI-readiness audit</Link>
          <Link href="/use-cases" className="hover:text-text">Use cases</Link>
          <Link href="/case-studies" className="hover:text-text">Case studies</Link>
          <a href={site.portfolioUrl} className="hover:text-text">Full portfolio</a>
        </div>
        <div>
          <p>Read-only HubSpot access. Tokens are deleted the moment your scan finishes, and no contact-level data is stored or sent to AI.</p>
          <p className="mt-4">© {new Date().getFullYear()} {site.owner}</p>
        </div>
      </Container>
    </footer>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{children}</p>;
}
