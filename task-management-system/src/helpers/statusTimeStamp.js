import { smartDate } from "../utils/dateFormat";

const getStatusTimestamp = (task, now) => {
  if (task.status === "pending") {
    return `Created: ${smartDate(task.createdAt, now)}`;
  }
  if (task.status === "completed") {
    return `Completed: ${smartDate(task.dateCompleted, now)}`;
  }
  if (task.status === "verified") {
    return `Verified: ${smartDate(task.dateVerified, now)}`;
  }
  return `Updated: ${smartDate(task.updatedAt, now)}`; // Fallback
};

export default getStatusTimestamp;