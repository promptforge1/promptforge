import { createRouter, publicQuery } from "./middleware";
import { optimizeRouter } from "./routes/optimize";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  optimize: optimizeRouter,
});

export type AppRouter = typeof appRouter;
