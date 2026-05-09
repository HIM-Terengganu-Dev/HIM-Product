import { getAssets } from "../actions";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { PrintButton } from "@/components/PrintButton";

export default async function PrintAssetsPage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const { ids } = await searchParams;
  let assets = await getAssets();

  if (ids) {
    const selectedIds = ids.split(",");
    assets = assets.filter(asset => selectedIds.includes(asset.id));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Non-printable Header */}
      <div className="no-print border-b border-gray-200 bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              {assets.length} labels generated
            </p>
            <PrintButton />
          </div>
        </div>
      </div>

      {/* Printable Area */}
      <div id="printable-grid" className="mx-auto bg-white" style={{ width: '210mm', padding: '10mm' }}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
          {assets.map((asset, index) => {
            // Apply a page break after every 24 items (3 cols x 8 rows)
            const isPageBreak = (index + 1) % 24 === 0;

            return (
              <div 
                key={asset.id} 
                className={`flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg text-center ${isPageBreak ? 'label-page-break' : ''}`}
              >
                {asset.qrCodeUrl ? (
                  <img src={asset.qrCodeUrl} alt="QR Code" className="w-24 h-24 object-contain" />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">No QR</div>
                )}
                <div className="mt-2 text-sm font-black text-gray-900 tracking-wider">
                  {asset.assetTag}
                </div>
                <div className="text-[10px] text-gray-500 line-clamp-1 w-full max-w-full px-2">
                  {asset.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
