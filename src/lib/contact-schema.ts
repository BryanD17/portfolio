import { z } from "zod";

/**
 * THE one contact schema. The client form and the route handler both import
 * this; there are never two drifting copies.
 */
export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(120),
  email: z.string().email("Please enter a valid email address."),
  topic: z.enum(["internship", "project", "question", "other"]).optional(),
  message: z.string().min(10, "Please write at least a sentence.").max(5000),
  /**
   * Honeypot. Humans never see it; bots fill it. Validation accepts any
   * value so a filled honeypot reaches the route handler, which then
   * returns 200 and silently drops the message.
   */
  company: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const TOPIC_LABELS: Record<NonNullable<ContactInput["topic"]>, string> = {
  internship: "Internship opportunity",
  project: "Project",
  question: "Question",
  other: "Other",
};
