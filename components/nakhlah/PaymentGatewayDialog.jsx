"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  getCountryCallingCode,
  parsePhoneNumber,
} from "react-phone-number-input";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CountryPicker } from "@/components/nakhlah/onboarding/CountryPicker";
import { getSessionToken, isSessionValid } from "@/lib/authUtils";
import { getUserKey } from "@/lib/userKey";
import {
  getBillingCustomer,
  isoFromCallingCode,
} from "@/lib/billingCustomer";
import { useProfileStore } from "@/stores/useProfileStore";
import { cn } from "@/lib/utils";

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function pickPrefill(propValue, profileValue) {
  const fromProp = String(propValue || "").trim();
  if (fromProp) return fromProp;
  return String(profileValue || "").trim();
}

function callingCodeFromIso(iso) {
  if (!iso) return "";
  try {
    return String(getCountryCallingCode(iso) || "");
  } catch {
    return "";
  }
}

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
    label: "Choose Others",
    description: "Cards, wallets & local methods",
    logo: "/tap-pay.png",
    disabled: false,
  },
];

// STC Pay (dates) — restore TAP_DATE_METHODS + tapPaymentMethods UI later.
// const TAP_DATE_METHODS = [
//   { id: "card", label: "Card / Apple Pay" },
//   { id: "stcpay", label: "STC Pay" },
// ];

