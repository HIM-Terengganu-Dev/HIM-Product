import type { Metadata } from "next";
import { Suspense } from "react";
import TicketForm from "@/components/TicketForm";
import { Ticket, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Submit IT Ticket | HIM IT Support",
  description:
    "Report an IT issue to our support team. Fill in the form and receive a ticket number instantly.",
};

const steps = [
  {
    icon: Ticket,
    title: "Submit Your Request",
    desc: "Fill out the form with your issue details.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Clock,
    title: "We Review It",
    desc: "Our IT team will assess and prioritize your ticket.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: CheckCircle,
    title: "Issue Resolved",
    desc: "You'll be notified once the issue is resolved.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
];

export default function SubmitPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-blue-50/30 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 mb-4">
            <AlertCircle className="h-3.5 w-3.5" />
            IT Support Portal
          </div>
          <h1 className="text-4xl font-black text-gray-900 sm:text-5xl">
            Report an IT Issue
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-xl mx-auto">
            Our IT team is ready to help. Submit your request below and we&apos;ll
            get back to you as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Form Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm shadow-gray-200">
            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <Ticket className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  New Support Ticket
                </h2>
                <p className="text-sm text-gray-400">
                  All fields marked with * are required
                </p>
              </div>
            </div>
            <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>}>
              <TicketForm />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* How it works */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${step.bg}`}
                    >
                      <step.icon className={`h-4.5 w-4.5 ${step.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {i + 1}. {step.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority guide */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
                Priority Reference
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "🔴 Urgent",
                    desc: "System down, cannot work at all",
                    c: "text-red-700 bg-red-50 border-red-200",
                  },
                  {
                    label: "🟠 High",
                    desc: "Major function impacted, workaround exists",
                    c: "text-orange-700 bg-orange-50 border-orange-200",
                  },
                  {
                    label: "🟡 Medium",
                    desc: "Degraded performance or partial issue",
                    c: "text-yellow-700 bg-yellow-50 border-yellow-200",
                  },
                  {
                    label: "🟢 Low",
                    desc: "Minor issue, work continues normally",
                    c: "text-green-700 bg-green-50 border-green-200",
                  },
                ].map((p) => (
                  <div
                    key={p.label}
                    className={`rounded-xl border px-3 py-2.5 ${p.c}`}
                  >
                    <p className="text-xs font-bold">{p.label}</p>
                    <p className="text-xs opacity-80 mt-0.5">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-sm text-white">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-200 mb-2">
                Emergency Contact
              </h3>
              <p className="text-xl font-black">IT Hotline</p>
              <p className="text-blue-200 text-sm mt-1">
                For critical outages affecting production:
              </p>
              <p className="mt-2 text-lg font-bold">013-5031360</p>
              <p className="text-xs text-blue-300 mt-3">
                Sat–Thur, 9:00 AM – 4:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
