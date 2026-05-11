"use client";

import { useState, useEffect } from "react";
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
import { Settings, Plus, Trash2, Loader2, Tag } from "lucide-react";
import { getAssetCategories, addAssetCategory, deleteAssetCategory } from "@/app/actions";
import { cn } from "@/lib/utils";

export function CategoryManager() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchCategories() {
    const cats = await getAssetCategories();
    setCategories(cats);
  }

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  async function handleAdd() {
    if (!newCategory.trim()) return;
    setLoading(true);
    await addAssetCategory(newCategory.trim());
    setNewCategory("");
    await fetchCategories();
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure? This will remove the category from the list. Existing assets with this category will keep their label but won't be linked to this dynamic item.")) return;
    setLoading(true);
    await deleteAssetCategory(id);
    await fetchCategories();
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="flex items-center gap-2" />}>
        <Settings className="h-4 w-4" />
        Categories
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-600" />
            Manage Asset Categories
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="newCategory">New Category Name</Label>
              <Input 
                id="newCategory" 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Tablets, Server" 
              />
            </div>
            <Button onClick={handleAdd} disabled={loading || !newCategory.trim()} className="h-10">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>

          <div className="border rounded-2xl overflow-hidden bg-slate-50/50">
            <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
              {categories.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm italic">
                  No categories defined yet.
                </div>
              ) : (
                categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors group">
                    <span className="font-semibold text-gray-700 text-sm px-2">{cat.name}</span>
                    <Button 
                      variant="ghost" 
                      size="icon-xs" 
                      onClick={() => handleDelete(cat.id)}
                      className="text-gray-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                      disabled={loading}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <p className="text-[10px] text-gray-400 text-center font-medium">
            Note: Deleting a category does not remove it from assets already assigned to it.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
