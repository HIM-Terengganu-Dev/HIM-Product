import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MonitorSmartphone, Calendar, Building2, User, Ticket, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import StatusUpdater from "./StatusUpdater";

export default async function AssetDetailPage({ params }: { params: { id: string } }) {
  const asset = await prisma.asset.findUnique({
    where: { id: params.id },
    include: {
      issues: {
        orderBy: { dateReported: "desc" },
      },
    },
  });

  if (!asset) notFound();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Link>

        {/* Header Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex gap-6">
              {asset.qrCodeUrl ? (
                <div className="shrink-0 p-2 border border-gray-100 rounded-xl bg-gray-50">
                  <img src={asset.qrCodeUrl} alt="QR Code" className="h-24 w-24 object-contain" />
                </div>
              ) : (
                <div className="shrink-0 h-24 w-24 flex items-center justify-center bg-gray-100 rounded-xl">
                  <MonitorSmartphone className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black text-gray-900">{asset.name}</h1>
                  <Badge variant="outline" className="uppercase tracking-wider font-bold">
                    {asset.assetTag}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    {asset.department}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <User className="h-4 w-4 text-gray-400" />
                    {asset.assignedUser || <span className="italic text-gray-400">Unassigned</span>}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    Added {format(new Date(asset.purchaseDate), "MMM d, yyyy")}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 min-w-[200px]">
              {/* Client Component for Updating Status */}
              <StatusUpdater assetId={asset.id} currentStatus={asset.status} />
              
              <div className="text-right mt-2">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Issue Health</p>
                {asset.issueCount === 0 ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">0 Issues Logged</Badge>
                ) : (
                  <Badge variant={asset.issueCount >= 3 ? "destructive" : "secondary"}>
                    {asset.issueCount} Issues Logged
                  </Badge>
                )}
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
