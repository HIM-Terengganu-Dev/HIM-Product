"use client";
import { useState, useEffect } from "react";
import { Ticket, STATUS_CONFIG, STATUSES } from "@/types";
import { PriorityBadge, StatusBadge } from "./TicketBadge";
import { formatDate } from "@/lib/utils";
import { X, Clock, User, Building2, Tag, FileText, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onStatusChange: (id: string, updates: { status?: string, personInCharge?: string, adminDescription?: string, actionTaken?: string }) => void;
}

export default function TicketDetailModal({
  ticket,
  onClose,
  onStatusChange,
}: TicketDetailModalProps) {
  const [personInCharge, setPersonInCharge] = useState(ticket?.personInCharge || "");
  const [adminDescription, setAdminDescription] = useState(ticket?.adminDescription || "");
  const [actionTaken, setActionTaken] = useState(ticket?.actionTaken || "");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (ticket) {
      setPersonInCharge(ticket.personInCharge || "");
      setAdminDescription(ticket.adminDescription || "");
      setActionTaken(ticket.actionTaken || "");
    }
  }, [ticket]);

  if (!ticket) return null;

  const handleUpdate = async (newStatus?: string) => {
    setIsUpdating(true);
    await onStatusChange(ticket.id, {
      status: newStatus || ticket.status,
      personInCharge,
      adminDescription,
      actionTaken,
    });
    setIsUpdating(false);
  };

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
                <p className="text-sm text-gray-400 italic">Not provided</p>
              </div>
            )}
            {ticket.requesterPhone ? (
              <MetaItem icon={Phone} label="Phone" value={ticket.requesterPhone} />
            ) : (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 opacity-50">
                <div className="flex items-center gap-1.5 mb-1">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</p>
                </div>
                <p className="text-sm text-gray-400 italic">Not provided</p>
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
                User Description
              </p>
            </div>
            <p className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Admin Management Section */}
          <div className="space-y-4 rounded-xl border border-amber-100 bg-amber-50/30 p-4">
            <div className="flex items-center gap-2 border-b border-amber-100 pb-2 mb-2">
              <User className="h-4 w-4 text-amber-600" />
              <p className="text-xs font-black uppercase tracking-widest text-amber-700">Administration Details</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-tighter mb-1">Person in Charge</label>
                <input 
                  type="text"
                  value={personInCharge}
                  onChange={(e) => setPersonInCharge(e.target.value)}
                  placeholder="Technician name..."
                  className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-tighter mb-1">Description of the Problem</label>
                <textarea 
                  value={adminDescription}
                  onChange={(e) => setAdminDescription(e.target.value)}
                  placeholder="Detailed technical analysis..."
                  rows={3}
                  className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-tighter mb-1">Action Taken</label>
                <textarea 
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="Steps taken to resolve..."
                  rows={3}
                  className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
                />
              </div>

              <button 
                onClick={() => handleUpdate()}
                disabled={isUpdating}
                className="w-full rounded-lg bg-amber-600 py-2 text-xs font-bold text-white hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save Admin Details"}
              </button>
            </div>
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
                    disabled={isUpdating}
                    onClick={() => handleUpdate(s)}
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
