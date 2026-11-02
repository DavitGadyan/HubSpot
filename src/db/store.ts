import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { desc, eq } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Lead = typeof schema.leads.$inferSelect;
export type AuditRow = typeof schema.audits.$inferSelect;
export type ConnectionRow = typeof schema.hubspotConnections.$inferSelect;
export type ScanJobRow = typeof schema.scanJobs.$inferSelect;

export interface Store {
  createLead(lead: Omit<Lead, "createdAt">): Promise<void>;
  listLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | null>;
  createAudit(a: Omit<AuditRow, "createdAt" | "updatedAt">): Promise<void>;
  updateAudit(id: string, patch: Partial<AuditRow>): Promise<void>;
  getAudit(id: string): Promise<AuditRow | null>;
  listAudits(): Promise<AuditRow[]>;
  saveConnection(c: ConnectionRow): Promise<void>;
  getConnection(auditId: string): Promise<ConnectionRow | null>;
  deleteConnection(auditId: string): Promise<void>;
  saveScanJob(j: Omit<ScanJobRow, "updatedAt">): Promise<void>;
  getScanJob(auditId: string): Promise<ScanJobRow | null>;
}

// ---------- Postgres (Supabase) ----------
class PgStore implements Store {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}
  async createLead(lead: Omit<Lead, "createdAt">) {
    await this.db.insert(schema.leads).values(lead);
  }
  listLeads() {
    return this.db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt)).limit(500);
  }
  async getLead(id: string) {
    const rows = await this.db.select().from(schema.leads).where(eq(schema.leads.id, id)).limit(1);
    return rows[0] ?? null;
  }
  async createAudit(a: Omit<AuditRow, "createdAt" | "updatedAt">) {
    await this.db.insert(schema.audits).values(a);
  }
  async updateAudit(id: string, patch: Partial<AuditRow>) {
    await this.db
      .update(schema.audits)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(schema.audits.id, id));
  }
  async getAudit(id: string) {
    const rows = await this.db.select().from(schema.audits).where(eq(schema.audits.id, id)).limit(1);
    return rows[0] ?? null;
  }
  listAudits() {
    return this.db.select().from(schema.audits).orderBy(desc(schema.audits.createdAt)).limit(500);
  }
  async saveConnection(c: ConnectionRow) {
    await this.db
      .insert(schema.hubspotConnections)
      .values(c)
      .onConflictDoUpdate({ target: schema.hubspotConnections.auditId, set: c });
  }
  async getConnection(auditId: string) {
    const rows = await this.db
      .select()
      .from(schema.hubspotConnections)
      .where(eq(schema.hubspotConnections.auditId, auditId))
      .limit(1);
    return rows[0] ?? null;
  }
  async deleteConnection(auditId: string) {
    await this.db.delete(schema.hubspotConnections).where(eq(schema.hubspotConnections.auditId, auditId));
  }
  async saveScanJob(j: Omit<ScanJobRow, "updatedAt">) {
    const row = { ...j, updatedAt: new Date() };
    await this.db
      .insert(schema.scanJobs)
      .values(row)
      .onConflictDoUpdate({ target: schema.scanJobs.auditId, set: row });
  }
  async getScanJob(auditId: string) {
    const rows = await this.db.select().from(schema.scanJobs).where(eq(schema.scanJobs.auditId, auditId)).limit(1);
    return rows[0] ?? null;
  }
}

// ---------- JSON file (local development without a database) ----------
type FileShape = {
  leads: Lead[];
  audits: AuditRow[];
  connections: ConnectionRow[];
  scanJobs: ScanJobRow[];
};

const revive = (_k: string, v: unknown) =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v) ? new Date(v) : v;

class FileStore implements Store {
  private file = process.env.VERCEL
    ? "/tmp/hubspot-ai-readiness.json"
    : path.join(process.cwd(), ".data", "db.json");
  private queue: Promise<unknown> = Promise.resolve();

  private async read(): Promise<FileShape> {
    try {
      return JSON.parse(await fs.readFile(this.file, "utf8"), revive);
    } catch {
      return { leads: [], audits: [], connections: [], scanJobs: [] };
    }
  }
  private mutate(fn: (d: FileShape) => void): Promise<void> {
    const run = this.queue.then(async () => {
      const d = await this.read();
      fn(d);
      await fs.mkdir(path.dirname(this.file), { recursive: true });
      await fs.writeFile(this.file, JSON.stringify(d, null, 2));
    });
    this.queue = run.catch(() => undefined);
    return run;
  }
  createLead(lead: Omit<Lead, "createdAt">) {
    return this.mutate((d) => void d.leads.push({ ...lead, createdAt: new Date() }));
  }
  async listLeads() {
    return (await this.read()).leads.sort((a, b) => +b.createdAt - +a.createdAt);
  }
  async getLead(id: string) {
    return (await this.read()).leads.find((l) => l.id === id) ?? null;
  }
  createAudit(a: Omit<AuditRow, "createdAt" | "updatedAt">) {
    return this.mutate((d) => void d.audits.push({ ...a, createdAt: new Date(), updatedAt: new Date() }));
  }
  updateAudit(id: string, patch: Partial<AuditRow>) {
    return this.mutate((d) => {
      const i = d.audits.findIndex((a) => a.id === id);
      if (i >= 0) d.audits[i] = { ...d.audits[i], ...patch, updatedAt: new Date() };
    });
  }
  async getAudit(id: string) {
    return (await this.read()).audits.find((a) => a.id === id) ?? null;
  }
  async listAudits() {
    return (await this.read()).audits.sort((a, b) => +b.createdAt - +a.createdAt);
  }
  saveConnection(c: ConnectionRow) {
    return this.mutate((d) => {
      d.connections = d.connections.filter((x) => x.auditId !== c.auditId).concat(c);
    });
  }
  async getConnection(auditId: string) {
    return (await this.read()).connections.find((c) => c.auditId === auditId) ?? null;
  }
  deleteConnection(auditId: string) {
    return this.mutate((d) => {
      d.connections = d.connections.filter((x) => x.auditId !== auditId);
    });
  }
  saveScanJob(j: Omit<ScanJobRow, "updatedAt">) {
    return this.mutate((d) => {
      d.scanJobs = d.scanJobs.filter((x) => x.auditId !== j.auditId).concat({ ...j, updatedAt: new Date() });
    });
  }
  async getScanJob(auditId: string) {
    return (await this.read()).scanJobs.find((j) => j.auditId === auditId) ?? null;
  }
}

let store: Store | undefined;

export function getStore(): Store {
  if (store) return store;
  if (process.env.DATABASE_URL) {
    // prepare:false is required for Supabase's transaction pooler (port 6543).
    const sql = postgres(process.env.DATABASE_URL, { prepare: false, max: 5 });
    store = new PgStore(drizzle(sql, { schema }));
  } else {
    if (process.env.VERCEL) {
      console.warn("DATABASE_URL is not set: using ephemeral /tmp storage. Set it in Vercel for persistence.");
    }
    store = new FileStore();
  }
  return store;
}
