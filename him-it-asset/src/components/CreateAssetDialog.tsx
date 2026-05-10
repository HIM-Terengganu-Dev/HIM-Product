"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { createAsset } from "@/app/actions";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function CreateAssetDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createAsset(formData);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ variant: "default" }), "flex items-center gap-2")}>
        <Plus className="h-4 w-4" />
        Add Asset
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name/Display Name</Label>
              <Input id="name" name="name" placeholder="e.g. CEO Laptop" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
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
              <Input id="brand" name="brand" placeholder="e.g. Dell, Apple" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" placeholder="e.g. XPS 15, MacBook Pro" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input id="serialNumber" name="serialNumber" placeholder="Unique S/N" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice / Receipt Num</Label>
              <Input id="invoiceNumber" name="invoiceNumber" placeholder="INV-2024-001" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Asset Condition</Label>
              <select
                id="condition"
                name="condition"
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
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Date of Purchase</Label>
              <Input id="purchaseDate" name="purchaseDate" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specs">Specifications</Label>
            <Textarea id="specs" name="specs" placeholder="RAM, CPU, Storage details..." rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes (Optional)</Label>
            <Textarea id="notes" name="notes" placeholder="Any additional internal comments..." rows={2} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department / Location</Label>
              <Input id="department" name="department" placeholder="e.g. IT, HR, Floor 2" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedUser">Assigned User (Optional)</Label>
              <Input id="assignedUser" name="assignedUser" placeholder="e.g. Ahmad Ismail" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty Duration</Label>
              <Input id="warranty" name="warranty" placeholder="e.g. 3 Years" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warrantyEnd">Warranty Ended</Label>
              <Input id="warrantyEnd" name="warrantyEnd" type="date" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save & Generate QR Code
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
