import { differenceInSeconds, format, differenceInDays } from "date-fns";

export const smartDate = (dateString, nowValue) => {
  const date = new Date(dateString);
  const now = new Date(nowValue);

  const seconds = differenceInSeconds(now, date);
  const days = differenceInDays(now, date);

  if (days > 7) return format(date, "dd MMM yyyy");
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;

  return `${Math.floor(seconds / 86400)} days ago`;
};
