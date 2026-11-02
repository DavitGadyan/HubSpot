import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  company: text("company"),
  website: text("website"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const audits = pgTable("audits", {
  id: text("id").primaryKey(),
  leadId: text("lead_id"),
  mode: text("mode").notNull(), // quiz | scan | both
  status: text("status").notNull(), // pending | scanning | analyzing | ready | error
  quizAnswers: jsonb("quiz_answers"),
  findings: jsonb("findings"),
  stats: jsonb("stats"),
  scores: jsonb("scores"),
  aiReport: jsonb("ai_report"),
  portalId: text("portal_id"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const hubspotConnections = pgTable("hubspot_connections", {
  auditId: text("audit_id").primaryKey(),
  portalId: text("portal_id").notNull(),
  encAccessToken: text("enc_access_token").notNull(),
  encRefreshToken: text("enc_refresh_token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  scopes: text("scopes"),
});

export const scanJobs = pgTable("scan_jobs", {
  auditId: text("audit_id").primaryKey(),
  step: integer("step").notNull().default(0),
  status: text("status").notNull(), // running | done | error
  partial: jsonb("partial"),
  error: text("error"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
