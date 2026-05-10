"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteAsset } from "@/app/actions";
import { useRouter } from "next/navigation";

export function DeleteAssetButton({ assetId }: { assetId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this asset? This will also delete all associated issue records.")) return;
    
    setLoading(true);
    await deleteAsset(assetId);
    router.push("/");
  }

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      className="flex items-center gap-2" 
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      Delete Asset
    </Button>
  );
}
