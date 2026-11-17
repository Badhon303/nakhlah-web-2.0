import {
  parsePhoneNumber,
  getCountryCallingCode,
  getCountries,
} from "react-phone-number-input";
import labels from "react-phone-number-input/locale/en";

export function splitPersonName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function isoFromCallingCode(callingCode) {
  const code = String(callingCode || "").replace(/\D/g, "");
  if (!code) return "";
  return (
    getCountries().find((iso) => {
      try {
        return String(getCountryCallingCode(iso)) === code;
      } catch {
        return false;
      }
    }) || ""
  );
}

function countryIsoFromName(countryName) {
  if (!countryName) return "";
  const normalized = countryName.trim().toLowerCase();
  return (
    getCountries().find(
      (iso) => String(labels[iso] || "").toLowerCase() === normalized,
    ) || ""
  );
}

function callingCodeFromCountryName(countryName) {
  const iso = countryIsoFromName(countryName);
  if (!iso) return { iso: "", callingCode: "" };
  try {
    return {
      iso,
      callingCode: String(getCountryCallingCode(iso) || ""),
    };
  } catch {
    return { iso, callingCode: "" };
  }
}

export function parseBillingMobile(rawPhone, fallbackCountryCode = "") {
  const raw = String(rawPhone || "").trim();
  const fallbackCode = String(fallbackCountryCode || "").replace(/\D/g, "");

  if (!raw) {
    return { phoneCountryCode: "", phoneNumber: "", phoneCountryIso: "" };
  }

  try {
    const parsed = raw.startsWith("+") ? parsePhoneNumber(raw) : null;

    if (
      parsed?.isValid?.() &&
      parsed?.countryCallingCode &&
      parsed?.nationalNumber
    ) {
      return {
        phoneCountryCode: String(parsed.countryCallingCode),
        phoneNumber: String(parsed.nationalNumber),
        phoneCountryIso: String(
          parsed.country || isoFromCallingCode(parsed.countryCallingCode),
        ),
      };
    }
  } catch {
    // fall through
  }

  const digits = raw.replace(/\D/g, "");
  if (!digits) {
    return { phoneCountryCode: "", phoneNumber: "", phoneCountryIso: "" };
  }

  let national = digits;
  if (national.startsWith("00966")) national = national.slice(5);
  else if (national.startsWith("966") && national.length > 9) {
    national = national.slice(3);
  }
  if (national.startsWith("0")) national = national.slice(1);

  if (/^5\d{8}$/.test(national)) {
    const phoneCountryCode = fallbackCode || "966";
    return {
      phoneCountryCode,
      phoneNumber: national,
      phoneCountryIso: isoFromCallingCode(phoneCountryCode),
    };
  }

  if (
    fallbackCode &&
    digits.startsWith(fallbackCode) &&
    digits.length > fallbackCode.length + 5
  ) {
    const rest = digits.slice(fallbackCode.length).replace(/^0/, "");
    if (rest) {
      return {
        phoneCountryCode: fallbackCode,
        phoneNumber: rest,
        phoneCountryIso: isoFromCallingCode(fallbackCode),
      };
    }
  }

  if (/^\d{7,12}$/.test(digits)) {
    return {
      phoneCountryCode: fallbackCode,
      phoneNumber: digits.replace(/^0/, ""),
      phoneCountryIso: isoFromCallingCode(fallbackCode),
    };
  }

  return { phoneCountryCode: "", phoneNumber: "", phoneCountryIso: "" };
}

/** @deprecated Use parseBillingMobile */
export function parseSaudiMobile(rawPhone) {
  return parseBillingMobile(rawPhone);
}

export function getBillingCustomer(profile, session) {
  const fullName =
    profile?.fullName ||
    profile?.name ||
    session?.user?.name ||
    session?.user?.fullName ||
    "";
  const { firstName, lastName } = splitPersonName(fullName);

  const countryName =
    profile?.onboardInfo?.country ||
    profile?.country ||
    session?.user?.country ||
    "";
  const fallbackCountry = callingCodeFromCountryName(countryName);

  const rawPhone =
    profile?.contactNumber ||
    profile?.phoneNumber ||
    profile?.phone ||
    profile?.mobile ||
    profile?.user?.contactNumber ||
    session?.user?.contactNumber ||
    session?.user?.phoneNumber ||
    session?.user?.phone ||
    "";

  const parsed = parseBillingMobile(rawPhone, fallbackCountry.callingCode);

  return {
    firstName,
    lastName,
    phoneCountryCode: parsed.phoneCountryCode,
    phoneNumber: parsed.phoneNumber,
    phoneCountryIso:
      parsed.phoneCountryIso ||
      fallbackCountry.iso ||
      isoFromCallingCode(parsed.phoneCountryCode),
  };
}
