import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const cronsList = cronJobs();

cronsList.hourly(
  "dailyReminders",
  { minuteUTC: 0 },
  api.actions.emails.sendDailyReminders,
  {}
);

export default cronsList;
