import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MonitorSmartphone, Building2, User, Ticket, CheckCircle2, Clock, Printer, ShieldCheck, Laptop, Info, Package, History, FileText, Settings, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import StatusUpdater from "./StatusUpdater";
import { EditAssetDialog } from "@/components/EditAssetDialog";
import { DeleteAssetButton } from "@/components/DeleteAssetButton";

export const dynamic = "force-dynamic";

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      issues: {
        orderBy: { dateReported: "desc" },
      },
      logs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!asset) notFound();

  // Combine logs and issues for a unified timeline
  const timelineItems = [
    ...asset.logs.map(log => ({
      id: log.id,
      type: 'log',
      title: log.action,
      details: log.details,
      date: log.createdAt,
      icon: <Settings className="h-4 w-4" />,
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    })),
    ...asset.issues.map(issue => ({
      id: issue.id,
      type: 'issue',
      title: issue.ticketNumber ? `Issue: ${issue.ticketNumber}` : 'Maintenance Issue',
      details: issue.issueDescription,
      date: issue.dateReported,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: issue.status === 'Resolved' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50">
      <div className="mx-auto max-w-7xl p-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="space-y-1">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-3 w-3" />
              Inventory Overview
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{asset.name}</h1>
              <Badge className="bg-white border-gray-200 text-gray-500 font-mono px-2 py-0">
                {asset.assetTag}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <EditAssetDialog asset={asset} />
            <DeleteAssetButton assetId={asset.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Identity & Basic Specs */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex gap-8">
                <div className="shrink-0 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50 shadow-inner">
                  {asset.qrCodeUrl ? (
                    <img src={asset.qrCodeUrl} alt="QR" className="h-24 w-24 object-contain mix-blend-multiply" />
                  ) : (
                    <MonitorSmartphone className="h-24 w-24 text-blue-200" />
                  )}
                </div>
                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Make / Model</p>
                      <p className="text-sm font-bold text-gray-800">{asset.brand || '—'} / {asset.model || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Category</p>
                      <div className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-blue-500" />
                        <p className="text-sm font-bold text-gray-800">{asset.category}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Serial Number</p>
                      <code className="text-xs font-mono font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        {asset.serialNumber || 'N/A'}
                      </code>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Technical Configuration</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {asset.specs || "No technical specifications provided for this asset."}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50/30 p-6 flex items-start gap-4">
                <FileText className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Internal Administration Notes</p>
                  <p className="text-sm text-amber-900/70 italic leading-relaxed">
                    {asset.notes || "Add administrative notes via the edit menu to track internal maintenance preferences or special handling instructions."}
                  </p>
                </div>
              </div>
            </div>

            {/* Unified Activity Timeline */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <History className="h-5 w-5 text-blue-600" />
                  Asset Activity Lifecycle
                </h2>
                <Badge variant="outline" className="font-bold text-[10px]">
                  {timelineItems.length} Events
                </Badge>
              </div>

              <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-gray-200 before:via-gray-200 before:to-transparent">
                {timelineItems.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-3">
                    <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                      <Clock className="h-6 w-6" />
                    </div>
                    <p className="text-gray-500 font-medium">No activity recorded for this asset yet.</p>
                  </div>
                ) : (
                  timelineItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="relative flex items-start gap-6 group">
                      <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm z-10 ${item.color} bg-white transition-transform group-hover:scale-110`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-100 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-sm font-black text-gray-900">{item.title}</h3>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            {format(new Date(item.date), "MMM d, HH:mm")}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{item.details}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Status Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Live Status Picker</p>
                <StatusUpdater assetId={asset.id} currentStatus={asset.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-400 mb-1">Health Score</p>
                  <p className={`text-2xl font-black ${asset.issueCount > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                    {asset.issueCount === 0 ? '100' : Math.max(100 - (asset.issueCount * 15), 0)}%
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-400 mb-1">Issues</p>
                  <p className="text-2xl font-black text-gray-900">{asset.issueCount}</p>
                </div>
              </div>
            </div>

            {/* Logistics Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  Logistics & Support
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Assignment</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-700">{asset.assignedUser || "Stock/Unassigned"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Department</p>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-700">{asset.department}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-50 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">Invoice / Receipt</span>
                    <span className="font-bold text-gray-700">{asset.invoiceNumber || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">Purchase Date</span>
                    <span className="font-bold text-gray-700">{asset.purchaseDate ? format(new Date(asset.purchaseDate), "MMM d, yyyy") : "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-medium">Warranty Ends</span>
                    <span className={`font-bold ${asset.warrantyEnd && new Date(asset.warrantyEnd) < new Date() ? 'text-red-500' : 'text-gray-700'}`}>
                      {asset.warrantyEnd ? format(new Date(asset.warrantyEnd), "MMM d, yyyy") : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Administrative Info */}
            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200">
              <div className="flex items-center gap-2 mb-4 opacity-80">
                <Info className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Metadata Sync</span>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="opacity-70">Last Modified</span>
                  <span className="font-bold">{format(new Date(asset.updatedAt), "MMM d, HH:mm")}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="opacity-70">Entry Created</span>
                  <span className="font-bold">{format(new Date(asset.createdAt), "MMM d, yyyy")}</span>
                </div>
              </div>
              <Link href={`/print?ids=${asset.id}`} className="block">
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold uppercase tracking-widest text-[10px] h-10 border-0 shadow-lg active:scale-95 transition-all">
                  <Printer className="h-4 w-4 mr-2" />
                  Generate Physical Label
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

