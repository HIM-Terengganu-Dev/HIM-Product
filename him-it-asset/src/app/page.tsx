import { getAssets } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssetTable } from "@/components/AssetTable";
import { AlertCircle, MonitorSmartphone } from "lucide-react";
import { CreateAssetDialog } from "@/components/CreateAssetDialog";

export default async function AssetDashboard() {
  const assets = await getAssets();

  const criticalAssets = assets.filter((a) => a.issueCount >= 3);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
              <MonitorSmartphone className="h-8 w-8 text-blue-600" />
              IT Asset Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage physical assets and track hardware health via smart QR codes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CreateAssetDialog />
          </div>
        </div>

        {/* Critical Alerts Widget */}
        {criticalAssets.length > 0 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-red-800 mb-3">
              <AlertCircle className="h-5 w-5" />
              <h2 className="font-bold">Critical Assets (3+ Issues)</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {criticalAssets.map((asset) => (
                <div key={asset.id} className="bg-white rounded-lg border border-red-100 px-3 py-2 text-sm">
                  <span className="font-bold text-gray-900">{asset.assetTag}</span> — {asset.name} 
                  <Badge variant="destructive" className="ml-2">{asset.issueCount} Issues</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <AssetTable assets={assets} />
      </div>
    </div>
  );
}
