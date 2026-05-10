import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MonitorSmartphone, Building2, User, Ticket, CheckCircle2, Clock, Printer, ShieldCheck, Laptop, Info, Package } from "lucide-react";
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
    },
  });

  if (!asset) notFound();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Inventory
          </Link>
          <div className="flex items-center gap-2">
            <EditAssetDialog asset={asset} />
            <DeleteAssetButton assetId={asset.id} />
          </div>
        </div>

        {/* Main Info Card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="flex gap-8 items-start">
                {asset.qrCodeUrl ? (
                  <div className="shrink-0 p-3 border-2 border-blue-50 rounded-2xl bg-white shadow-sm">
                    <img src={asset.qrCodeUrl} alt="QR Code" className="h-32 w-32 object-contain" />
                  </div>
                ) : (
                  <div className="shrink-0 h-32 w-32 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl">
                    <MonitorSmartphone className="h-10 w-10 text-gray-300" />
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-3xl font-black text-gray-900 leading-none">{asset.name}</h1>
                      <Badge variant="secondary" className="uppercase tracking-widest px-2.5 py-0.5 text-xs font-bold">
                        {asset.assetTag}
                      </Badge>
                    </div>
                    <p className="text-lg text-gray-500 font-medium">{asset.brand} {asset.model}</p>
                  </div>

                  <div className="flex flex-wrap gap-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <Building2 className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">{asset.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <User className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">{asset.assignedUser || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <Package className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">{asset.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4 min-w-[220px]">
                <div className="space-y-1.5 text-right w-full">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Lifecycle Status</label>
                  <StatusUpdater assetId={asset.id} currentStatus={asset.status} />
                </div>
                
                <div className="text-right bg-slate-50 p-4 rounded-xl border border-slate-100 w-full">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Health Metric</p>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-gray-900">{asset.issueCount}</span>
                    <p className="text-[10px] font-medium text-gray-500">Reported Issues</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Technical Specs */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                <Laptop className="h-4 w-4 text-blue-600" />
                Technical Specifications
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Serial Number</span>
                  <span className="font-mono font-bold text-gray-900">{asset.serialNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Physical Condition</span>
                  <Badge variant="outline" className="text-[10px] h-5">{asset.condition || "N/A"}</Badge>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Configuration Details</span>
                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100 min-h-[60px]">
                    {asset.specs || "No additional configuration notes."}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial & Warranty */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                Warranty & Support
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Coverage Duration</span>
                  <span className="font-bold text-gray-900">{asset.warranty || "N/A"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Support Ended</span>
                  <span className="font-bold text-gray-900">
                    {asset.warrantyEnd ? format(new Date(asset.warrantyEnd), "MMM d, yyyy") : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Purchase Date</span>
                  <span className="font-bold text-gray-900">
                    {format(new Date(asset.purchaseDate), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions / Misc */}
            <div className="p-6 space-y-4 bg-gray-50/30">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                <Info className="h-4 w-4 text-blue-600" />
                Administrative Info
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Last Database Sync</span>
                  <span className="text-gray-600">{format(new Date(asset.updatedAt), "MMM d, HH:mm")}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Asset Registered</span>
                  <span className="text-gray-600">{format(new Date(asset.createdAt), "MMM d, yyyy")}</span>
                </div>
                <div className="pt-2">
                  <Link href={`/print?ids=${asset.id}`} className="w-full block">
                    <Button variant="outline" className="w-full text-[10px] h-8 font-bold uppercase tracking-wider">
                      <Printer className="h-3 w-3 mr-2" />
                      Print Single Label
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Issue History Log */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center gap-3">
            <Ticket className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-bold text-gray-900">Maintenance & Issue History</h2>
          </div>
          
          <div className="p-0">
            {asset.issues.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <CheckCircle2 className="h-8 w-8 mx-auto text-green-400 mb-3" />
                <p>No issues have ever been reported for this asset.</p>
                <p className="text-sm">Hardware is in perfect condition.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {asset.issues.map((issue) => (
                  <div key={issue.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row gap-4 justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-gray-900">
                          {issue.ticketNumber ? (
                            <span className="text-blue-600 hover:underline cursor-pointer">{issue.ticketNumber}</span>
                          ) : (
                            "Manual Entry"
                          )}
                        </span>
                        <Badge variant="outline" className={issue.status === "Resolved" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                          {issue.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mt-2">{issue.issueDescription}</p>
                      <p className="text-sm text-gray-400 mt-2">Reported by: <span className="font-medium text-gray-600">{issue.reportedBy}</span></p>
                    </div>
                    
                    <div className="text-sm text-gray-500 flex items-center gap-1.5 whitespace-nowrap shrink-0">
                      <Clock className="h-4 w-4" />
                      {format(new Date(issue.dateReported), "MMM d, yyyy h:mm a")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
