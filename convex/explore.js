import { v } from "convex/values";
import { query } from "./_generated/server";




// Helper function to sort by interests
const sortByInterests = (events, interests) => {
  if (!interests || interests.length === 0) return events;
  
  return [...events].sort((a, b) => {
    // Check if category exists in user interests
    const aMatch = interests.includes(a.category) ? 1 : 0;
    const bMatch = interests.includes(b.category) ? 1 : 0;
    // Higher matches come first
    // Primary sort: Interests (1 vs 0)
    // Secondary sort: Keep original order (usually date)
    return bMatch - aMatch;
  });
};


export const getFeaturedEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .order("desc")
      .collect();

    // Sort by registering count for featured
    const featured = events
      .sort((a, b) => b.registrationCount - a.registrationCount)
      .slice(0, args.limit ?? 3);
    return featured;
  },
});

export const getEventsByLocation = query({
  args: {
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    limit: v.optional(v.number()),
    interests: v.optional(v.array(v.string())), // Add interests arg
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    let events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    // Filter by city or state
    if (args.city) {
      events = events.filter(
        (e) => e.city.toLowerCase() === args.city.toLowerCase()
      );
    } else if (args.state) {
      events = events.filter(
        (e) => e.state?.toLowerCase() === args.state.toLowerCase()
      );
    }
    // Sort by interests (Matches first, then the rest)
    const prioritized = sortByInterests(events, args.interests ?? []);

  return prioritized.slice(0, args.limit ?? 4);
  },
});

// Get popular events (high registration count)
export const getPopularEvents = query({
  args: {
    limit: v.optional(v.number()),
    interests: v.optional(v.array(v.string())), // Add interests arg
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();


      // Sort by registration count
    const popular = events
      .sort((a, b) => b.registrationCount - a.registrationCount)
      //Re-sort to put popular items that match interests at the very top
    const prioritized = sortByInterests(popular, args.interests ?? []);

    return prioritized.slice(0, args.limit ?? 6);
  },
});


// Get events by category with pagination
export const getEventsByCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    return events.slice(0, args.limit ?? 12);
  },
});


// Get events counts by category
export const getCategoryCount = query({
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_date")
      .filter((q) => q.gte(q.field("startDate"), now))
      .collect();

    // Count events by category

    const counts = {};
    events.forEach((event) => {
      counts[event.category] = (counts[event.category] || 0) + 1;
    });
    return counts;
  },
});
