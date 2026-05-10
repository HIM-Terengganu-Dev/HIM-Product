"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2 } from "lucide-react";
import { updateAsset } from "@/app/actions";
import { format } from "date-fns";

export function EditAssetDialog({ asset }: { asset: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await updateAsset(asset.id, formData);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="flex items-center gap-2" />}>
        <Edit className="h-4 w-4" />
        Edit Asset
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Asset: {asset.assetTag}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name/Display Name</Label>
              <Input id="name" name="name" defaultValue={asset.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                defaultValue={asset.category}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="Laptop">Laptop</option>
                <option value="Desktop">Desktop</option>
                <option value="Monitor">Monitor</option>
                <option value="Network">Network Equipment</option>
                <option value="Accessory">Accessory</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" defaultValue={asset.brand || ""} placeholder="e.g. Dell, Apple" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" defaultValue={asset.model || ""} placeholder="e.g. XPS 15, MacBook Pro" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input id="serialNumber" name="serialNumber" defaultValue={asset.serialNumber || ""} placeholder="Unique S/N" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Asset Condition</Label>
              <select
                id="condition"
                name="condition"
                defaultValue={asset.condition || "New"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="New">New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
                <option value="Broken">Broken</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specs">Specifications</Label>
            <Textarea id="specs" name="specs" defaultValue={asset.specs || ""} placeholder="RAM, CPU, Storage details..." rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes (Optional)</Label>
            <Textarea id="notes" name="notes" defaultValue={asset.notes || ""} placeholder="Any additional internal comments..." rows={2} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department / Location</Label>
              <Input id="department" name="department" defaultValue={asset.department} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedUser">Assigned User (Optional)</Label>
              <Input id="assignedUser" name="assignedUser" defaultValue={asset.assignedUser || ""} placeholder="e.g. Ahmad Ismail" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Asset Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={asset.status}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="InRepair">In Repair</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Date of Purchase</Label>
              <Input 
                id="purchaseDate" 
                name="purchaseDate" 
                type="date" 
                defaultValue={asset.purchaseDate ? format(new Date(asset.purchaseDate), "yyyy-MM-dd") : ""} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty Duration</Label>
              <Input id="warranty" name="warranty" defaultValue={asset.warranty || ""} placeholder="e.g. 3 Years" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warrantyEnd">Warranty Ended</Label>
              <Input 
                id="warrantyEnd" 
                name="warrantyEnd" 
                type="date" 
                defaultValue={asset.warrantyEnd ? format(new Date(asset.warrantyEnd), "yyyy-MM-dd") : ""} 
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Update Asset Details
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
