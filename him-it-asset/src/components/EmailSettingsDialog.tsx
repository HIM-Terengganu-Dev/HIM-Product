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
import { Textarea } from "@/components/ui/textarea";
import { Mail, Loader2, Save } from "lucide-react";
import { getEmailTemplate, updateEmailTemplate } from "@/app/actions";
import { cn } from "@/lib/utils";

export function EmailSettingsDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<{ subject: string; body: string } | null>(null);

  useEffect(() => {
    if (open) {
      getEmailTemplate().then(setTemplate);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await updateEmailTemplate(formData);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex items-center gap-2")}>
        <Mail className="h-4 w-4 text-purple-600" />
        Email Settings
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-purple-600" />
            Declaration Email Template
          </DialogTitle>
        </DialogHeader>

        {!template ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input 
                id="subject" 
                name="subject" 
                defaultValue={template.subject} 
                required 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <Label htmlFor="body">Email Body</Label>
              </div>
              <Textarea 
                id="body" 
                name="body" 
                defaultValue={template.body} 
                rows={10} 
                className="font-mono text-sm leading-relaxed"
                required 
              />
              <div className="bg-slate-50 p-3 rounded-lg border text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-900 mb-2">Available Variables:</p>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <span>{`{{userName}}`}</span>
                  <span>{`{{assetName}}`}</span>
                  <span>{`{{assetTag}}`}</span>
                  <span>{`{{serialNumber}}`}</span>
                  <span>{`{{model}}`}</span>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Template
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