function GatewayPicker({
  onConfirm,
  disabled,
  tapCustomerRequired,
  tapPaymentMethods, // STC dates: restore Card/STC badges with this flag
  initialFirstName = "",
  initialLastName = "",
  initialPhone = "",
  initialPhoneCountryCode = "",
}) {
  const { data: session, status: sessionStatus } = useSession();
  const profile = useProfileStore((state) => state.profile);
  const fetchMyProfile = useProfileStore((state) => state.fetchMyProfile);
  const billingCustomer = getBillingCustomer(profile, session);

  const resolvedInitialFirstName = pickPrefill(
    initialFirstName,
    billingCustomer.firstName,
  );
  const resolvedInitialLastName = pickPrefill(
    initialLastName,
    billingCustomer.lastName,
  );
  const resolvedInitialPhone = pickPrefill(
    initialPhone,
    billingCustomer.phoneNumber,
  );
  const resolvedInitialCountryCode = pickPrefill(
    initialPhoneCountryCode,
    billingCustomer.phoneCountryCode,
  );
  const resolvedInitialCountryIso =
    billingCustomer.phoneCountryIso ||
    isoFromCallingCode(resolvedInitialCountryCode);

  const resolvedInitialE164 =
    resolvedInitialCountryCode && resolvedInitialPhone
      ? `+${digitsOnly(resolvedInitialCountryCode)}${digitsOnly(resolvedInitialPhone)}`
      : "";

  const [selected, setSelected] = useState(null);
  // const [tapMethod, setTapMethod] = useState("card");
  const [firstName, setFirstName] = useState(resolvedInitialFirstName);
  const [lastName, setLastName] = useState(resolvedInitialLastName);
  const [phoneCountryIso, setPhoneCountryIso] = useState(
    resolvedInitialCountryIso,
  );
  const [phoneE164, setPhoneE164] = useState(resolvedInitialE164);
  // const [otp, setOtp] = useState("");
  // const [stcChargeId, setStcChargeId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!isSessionValid(session)) return;
    const token = getSessionToken(session);
    if (!token) return;
    fetchMyProfile(token, false, getUserKey(session));
  }, [fetchMyProfile, session, sessionStatus]);

  useEffect(() => {
    setFirstName(resolvedInitialFirstName);
    setLastName(resolvedInitialLastName);
    setPhoneCountryIso(resolvedInitialCountryIso);
    setPhoneE164(resolvedInitialE164);
  }, [
    resolvedInitialFirstName,
    resolvedInitialLastName,
    resolvedInitialCountryIso,
    resolvedInitialE164,
  ]);

  const resolvedCountryCode =
    callingCodeFromIso(phoneCountryIso) ||
    digitsOnly(resolvedInitialCountryCode);
  const normalizedPhone = (() => {
    if (!phoneE164) return "";
    try {
      const parsed = parsePhoneNumber(phoneE164);
      if (parsed?.nationalNumber) return String(parsed.nationalNumber);
    } catch {
      // fall through
    }
    return digitsOnly(phoneE164)
      .replace(new RegExp(`^${resolvedCountryCode || "___"}`), "")
      .replace(/^0/, "");
  })();
  const isTapPhoneValid = Boolean(
    phoneCountryIso && phoneE164 && isValidPhoneNumber(phoneE164),
  );
  void tapPaymentMethods;
  // Dates currently use Tap card checkout only (no Card/STC badges).
  const showTapMethods = false; // selected === "tap" && tapPaymentMethods;
  void showTapMethods;
  const isStcPay = false; // showTapMethods && tapMethod === "stcpay";
  const waitingForOtp = false; // Boolean(stcChargeId);
  const needsTapCustomerDetails =
    selected === "tap" && tapCustomerRequired;
  const isTapCustomer = needsTapCustomerDetails; // || isStcPay;
  const resolvedFirstName =
    firstName.trim() || resolvedInitialFirstName.trim();
  const resolvedLastName = lastName.trim() || resolvedInitialLastName.trim();
  const needsNameInput =
    needsTapCustomerDetails &&
    (!resolvedInitialFirstName.trim() || !resolvedInitialLastName.trim());
  const tapNameOk =
    !needsTapCustomerDetails ||
    (Boolean(resolvedFirstName) && Boolean(resolvedLastName));
  const stcPhoneOk = !isStcPay || isTapPhoneValid;
  const otpOk = true; // !waitingForOtp || /^\d{4,8}$/.test(otp.trim());
  const tapPhoneOk = !isTapCustomer || isTapPhoneValid;
  const canProceed =
    Boolean(selected) &&
    tapNameOk &&
    tapPhoneOk &&
    stcPhoneOk &&
    otpOk &&
    !isSubmitting;

  const handlePhoneCountryChange = (nextIso) => {
    if (nextIso === phoneCountryIso) return;
    setPhoneCountryIso(nextIso || "");
    setPhoneE164("");
  };

  const handleProceed = async () => {
    if (disabled || !canProceed) return;
    setError("");
    setIsSubmitting(true);
    const result = await onConfirm(
      selected,
      selected === "tap"
        ? {
            paymentMethod: "card",
            // ...(showTapMethods ? { paymentMethod: tapMethod } : {}),
            ...(isTapCustomer
              ? {
                  phone: normalizedPhone,
                  phoneCountryCode: resolvedCountryCode,
                  ...(needsTapCustomerDetails
                    ? {
                        firstName: resolvedFirstName,
                        lastName: resolvedLastName,
                      }
                    : {}),
                }
              : {}),
            // ...(waitingForOtp
            //   ? { chargeId: stcChargeId, otp: otp.trim() }
            //   : {}),
          }
        : undefined,
    );
    setIsSubmitting(false);

    if (!result?.success) {
      if (result?.error) setError(result.error);
      return;
    }

    // if (result.needsOtp && result.chargeId) {
    //   setStcChargeId(result.chargeId);
    //   setOtp("");
    // }
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
              disabled={disabled || option.disabled || isSubmitting}
              onClick={() => {
                setSelected(option.id);
                // setTapMethod("card");
                // setStcChargeId("");
                // setOtp("");
                setError("");
              }}
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

      {/* STC Pay (dates): Card / Apple Pay vs STC Pay badges
      {showTapMethods && (
        <div className="mt-4 flex flex-col items-center text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Tap method
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {TAP_DATE_METHODS.map((method) => {
              const isActive = tapMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  disabled={disabled || isSubmitting}
                  onClick={() => {
                    setTapMethod(method.id);
                    setStcChargeId("");
                    setOtp("");
                    setError("");
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold tracking-wide transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "border border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-foreground"
                  }`}
                >
                  {method.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
      */}

      {needsNameInput && (
        <div className="mx-auto mt-4 grid w-full max-w-sm gap-3 text-center">
          {!resolvedInitialFirstName.trim() && (
            <div>
              <label
                htmlFor="tap-customer-first-name"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
              >
                First name
              </label>
              <Input
                id="tap-customer-first-name"
                value={firstName}
                disabled={isSubmitting}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="First name"
                className="text-center"
              />
            </div>
          )}
          {!resolvedInitialLastName.trim() && (
            <div>
              <label
                htmlFor="tap-customer-last-name"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
              >
                Last name
              </label>
              <Input
                id="tap-customer-last-name"
                value={lastName}
                disabled={isSubmitting}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Last name"
                className="text-center"
              />
            </div>
          )}
        </div>
      )}

      {isTapCustomer && (
        <div className="mx-auto mt-4 w-full max-w-sm text-center">
          <label
            htmlFor="tap-customer-phone"
            className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
          >
            {"Mobile number to save your card"}
            {/* {isStcPay ? "STC Pay mobile number" : "Mobile number to save your card"} */}
          </label>
          <div
            className={cn(
              "flex items-stretch overflow-hidden rounded-md border bg-background text-left focus-within:ring-2 focus-within:ring-ring",
              phoneE164 && !isTapPhoneValid
                ? "border-destructive focus-within:ring-destructive/40"
                : "border-input",
            )}
          >
            <CountryPicker
              value={phoneCountryIso}
              onChange={handlePhoneCountryChange}
              showCallingCode
              placeholder="Code"
              variant="embedded"
              disabled={isSubmitting}
              triggerClassName="h-10 shrink-0 rounded-none border-r border-input"
            />
            <PhoneInput
              id="tap-customer-phone"
              country={phoneCountryIso || undefined}
              international={phoneCountryIso ? true : undefined}
              smartCaret={false}
              value={phoneE164 || undefined}
              onChange={(value) => setPhoneE164(value || "")}
              disabled={isSubmitting || !phoneCountryIso}
              inputMode="tel"
              autoComplete="tel"
              aria-label="Mobile number"
              className="flex h-10 min-w-0 flex-1 border-0 bg-transparent px-3 text-center text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={
                phoneCountryIso ? "Phone number" : "Select a country code"
              }
            />
          </div>
          {phoneE164 && !isTapPhoneValid && (
            <p className="mt-1.5 text-xs text-destructive">
              Enter a valid mobile number for the selected country.
            </p>
          )}
          {tapCustomerRequired && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Required so Tap can save your card for the subscription.
            </p>
          )}
          {/* {isStcPay && !waitingForOtp && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Use the STC Pay mobile number. Tap test numbers include
              554774102; test OTP is always 123456.
            </p>
          )} */}
        </div>
      )}

      {/* STC Pay OTP (dates)
      {waitingForOtp && (
        <div className="mx-auto mt-4 w-full max-w-sm text-center">
          <label
            htmlFor="tap-stc-otp"
            className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
          >
            STC Pay OTP
          </label>
          <Input
            id="tap-stc-otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otp}
            disabled={isSubmitting}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            maxLength={8}
            className="text-center tracking-[0.3em]"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Enter the OTP sent to the STC Pay number. Test OTP is 123456.
          </p>
        </div>
      )}
      */}

      {error && (
        <p className="mt-3 text-center text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <Button
        type="button"
        disabled={disabled || !canProceed}
        onClick={handleProceed}
        className="mt-4 w-full bg-accent font-bold text-accent-foreground hover:bg-accent/90"
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {"Proceed to Payment"}
        {/* {waitingForOtp ? "Confirm OTP" : "Proceed to Payment"} */}
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}

export { GatewayPicker };
export default function PaymentGatewayDialog({
  open,
  onClose,
  onSelect,
  tapCustomerRequired = false,
  tapPaymentMethods = false,
  initialFirstName = "",
  initialLastName = "",
  initialPhone = "",
  initialPhoneCountryCode = "",
  title = "Choose a payment method",
  description = "Select how you'd like to pay to continue to secure checkout.",
  summary,
  disabled = false,
}) {
  const isMobile = useIsMobile();

  const handleConfirm = (gatewayId, options) => {
    if (disabled) return Promise.resolve({ success: false });
    return onSelect(gatewayId, options);
  };

  const picker = (
    <GatewayPicker
      key={`${open}-${tapPaymentMethods}-${tapCustomerRequired}-${initialPhone}-${initialPhoneCountryCode}-${initialFirstName}-${initialLastName}`}
      onConfirm={handleConfirm}
      disabled={disabled}
      tapCustomerRequired={tapCustomerRequired}
      tapPaymentMethods={tapPaymentMethods}
      initialFirstName={initialFirstName}
      initialLastName={initialLastName}
      initialPhone={initialPhone}
      initialPhoneCountryCode={initialPhoneCountryCode}
    />
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
        <DrawerContent className="max-h-[90vh] overflow-y-auto">
          <DrawerHeader className="text-center">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          {summary && (
            <div className="mx-4 mb-2 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 px-6 py-5 text-center">
              {summary}
            </div>
          )}
          <div className="p-4 pb-8">{picker}</div>
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
        {picker}
      </DialogContent>
    </Dialog>
  );
}
