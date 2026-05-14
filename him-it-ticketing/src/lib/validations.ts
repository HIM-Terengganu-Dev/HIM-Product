import { z } from "zod";

export const ticketSchema = z.object({
  requesterName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  requesterEmail: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  requesterPhone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  department: z
    .string()
    .min(2, "Department must be at least 2 characters")
    .max(100, "Department is too long"),
  category: z.enum(["Software", "Hardware", "Network", "Access", "Others"], {
    error: "Please select a category",
  }),
  priority: z.enum(["Low", "Medium", "High", "Urgent"], {
    error: "Please select a priority",
  }),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description is too long"),
  assetId: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["Open", "InProgress", "Resolved", "Closed"], {
    error: "Status is required",
  }),
  personInCharge: z.string().optional(),
  adminDescription: z.string().optional(),
  actionTaken: z.string().optional(),
});

export type TicketFormValues = z.infer<typeof ticketSchema>;
export type UpdateStatusValues = z.infer<typeof updateStatusSchema>;
