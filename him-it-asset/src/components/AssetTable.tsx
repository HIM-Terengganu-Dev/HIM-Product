"use client";

import { useState } from "react";
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
import { Printer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AssetTable({ assets }: { assets: any[] }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(assets.map(a => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    if (selectedIds.length === 0) return;
    router.push(`/print?ids=${selectedIds.join(",")}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={handlePrint}
          disabled={selectedIds.length === 0}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print Selected ({selectedIds.length})
        </Button>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-12 text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  checked={selectedIds.length === assets.length && assets.length > 0}
                  onChange={handleSelectAll}
                />
              </TableHead>
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
                <TableCell colSpan={8} className="h-32 text-center text-gray-500">
                  No assets found. Click "Add Asset" to get started.
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="text-center">
                    <input 
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedIds.includes(asset.id)}
                      onChange={() => handleSelect(asset.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/asset/${asset.id}`} className="text-blue-600 hover:underline">
                      {asset.assetTag}
                    </Link>
                  </TableCell>
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
  );
}
