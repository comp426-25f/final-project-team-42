import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import { groupsTable, membershipsTable } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Membership } from "@/server/models/responses";
import type { Subject } from "@/server/models/auth";

function getUserIdFromSubject(subject: Subject): number {
  return parseInt(subject.id.substring(0, 8), 16);
}

async function enforceMembershipAdminOrOwner(
  subject: Subject,
  groupId: number,
) {
  const userId = getUserIdFromSubject(subject);

  const group = await db.query.groupsTable.findFirst({
    where: eq(groupsTable.id, groupId),
    columns: { id: true, owner_id: true },
  });

  if (!group) throw new TRPCError({ code: "NOT_FOUND" });

  if (group.owner_id === userId) return;

  const membership = await db.query.membershipsTable.findFirst({
    where: and(
      eq(membershipsTable.group_id, groupId),
      eq(membershipsTable.user_id, userId),
    ),
    columns: { id: true, role: true },
  });

  if (!membership) throw new TRPCError({ code: "FORBIDDEN" });
  if (membership.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
}

const getMembershipsForGroup = protectedProcedure
  .input(z.object({ groupId: z.number() }))
  .output(Membership.array())
  .query(async ({ ctx, input }) => {
    const { subject } = ctx;
    const { groupId } = input;
    const callerId = getUserIdFromSubject(subject);

    const group = await db.query.groupsTable.findFirst({
      where: eq(groupsTable.id, groupId),
      columns: { id: true, owner_id: true },
    });
    if (!group) throw new TRPCError({ code: "NOT_FOUND" });

    if (group.owner_id !== callerId) {
      const isMember = await db.query.membershipsTable.findFirst({
        where: and(
          eq(membershipsTable.group_id, groupId),
          eq(membershipsTable.user_id, callerId),
        ),
        columns: { id: true },
      });
      if (!isMember) throw new TRPCError({ code: "FORBIDDEN" });
    }

    const memberships = await db.query.membershipsTable.findMany({
      where: eq(membershipsTable.group_id, groupId),
      columns: {
        id: true,
        user_id: true,
        group_id: true,
        role: true,
        joined_at: true,
      },
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            avatar_url: true,
            created_at: true,
          },
        },
      },
    });

    return Membership.array().parse(
      memberships.map((m) => ({
        id: m.id,
        user_id: m.user_id,
        group_id: m.group_id,
        role: m.role,
        joined_at: m.joined_at,
        user: m.user ?? undefined,
      })),
    );
  });

const getMyMembershipForGroup = protectedProcedure
  .input(z.object({ groupId: z.number() }))
  .output(Membership.nullable())
  .query(async ({ ctx, input }) => {
    const { subject } = ctx;
    const { groupId } = input;
    const userId = getUserIdFromSubject(subject);

    const membership = await db.query.membershipsTable.findFirst({
      where: and(
        eq(membershipsTable.group_id, groupId),
        eq(membershipsTable.user_id, userId),
      ),
      columns: {
        id: true,
        user_id: true,
        group_id: true,
        role: true,
        joined_at: true,
      },
    });

    if (!membership) return null;

    return Membership.parse({
      id: membership.id,
      user_id: membership.user_id,
      group_id: membership.group_id,
      role: membership.role,
      joined_at: membership.joined_at,
    });
  });

const getMyMemberships = protectedProcedure
  .output(Membership.array())
  .query(async ({ ctx }) => {
    const { subject } = ctx;
    const userId = getUserIdFromSubject(subject);

    const memberships = await db.query.membershipsTable.findMany({
      where: eq(membershipsTable.user_id, userId),
      columns: {
        id: true,
        user_id: true,
        group_id: true,
        role: true,
        joined_at: true,
      },
      with: {
        group: {
          columns: {
            id: true,
            name: true,
            description: true,
            owner_id: true,
            is_private: true,
            created_at: true,
          },
          with: {
            owner: {
              columns: {
                id: true,
                name: true,
                email: true,
                avatar_url: true,
                created_at: true,
              },
            },
          },
        },
      },
    });

    return Membership.array().parse(
      memberships.map((m) => ({
        id: m.id,
        user_id: m.user_id,
        group_id: m.group_id,
        role: m.role,
        joined_at: m.joined_at,
        group: m.group ?? undefined,
      })),
    );
  });

