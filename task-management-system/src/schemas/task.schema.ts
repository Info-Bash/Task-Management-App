import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Task title cannot exceed 100 characters"),

  desc: z.string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Task description cannot exceed 1000 characters"),
});
