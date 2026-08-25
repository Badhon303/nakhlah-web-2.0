"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";

export default function PurchaseBlockedModal({
  open,
  onOpenChange,
  title = "Not Available",
  message = "This feature is blocked in this environment.",
  mood = "thinking",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:rounded-3xl border-2 border-border p-0 overflow-hidden max-w-md">
        <div className="relative bg-gradient-to-br from-amber-50 via-background to-background dark:from-amber-950/40 dark:via-background dark:to-background p-6 pb-0 text-center">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center -mb-10 mt-4">
            <FreshDateMascot mood={mood} size="xxl" />
          </div>
        </div>

        <div className="pt-12 px-6 pb-8 bg-background text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
