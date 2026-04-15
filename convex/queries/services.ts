import { query } from "../_generated/server";

export const getServices = query({
  args: {},
  handler: async (ctx) => {
    const services = await ctx.db.query("services").collect();
    return services.filter((s) => s.active);
  },
});

export const getServicePackages = query({
  args: {},
  handler: async (ctx) => {
    const packages = await ctx.db.query("packages").collect();
    return packages.filter((p) => p.active);
  },
});
