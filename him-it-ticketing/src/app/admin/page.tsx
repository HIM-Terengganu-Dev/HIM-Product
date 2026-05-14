"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Ticket } from "@/types";
import TicketTable from "@/components/TicketTable";
import TicketDetailModal from "@/components/TicketDetailModal";
import {
  LayoutDashboard,
  Ticket as TicketIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  XCircle,
} from "lucide-react";

interface Stats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  urgent: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tickets");
      if (!res.ok) throw new Error("Failed to load tickets");
      const json = await res.json();
      setTickets(json.tickets);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTickets();
    }
  }, [status, fetchTickets]);

  const handleStatusChange = async (id: string, updates: { status?: string, personInCharge?: string, adminDescription?: string, actionTaken?: string }) => {
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
      const json = await res.json();
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...json.ticket } : t))
      );
      if (selectedTicket?.id === id) {
        setSelectedTicket((prev) =>
          prev ? { ...prev, ...json.ticket } : null
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }
    try {
      await fetch(`/api/tickets/${id}`, { method: "DELETE" });
      setTickets((prev) => prev.filter((t) => t.id !== id));
      if (selectedTicket?.id === id) setSelectedTicket(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Stats calculation
  const stats: Stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "InProgress").length,
    resolved: tickets.filter(
      (t) => t.status === "Resolved" || t.status === "Closed"
    ).length,
    urgent: tickets.filter((t) => t.priority === "Urgent").length,
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-blue-50/20 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="h-5 w-5 text-blue-600" />
              <h1 className="text-2xl font-black text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-sm text-gray-500">
              Welcome back,{" "}
              <span className="font-semibold text-gray-700">
                {session?.user?.name}
              </span>
              . Manage all IT support tickets here.
            </p>
          </div>
          <div className="text-xs text-gray-400 text-right">
            Last refreshed: {new Date().toLocaleTimeString("en-MY")}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <StatCard
            label="Total Tickets"
            value={stats.total}
            icon={TicketIcon}
            color="blue"
          />
          <StatCard
            label="Open"
            value={stats.open}
            icon={TicketIcon}
            color="sky"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={Clock}
            color="purple"
          />
          <StatCard
            label="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            label="Urgent"
            value={stats.urgent}
            icon={AlertTriangle}
            color="red"
            highlight={stats.urgent > 0}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <XCircle className="h-5 w-5 shrink-0 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchTickets}
              className="ml-auto text-sm font-semibold text-red-700 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Delete confirm banner */}
        {deleteConfirm && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-amber-800 font-medium">
              Click Delete again to confirm permanent deletion.
            </p>
          </div>
        )}

        {/* Ticket Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-gray-400">Loading tickets...</p>
            </div>
          </div>
        ) : (
          <TicketTable
            tickets={tickets}
            onRefresh={fetchTickets}
            onView={setSelectedTicket}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            loading={loading}
          />
        )}
      </div>

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  highlight = false,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  highlight?: boolean;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500 text-blue-600 bg-blue-50 border-blue-100",
    sky: "bg-sky-500 text-sky-600 bg-sky-50 border-sky-100",
    purple: "bg-purple-500 text-purple-600 bg-purple-50 border-purple-100",
    green: "bg-green-500 text-green-600 bg-green-50 border-green-100",
    red: "bg-red-500 text-red-600 bg-red-50 border-red-200",
  };
  const parts = (colorMap[color] ?? colorMap.blue).split(" ");
  const [iconBg, textColor, cardBg, cardBorder] = parts;

  return (
    <div
      className={`rounded-2xl border ${cardBorder} ${cardBg} p-4 shadow-sm ${
        highlight ? "ring-2 ring-red-400/30 animate-pulse" : ""
      }`}
    >
      <div
        className={`mb-3 flex h-8 w-8 items-center justify-center rounded-xl ${iconBg}`}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>
      <p className={`text-2xl font-black ${textColor}`}>{value}</p>
      <p className="text-xs font-medium text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
