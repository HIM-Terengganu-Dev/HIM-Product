import { Category, Priority, Status } from "@prisma/client";

export interface Ticket {
  id: string;
  ticketNumber: string;
  requesterName: string;
  requesterEmail?: string | null;
  requesterPhone?: string | null;
  department: string;
  category: Category;
  priority: Priority;
  subject: string;
  description: string;
  status: Status;
  assetId?: string | null;
  personInCharge?: string | null;
  adminDescription?: string | null;
  actionTaken?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  logs?: TicketLog[];
}

export interface TicketLog {
  id: string;
  ticketId: string;
  action: string;
  details?: string | null;
  user?: string | null;
  createdAt: string;
}

export type { Category, Priority, Status };

export const CATEGORIES: Category[] = [
  "Software",
  "Hardware",
  "Network",
  "Access",
  "Others",
];

export const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Urgent"];

export const STATUSES: Status[] = ["Open", "InProgress", "Resolved", "Closed"];

export const DEPARTMENTS = [
  "Information Technology",
  "Human Resources",
  "Finance & Accounts",
  "Operations",
  "Marketing & Communications",
  "Sales",
  "Customer Service",
  "Management",
  "Logistics",
  "Others",
];

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bg: string; border: string }
> = {
  Urgent: {
    label: "Urgent",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  High: {
    label: "High",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  Medium: {
    label: "Medium",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  Low: {
    label: "Low",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
  },
};

export const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bg: string; border: string }
> = {
  Open: {
    label: "Open",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  InProgress: {
    label: "In Progress",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  Resolved: {
    label: "Resolved",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  Closed: {
    label: "Closed",
    color: "text-gray-600",
    bg: "bg-gray-100",
    border: "border-gray-200",
  },
};
