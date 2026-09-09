"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

const GATEWAY_OPTIONS = [
  {
    id: "paypal",
    label: "PayPal",
    description: "Pay with PayPal or card",
    logo: "/paypal.png",
    disabled: false,
  },
  {
    id: "tap",
    label: "Tap",
    description: "Card, KNET, mada & more",
    logo: "/tap-pay.png",
    disabled: true,
  },
];

function GatewayOptions({ onSelect, disabled }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {GATEWAY_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          disabled={disabled || option.disabled}
          onClick={() => onSelect(option.id)}
          className={`group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-4 py-6 transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
            option.disabled
              ? "opacity-50"
              : "hover:border-accent/50 hover:shadow-md"
          }`}
        >
          <div className="flex h-14 w-full items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={option.logo}
              alt={`${option.label} logo`}
              className="h-full w-auto max-w-[140px] object-contain"
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">{option.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {option.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function PaymentGatewayDialog({
  open,
  onClose,
  onSelect,
  title = "Choose a payment method",
  description = "Select how you'd like to pay to continue to secure checkout.",
  summary,
  disabled = false,
}) {
  const isMobile = useIsMobile();

  const handleSelect = (gatewayId) => {
    if (disabled) return;
    onSelect(gatewayId);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-center">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          {summary && (
            <div className="mx-4 mb-2 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 px-6 py-5 text-center">
              {summary}
            </div>
          )}
          <div className="p-4 pb-8">
            <GatewayOptions onSelect={handleSelect} disabled={disabled} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {summary && (
          <div className="rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 px-6 py-5 text-center">
            {summary}
          </div>
        )}
        <GatewayOptions onSelect={handleSelect} disabled={disabled} />
      </DialogContent>
    </Dialog>
  );
}
