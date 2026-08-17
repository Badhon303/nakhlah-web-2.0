"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsDesktop } from "@/hooks/use-desktop";
import { cn } from "@/lib/utils";

const toneStyles = {
  destructive: {
    badge: "bg-destructive/10 text-destructive dark:bg-destructive/20",
    confirm: "bg-destructive text-destructive-foreground hover:brightness-110",
  },
  accent: {
    badge: "bg-accent/10 text-accent dark:bg-accent/20",
    confirm: "bg-accent text-accent-foreground hover:brightness-110",
  },
};

/**
 * Consent/confirmation prompt (exit app, logout, ...).
 *
 * On phones and tablets it renders as a drag-dismissable bottom sheet that
 * clears the safe area, which reads far better than a centred modal on a small
 * screen. On desktop (lg and up) it keeps the regular centred alert dialog.
 */
export function ConfirmPrompt({
  open,
  onOpenChange,
  icon: Icon,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isPending = false,
  tone = "destructive",
}) {
  const isDesktop = useIsDesktop();
  const tokens = toneStyles[tone] || toneStyles.destructive;
  const pendingLabel = isPending ? "Please wait..." : confirmLabel;

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen && isPending) return;
    if (!nextOpen) onCancel?.();
    onOpenChange?.(nextOpen);
  };

  if (isDesktop) {
    return (
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent className="max-w-sm rounded-2xl sm:rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
            {description ? (
              <AlertDialogDescription className="text-center">
                {description}
              </AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:justify-center">
            <AlertDialogCancel
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
            >
              {cancelLabel}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault();
                onConfirm?.();
              }}
              className={tokens.confirm}
            >
              {pendingLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="mx-auto max-w-md rounded-t-3xl pb-[var(--sab)]">
        <DrawerHeader className="items-center gap-3 px-6 pt-6 text-center sm:text-center">
          {Icon ? (
            <div
              className={cn(
                "mx-auto flex h-14 w-14 items-center justify-center rounded-full",
                tokens.badge,
              )}
            >
              <Icon className="h-7 w-7" />
            </div>
          ) : null}
          <DrawerTitle className="text-xl font-bold text-foreground">
            {title}
          </DrawerTitle>
          {description ? (
            <DrawerDescription className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </DrawerDescription>
          ) : null}
        </DrawerHeader>

        <DrawerFooter className="gap-3 px-6 pb-8">
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className={cn("w-full shadow-md", tokens.confirm)}
          >
            {pendingLabel}
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
            className="w-full text-muted-foreground"
          >
            {cancelLabel}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

