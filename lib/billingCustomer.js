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

export function parseSaudiMobile(rawPhone) {
  const digits = String(rawPhone || "").replace(/\D/g, "");
  if (!digits) {
    return { phoneCountryCode: "", phoneNumber: "" };
  }

  let national = digits;
  if (national.startsWith("966")) {
    national = national.slice(3);
  }
  if (national.startsWith("0")) {
    national = national.slice(1);
  }

  if (/^5\d{8}$/.test(national)) {
    return { phoneCountryCode: "966", phoneNumber: national };
  }

  return { phoneCountryCode: "", phoneNumber: "" };
}

export function getBillingCustomer(profile, session) {
  const fullName =
    profile?.fullName ||
    profile?.name ||
    session?.user?.name ||
    session?.user?.fullName ||
    "";
  const { firstName, lastName } = splitPersonName(fullName);
  const rawPhone =
    profile?.contactNumber ||
    profile?.phoneNumber ||
    profile?.phone ||
    session?.user?.contactNumber ||
    session?.user?.phoneNumber ||
    session?.user?.phone ||
    "";
  const { phoneCountryCode, phoneNumber } = parseSaudiMobile(rawPhone);

  return {
    firstName,
    lastName,
    phoneCountryCode,
    phoneNumber,
  };
}
