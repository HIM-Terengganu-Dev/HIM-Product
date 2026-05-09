"use client";

import { useState, useCallback } from "react";
import { Ticket, STATUS_CONFIG, STATUSES, PRIORITIES, CATEGORIES } from "@/types";
import { PriorityBadge, StatusBadge } from "./TicketBadge";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SortField = "ticketNumber" | "createdAt" | "priority" | "status";
type SortDir = "asc" | "desc";

interface TicketTableProps {
  tickets: Ticket[];
  onRefresh: () => void;
  onView: (ticket: Ticket) => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export default function TicketTable({
  tickets,
  onRefresh,
  onView,
  onStatusChange,
  onDelete,
  loading,
}: TicketTableProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-blue-600" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-blue-600" />
    );
  };

  const filtered = useCallback(() => {
    return tickets
      .filter((t) => {
        const q = search.toLowerCase();
        const matchSearch =
          !search ||
          t.ticketNumber.toLowerCase().includes(q) ||
          t.requesterName.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.department.toLowerCase().includes(q);
        const matchStatus =
          filterStatus === "all" || t.status === filterStatus;
        const matchPriority =
          filterPriority === "all" || t.priority === filterPriority;
        const matchCategory =
          filterCategory === "all" || t.category === filterCategory;
        return matchSearch && matchStatus && matchPriority && matchCategory;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === "ticketNumber") {
          cmp = a.ticketNumber.localeCompare(b.ticketNumber);
        } else if (sortField === "createdAt") {
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortField === "priority") {
          const order = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
          cmp = order[a.priority] - order[b.priority];
        } else if (sortField === "status") {
          cmp = a.status.localeCompare(b.status);
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [tickets, search, filterStatus, filterPriority, filterCategory, sortField, sortDir]);

  const rows = filtered();

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket ID, name, subject..."
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none rounded-xl border border-gray-200 bg-white pl-9 pr-8 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {/* Priority Filter */}
        <div className="relative">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-8 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="all">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-8 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{rows.length}</span>{" "}
          of <span className="font-semibold text-gray-900">{tickets.length}</span> tickets
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/80">
              <tr>
                <th
                  onClick={() => handleSort("ticketNumber")}
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700"
                >
                  <div className="flex items-center gap-1">
                    Ticket # <SortIcon field="ticketNumber" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Requester
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Category
                </th>
                <th
                  onClick={() => handleSort("priority")}
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700"
                >
                  <div className="flex items-center gap-1">
                    Priority <SortIcon field="priority" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700"
                >
                  <div className="flex items-center gap-1">
                    Status <SortIcon field="status" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("createdAt")}
                  className="hidden lg:table-cell cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700"
                >
                  <div className="flex items-center gap-1">
                    Submitted <SortIcon field="createdAt" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                        <Search className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">
                        No tickets found
                      </p>
                      <p className="text-xs text-gray-400">
                        Try adjusting your filters or search query
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="group hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-sm font-bold text-blue-700">
                        {ticket.ticketNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {ticket.requesterName}
                        </p>
                        <p className="text-xs text-gray-400">{ticket.department}</p>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3.5">
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {ticket.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={ticket.status} />
                        <select
                          value={ticket.status}
                          onChange={(e) => onStatusChange(ticket.id, e.target.value)}
                          className="hidden group-hover:block appearance-none rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_CONFIG[s].label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3.5 text-xs text-gray-400">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView(ticket)}
                          className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => onDelete(ticket.id)}
                          className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
                          title="Delete ticket"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
