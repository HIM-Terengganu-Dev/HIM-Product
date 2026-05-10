"use client";

import { useState } from "react";
import { updateAssetStatus } from "@/app/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function StatusUpdater({ assetId, currentStatus }: { assetId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  async function handleStatusChange(value: string | null) {
    if (!value) return;
    setLoading(true);
    setStatus(value);
    await updateAssetStatus(assetId, value);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={handleStatusChange} disabled={loading}>
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Available">Available</SelectItem>
          <SelectItem value="Assigned">Assigned</SelectItem>
          <SelectItem value="InRepair">In Repair</SelectItem>
          <SelectItem value="Retired">Retired</SelectItem>
        </SelectContent>
      </Select>
      {loading && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
    </div>
  );
}
