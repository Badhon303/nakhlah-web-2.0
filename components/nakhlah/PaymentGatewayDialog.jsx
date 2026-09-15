"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
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
    disabled: false,
  },
];

function GatewayPicker({ onConfirm, disabled }) {
  const [selected, setSelected] = useState(null);

  const handleProceed = () => {
    if (disabled || !selected) return;
    onConfirm(selected);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {GATEWAY_OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled || option.disabled}
              onClick={() => setSelected(option.id)}
              className={`group relative flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card px-4 py-6 transition-all disabled:cursor-not-allowed ${
                isSelected
                  ? "border-accent shadow-md ring-2 ring-accent/25"
                  : "border-border hover:border-accent/50 hover:shadow-md disabled:hover:border-border"
              }`}
            >
              {isSelected && (
                <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-accent text-accent-foreground">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
              )}
              <div className="flex h-14 w-full items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={option.logo}
                  alt={`${option.label} logo`}
                  className="h-full w-auto max-w-[140px] object-contain"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">
                  {option.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        type="button"
        disabled={disabled || !selected}
        onClick={handleProceed}
        className="mt-4 w-full bg-accent font-bold text-accent-foreground hover:bg-accent/90"
      >
        Proceed to Payment
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
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

  const handleConfirm = (gatewayId) => {
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
            <GatewayPicker onConfirm={handleConfirm} disabled={disabled} />
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
        <GatewayPicker onConfirm={handleConfirm} disabled={disabled} />
      </DialogContent>
    </Dialog>
  );
}
