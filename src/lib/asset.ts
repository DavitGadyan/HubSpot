/** Prefix a public asset path with the base path (GitHub Pages serves the site under /<repo>). */
export function asset(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
