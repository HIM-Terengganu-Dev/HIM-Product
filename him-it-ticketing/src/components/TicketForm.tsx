"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketSchema, type TicketFormValues } from "@/lib/validations";
import { CATEGORIES, PRIORITIES, DEPARTMENTS } from "@/types";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Ticket,
  ChevronDown,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TicketForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{
    ticketNumber: string;
    subject: string;
    hasEmail: boolean;
  } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
  });

  const onSubmit = async (data: TicketFormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed");
      setSuccess({
        ticketNumber: json.ticket.ticketNumber,
        subject: json.ticket.subject,
        hasEmail: !!json.ticket.requesterEmail,
      });
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 ring-4 ring-green-50">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ticket Submitted!</h2>
          <p className="mt-1 text-gray-500">
            Your request has been received by our IT team.
          </p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-8 py-6 text-center shadow-sm">
          <p className="text-sm font-medium text-blue-600">Your Ticket ID</p>
          <p className="mt-1 text-4xl font-black tracking-wider text-blue-800">
            {success.ticketNumber}
          </p>
          <p className="mt-2 text-sm text-blue-600/80 italic">
            &ldquo;{success.subject}&rdquo;
          </p>
          <p className="mt-3 text-xs text-blue-500">
            Please save this ticket ID for future reference.
          </p>
          {success.hasEmail && (
            <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-blue-100 px-3 py-2">
              <Mail className="h-3.5 w-3.5 text-blue-600" />
              <p className="text-xs font-medium text-blue-700">
                You&apos;ll receive email updates when the status changes.
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setSuccess(null)}
          className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-800 active:scale-95 transition-all"
        >
          Submit Another Ticket
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      {/* Row 1: Name + Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("requesterName")}
            placeholder="e.g. Ahmad bin Ismail"
            className={cn(inputBase, errors.requesterName && inputError)}
          />
          {errors.requesterName && (
            <p className={errorText}>{errors.requesterName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            Email Address
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-500">Optional</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              {...register("requesterEmail")}
              type="email"
              placeholder="e.g. ahmad@company.com"
              className={cn(inputBase, "pl-10", errors.requesterEmail && inputError)}
            />
          </div>
          {errors.requesterEmail ? (
            <p className={errorText}>{errors.requesterEmail.message as string}</p>
          ) : (
            <p className="text-xs text-gray-400">
              Provide your email to receive status update notifications.
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Department */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-semibold text-gray-700">
            Department <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register("department")}
              className={cn(inputBase, selectPadding, errors.department && inputError)}
            >
              <option value="">Select department...</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.department && (
            <p className={errorText}>{errors.department.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Category + Priority */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Issue Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register("category")}
              className={cn(inputBase, selectPadding, errors.category && inputError)}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.category && (
            <p className={errorText}>{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Priority Level <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register("priority")}
              className={cn(inputBase, selectPadding, errors.priority && inputError)}
            >
              <option value="">Select priority...</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
          {errors.priority && (
            <p className={errorText}>{errors.priority.message}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">
          Issue Subject <span className="text-red-500">*</span>
        </label>
        <input
          {...register("subject")}
          placeholder="e.g. Cannot access shared drive on floor 3"
          className={cn(inputBase, errors.subject && inputError)}
        />
        {errors.subject && (
          <p className={errorText}>{errors.subject.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">
          Detailed Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description")}
          rows={5}
          placeholder="Please describe the issue in detail. Include when it started, steps to reproduce, and any error messages you see..."
          className={cn(inputBase, "resize-none", errors.description && inputError)}
        />
        {errors.description && (
          <p className={errorText}>{errors.description.message}</p>
        )}
      </div>

      {/* Priority hint */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-xs font-medium text-amber-800">
          💡 Priority Guide: Use <strong>Urgent</strong> only for complete system
          outages affecting business operations. Use <strong>Low</strong> for
          minor issues that don&apos;t block your work.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/30 transition-all hover:from-blue-800 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-700/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Ticket className="h-4 w-4" />
            Submit Ticket
          </>
        )}
      </button>
    </form>
  );
}

// Reusable style constants
const inputBase =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none ring-0 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300";
const selectPadding = "appearance-none pr-10";
const inputError = "border-red-300 focus:border-red-500 focus:ring-red-500/20";
const errorText = "text-xs font-medium text-red-500 flex items-center gap-1";
