/**
 * This file defines the entire database schema - including all tables and relations.
 *
 * To configure the Supabase database using this schema as a guide, use the command:
 * ```
 * npx drizzle-kit push
 * ```
 *
 * @author Ajay Gandecha <agandecha@unc.edu>
 * @license MIT
 * @see https://comp426-25f.github.io/
 */

import {
  pgTable,
  text,
  timestamp,
  boolean,
  bigserial,
  bigint,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/** Users table */
export const usersTable = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatar_url: text("avatar_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

/** Groups table */
export const groupsTable = pgTable("groups", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  owner_id: bigint("owner_id", { mode: "number" })
    .notNull()
    .references(() => usersTable.id),
  is_private: boolean("is_private").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

/** Memberships table (many-to-many relationship between users and groups) */
export const membershipsTable = pgTable("memberships", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  user_id: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => usersTable.id),
  group_id: bigint("group_id", { mode: "number" })
    .notNull()
    .references(() => groupsTable.id),
  role: text("role").default("member").notNull(),
  joined_at: timestamp("joined_at").defaultNow().notNull(),
});

/** Messages table (for notes board with file attachments) */
export const messagesTable = pgTable("messages", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  group_id: bigint("group_id", { mode: "number" }).references(() => groupsTable.id), // Nullable for personal notes
  author_id: bigint("author_id", { mode: "number" })
    .notNull()
    .references(() => usersTable.id),
  message: text("message"),
  attachment_url: text("attachment_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  memberships: many(membershipsTable),
  messages: many(messagesTable),
  ownedGroups: many(groupsTable),
}));

export const groupsRelations = relations(groupsTable, ({ one, many }) => ({
  owner: one(usersTable, {
    fields: [groupsTable.owner_id],
    references: [usersTable.id],
  }),
  memberships: many(membershipsTable),
  messages: many(messagesTable),
}));

export const membershipsRelations = relations(membershipsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [membershipsTable.user_id],
    references: [usersTable.id],
  }),
  group: one(groupsTable, {
    fields: [membershipsTable.group_id],
    references: [groupsTable.id],
  }),
}));

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  group: one(groupsTable, {
    fields: [messagesTable.group_id],
    references: [groupsTable.id],
  }),
  author: one(usersTable, {
    fields: [messagesTable.author_id],
    references: [usersTable.id],
  }),
}));
