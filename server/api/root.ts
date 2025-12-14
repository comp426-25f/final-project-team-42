import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { exampleApiRouter } from "./routers/example";
import { messagesApiRouter } from "./routers/messages";
import { usersApiRouter } from "./routers/users";
import { groupsApiRouter } from "./routers/groups";
import { membershipsApiRouter } from "./routers/membership";

export const appRouter = createTRPCRouter({
  example: exampleApiRouter,
  messages: messagesApiRouter,
  users: usersApiRouter,
  groups: groupsApiRouter,
  memberships: membershipsApiRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
