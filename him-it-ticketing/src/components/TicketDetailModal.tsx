"use client";

import { Ticket, STATUS_CONFIG, STATUSES } from "@/types";
import { PriorityBadge, StatusBadge } from "./TicketBadge";
import { formatDate } from "@/lib/utils";
import { X, Clock, User, Building2, Tag, FileText, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function TicketDetailModal({
  ticket,
  onClose,
  onStatusChange,
}: TicketDetailModalProps) {
  if (!ticket) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-blue-950 to-blue-800 px-6 py-4">
          <div>
            <p className="text-xs font-medium text-blue-300">Ticket Details</p>
            <p className="text-lg font-black tracking-wider text-white font-mono">
              {ticket.ticketNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
            <span className="rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {ticket.category}
            </span>
          </div>

          {/* Subject */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              {ticket.subject}
            </h2>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-4">
            <MetaItem icon={User} label="Requester" value={ticket.requesterName} />
            <MetaItem icon={Building2} label="Department" value={ticket.department} />
            {ticket.requesterEmail ? (
              <MetaItem icon={Mail} label="Email" value={ticket.requesterEmail} />
            ) : (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 opacity-50">
                <div className="flex items-center gap-1.5 mb-1">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</p>
                </div>
                <p className="text-sm text-gray-400 italic">Not provided — no notifications</p>
              </div>
            )}
            <MetaItem
              icon={Clock}
              label="Submitted"
              value={formatDate(ticket.createdAt)}
            />
            <MetaItem
              icon={Clock}
              label="Last Updated"
              value={formatDate(ticket.updatedAt)}
            />
          </div>

          {/* Description */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Description
              </p>
            </div>
            <p className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Status Update */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4 text-blue-500" />
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Update Status
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map((s) => {
                const cfg = STATUS_CONFIG[s];
                const isActive = ticket.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(ticket.id, s)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all",
                      isActive
                        ? `${cfg.bg} ${cfg.color} ${cfg.border} ring-2 ring-offset-1 ring-current/30`
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    )}
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-50 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3.5 w-3.5 text-gray-400" />
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}
