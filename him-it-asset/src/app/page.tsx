import { getAssets } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Printer, Plus, AlertCircle, MonitorSmartphone } from "lucide-react";
import Link from "next/link";
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
            <Link href="/print">
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print A4 Labels
              </Button>
            </Link>
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

        {/* Asset Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Asset Tag</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Issues</TableHead>
                <TableHead className="text-right">QR Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                    No assets found. Click "Add Asset" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.assetTag}</TableCell>
                    <TableCell>
                      <p className="font-semibold text-gray-900">{asset.name}</p>
                      <p className="text-xs text-gray-500">{asset.department}</p>
                    </TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell>{asset.assignedUser || <span className="text-gray-400 italic">Unassigned</span>}</TableCell>
                    <TableCell>
                      <Badge className={asset.status === "Available" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-blue-100 text-blue-800 hover:bg-blue-100"} variant="secondary">
                        {asset.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={asset.issueCount >= 3 ? "destructive" : "secondary"}>
                        {asset.issueCount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {asset.qrCodeUrl && (
                        <img src={asset.qrCodeUrl} alt="QR Code" className="w-8 h-8 ml-auto rounded border border-gray-200" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
