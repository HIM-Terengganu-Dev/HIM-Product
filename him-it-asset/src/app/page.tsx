import { getAssets } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssetTable } from "@/components/AssetTable";
import { AlertCircle, MonitorSmartphone, Package, Wrench, CheckCircle2, User } from "lucide-react";
import { CreateAssetDialog } from "@/components/CreateAssetDialog";
import { CategoryManager } from "@/components/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AssetDashboard() {
  const assets = await getAssets();

  const criticalAssets = assets.filter((a) => a.issueCount >= 3);
  
  const stats = [
    { label: "Total Assets", value: assets.length, icon: <Package className="h-5 w-5" />, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "Currently In Repair", value: assets.filter(a => a.status === 'InRepair').length, icon: <Wrench className="h-5 w-5" />, color: "bg-amber-50 text-amber-600 border-amber-100" },
    { label: "Ready for Assign", value: assets.filter(a => a.status === 'Available').length, icon: <CheckCircle2 className="h-5 w-5" />, color: "bg-green-50 text-green-600 border-green-100" },
    { label: "Active Deployments", value: assets.filter(a => a.status === 'Assigned').length, icon: <User className="h-5 w-5" />, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="mx-auto max-w-7xl space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <MonitorSmartphone className="h-10 w-10 text-blue-600" />
              IT Infrastructure
            </h1>
            <p className="text-gray-500 font-medium">
              Monitor, track, and maintain organization-wide hardware assets.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CategoryManager />
            <CreateAssetDialog />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className={`p-6 rounded-3xl border shadow-sm flex items-center gap-4 bg-white`}>
              <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Critical Alerts Widget */}
        {criticalAssets.length > 0 && (
          <div className="rounded-3xl border border-red-100 bg-red-50/30 p-6">
            <div className="flex items-center gap-2 text-red-700 mb-4">
              <AlertCircle className="h-5 w-5" />
              <h2 className="text-lg font-black tracking-tight">Critical Hardware Attention Required</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {criticalAssets.map((asset) => (
                <div key={asset.id} className="bg-white rounded-2xl border border-red-100 p-3 shadow-sm flex items-center gap-3 pr-4">
                  <div className="bg-red-50 h-8 w-8 rounded-xl flex items-center justify-center font-bold text-red-600 text-xs">
                    {asset.issueCount}
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">{asset.assetTag}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{asset.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-2">
          <AssetTable assets={assets} />
        </div>
      </div>
    </div>
  );
}