const joinGroup = protectedProcedure
  .input(z.object({ groupId: z.number() }))
  .output(Membership)
  .mutation(async ({ ctx, input }) => {
    const { subject } = ctx;
    const { groupId } = input;
    const userId = getUserIdFromSubject(subject);

    const group = await db.query.groupsTable.findFirst({
      where: eq(groupsTable.id, groupId),
      columns: { id: true },
    });
    if (!group) throw new TRPCError({ code: "NOT_FOUND" });

    const existing = await db.query.membershipsTable.findFirst({
      where: and(
        eq(membershipsTable.group_id, groupId),
        eq(membershipsTable.user_id, userId),
      ),
      columns: {
        id: true,
        user_id: true,
        group_id: true,
        role: true,
        joined_at: true,
      },
    });

    if (existing) {
      return Membership.parse({
        id: existing.id,
        user_id: existing.user_id,
        group_id: existing.group_id,
        role: existing.role,
        joined_at: existing.joined_at,
      });
    }

    const [created] = await db
      .insert(membershipsTable)
      .values({
        group_id: groupId,
        user_id: userId,
      })
      .returning({
        id: membershipsTable.id,
        user_id: membershipsTable.user_id,
        group_id: membershipsTable.group_id,
        role: membershipsTable.role,
        joined_at: membershipsTable.joined_at,
      });

    return Membership.parse(created);
  });

const leaveGroup = protectedProcedure
  .input(z.object({ groupId: z.number() }))
  .mutation(async ({ ctx, input }) => {
    const { subject } = ctx;
    const { groupId } = input;
    const userId = getUserIdFromSubject(subject);

    const group = await db.query.groupsTable.findFirst({
      where: eq(groupsTable.id, groupId),
      columns: { id: true, owner_id: true },
    });
    if (!group) throw new TRPCError({ code: "NOT_FOUND" });

    await db
      .delete(membershipsTable)
      .where(
        and(
          eq(membershipsTable.group_id, groupId),
          eq(membershipsTable.user_id, userId),
        ),
      );
  });

const setMemberRole = protectedProcedure
  .input(
    z.object({ groupId: z.number(), userId: z.number(), role: z.string() }),
  )
  .output(Membership)
  .mutation(async ({ ctx, input }) => {
    const { subject } = ctx;
    const { groupId, userId, role } = input;

    await enforceMembershipAdminOrOwner(subject, groupId);

    const existing = await db.query.membershipsTable.findFirst({
      where: and(
        eq(membershipsTable.group_id, groupId),
        eq(membershipsTable.user_id, userId),
      ),
      columns: {
        id: true,
        user_id: true,
        group_id: true,
        role: true,
        joined_at: true,
      },
    });

    if (!existing) throw new TRPCError({ code: "NOT_FOUND" });

    await db
      .update(membershipsTable)
      .set({ role })
      .where(eq(membershipsTable.id, existing.id));

    return Membership.parse({
      id: existing.id,
      user_id: existing.user_id,
      group_id: existing.group_id,
      role,
      joined_at: existing.joined_at,
    });
  });

const removeMember = protectedProcedure
  .input(z.object({ groupId: z.number(), userId: z.number() }))
  .mutation(async ({ ctx, input }) => {
    const { subject } = ctx;
    const { groupId, userId } = input;

    await enforceMembershipAdminOrOwner(subject, groupId);

    await db
      .delete(membershipsTable)
      .where(
        and(
          eq(membershipsTable.group_id, groupId),
          eq(membershipsTable.user_id, userId),
        ),
      );
  });

export const membershipsApiRouter = createTRPCRouter({
  getMembershipsForGroup,
  getMyMembershipForGroup,
  getMyMemberships,
  joinGroup,
  leaveGroup,
  setMemberRole,
  removeMember,
});
