const TAP_AGREEMENT_STORAGE_KEY = "nakhlah:tap-payment-agreement-id";

export function extractTapPaymentAgreementId(data) {
  if (!data || typeof data !== "object") return "";

  const candidates = [
    data.payment_agreement_id,
    data.paymentAgreementId,
    data.payment_agreement?.id,
    data.paymentAgreement?.id,
    data.charge?.payment_agreement_id,
    data.charge?.payment_agreement?.id,
    data.subscription?.payment_agreement_id,
    data.subscription?.paymentAgreementId,
    data.subscription?.payment_agreement?.id,
    data.data?.payment_agreement_id,
    data.data?.paymentAgreementId,
    data.data?.payment_agreement?.id,
    data.tap?.payment_agreement_id,
    data.tap?.payment_agreement?.id,
  ];
  const match = candidates.find(
    (value) => typeof value === "string" && value.trim(),
  );

  return match ? match.trim() : "";
}

export function rememberTapPaymentAgreementId(data) {
  const paymentAgreementId = extractTapPaymentAgreementId(data);

  if (paymentAgreementId && typeof window !== "undefined") {
    sessionStorage.setItem(TAP_AGREEMENT_STORAGE_KEY, paymentAgreementId);
  }

  return paymentAgreementId;
}

export function readTapPaymentAgreementId(record) {
  const fromRecord = extractTapPaymentAgreementId(record);
  if (fromRecord) return fromRecord;
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(TAP_AGREEMENT_STORAGE_KEY) || "";
}

export function clearTapPaymentAgreementId() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TAP_AGREEMENT_STORAGE_KEY);
}
