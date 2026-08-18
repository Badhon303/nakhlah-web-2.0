// Shared validation constants for onboarding and forms

export const NAME_MAX_LENGTH = 99;

// Allows optional leading '+', parentheses, spaces, and hyphens.
// Requires between 6 and 25 characters total (global phone standard).
export const PHONE_REGEX = /^\+?([0-9\s\-()]{6,25})$/;
export const PHONE_ERROR_MESSAGE =
  "Enter a valid contact number (6-25 digits). Allowed: +, spaces, -, parentheses.";

// Standard email pattern
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const EMAIL_ERROR_MESSAGE = "Enter a valid email address.";

// Password minimum length
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_ERROR_MESSAGE =
  `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
