#!/usr/bin/env node
/**
 * Build the static (GitHub Pages) variant of the site.
 *
 * Next.js `output: "export"` cannot include route handlers, middleware, server
 * actions or database-backed dynamic routes, so this script temporarily moves
 * those out of `src/`, swaps in the gated static /audit page, runs `next build`,
 * and restores everything afterwards (even on failure).
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const holding = path.join(root, ".static-excluded");

const EXCLUDE = [
  "src/app/api",
  "src/app/admin",
  "src/app/audit/[id]",
  "src/app/audit/quiz",
  "src/app/audit/actions.ts",
  "src/app/audit/page.tsx",
  "src/components/ConnectForm.tsx",
  "src/components/QuizStepper.tsx",
  "src/middleware.ts",
];
const STATIC_AUDIT_PAGE = "src/app/audit/page.static.tsx";

const moved = [];
function moveOut(rel) {
  const from = path.join(root, rel);
  if (!existsSync(from)) return;
  const to = path.join(holding, rel);
  mkdirSync(path.dirname(to), { recursive: true });
  renameSync(from, to);
  moved.push(rel);
}
function restore() {
  for (const rel of moved.reverse()) {
    const from = path.join(holding, rel);
    const to = path.join(root, rel);
    if (existsSync(to)) rmSync(to, { recursive: true, force: true });
    mkdirSync(path.dirname(to), { recursive: true });
    renameSync(from, to);
  }
  rmSync(holding, { recursive: true, force: true });
}

rmSync(holding, { recursive: true, force: true });
rmSync(path.join(root, "out"), { recursive: true, force: true });

let code = 1;
try {
  for (const rel of EXCLUDE) moveOut(rel);
  cpSync(path.join(root, STATIC_AUDIT_PAGE), path.join(root, "src/app/audit/page.tsx"));
  const res = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "1" },
    shell: process.platform === "win32",
  });
  code = res.status ?? 1;
} finally {
  rmSync(path.join(root, "src/app/audit/page.tsx"), { force: true });
  restore();
}
process.exit(code);
