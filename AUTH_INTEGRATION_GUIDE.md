# Authentication API Integration Summary

## Overview

This document outlines all authentication API integrations completed for the Nakhlah application.

## Environment Variables Required

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=your_api_base_url_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_web_google_client_id_here
NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI=https://uat.nakhlah.net/api/auth/callback/google
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Native Google Sign-In Setup

Mobile Google login uses the native Google Sign-In SDK through `@capawesome/capacitor-google-sign-in`. It does not use a Google redirect URI or the `com.fintechhub.nakhla` deep link.

- Android: create/configure an Android OAuth client for package `com.fintechhub.nakhla` with the release and debug SHA-1 fingerprints.
- iOS: create an iOS OAuth client, then add its `GIDClientID` and reversed client-ID URL scheme to `ios/App/App/Info.plist`.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` must be the Web OAuth client ID. Native login requests only authentication and sends Google's ID token to `/api/users/social-login` for verification; it does not request extra profile scopes.
- Run `npx cap sync` after configuring the native credentials.
- The API deployment should set `GOOGLE_CLIENT_ID` to the same Web OAuth client ID so it can validate native ID-token audiences.
- The mobile build must expose `NEXT_PUBLIC_GOOGLE_CLIENT_ID`; `GOOGLE_CLIENT_ID` alone is not available to browser code and will not initialize the native plugin.
- On Android, register the exact package `com.fintechhub.nakhla` and the SHA-1 fingerprints for the debug and release signing keys in Google Cloud Console. A missing or incorrect fingerprint commonly surfaces as `SIGN_IN_CANCELED` from Credential Manager.

The HTTPS callback is only used by the browser/web fallback. It is not used by native Android or iOS login.

### Native sign-in troubleshooting

If the app displays `The user canceled the sign-in flow` without the account picker appearing, verify the Android OAuth client package/SHA-1 configuration first. This error is emitted by the native Google SDK before the app calls `/api/users/social-login`; the API cannot cause that specific error. Once the native flow succeeds, the API verifies the returned Google ID token at `POST /api/users/social-login`.

## Completed Integrations

### 1. Google Social Login ✅

**Endpoint:** `POST /api/users/social-login`

**Location:** [app/auth/login/page.jsx](app/auth/login/page.jsx)

**Implementation:**

- Added Google Provider to NextAuth configuration in [lib/auth.js](lib/auth.js)
- Google sign-in button placed below the standard sign-in form
- On successful Google authentication, calls backend `/api/users/social-login` with user data
- Backend returns JWT token and user info, stored in NextAuth session

**Request Body:**

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": ""
}
```

**Response:**

```json
{
  "token": "jwt_token_here",
  "exp": 1234567890,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
}
```

---

### 2. User Profile Creation ✅

**Endpoint:** `POST /api/user-profile`

**Location:** [app/onboarding/page.jsx](app/onboarding/page.jsx)

**Implementation:**

- Called after successful registration/onboarding completion
- Sends onboarding data to create user profile
- Requires authentication token in Authorization header

**Request Body:**

```json
{
  "name": "User Name",
  "age": 25,
  "proficiencyLevel": "beginner",
  "dailyGoal": "15",
  "quizScore": 2,
  "userSource": "facebook",
  "contactNumber": "+1234567890"
}
```

**Response:**

```json
{
  "message": "Profile created successfully",
  "doc": {
    // User profile object
  }
}
```

---

### 3. Onboarding Enhancement - User Source & Contact ✅

**Component:** [components/nakhlah/onboarding/UserSourceStep.jsx](components/nakhlah/onboarding/UserSourceStep.jsx)

**Implementation:**

- New onboarding step added between Quiz and Account steps
- Social media source options: Facebook, Instagram, Twitter, YouTube, Friend, Other
- Optional contact number field
- Data included in user profile creation

**Updated Onboarding Flow:**

1. Proficiency Level
2. Daily Goal
3. Quiz
4. **User Source & Contact (NEW)**
5. Account Creation
6. Completion

---

### 4. Forgot Password API ✅

**Endpoint:** `POST /api/users/forgot-password`

**Location:** [app/auth/forgot-password/page.jsx](app/auth/forgot-password/page.jsx)

**Implementation:**

- User enters email address
- Sends request to backend to generate OTP/reset code
- Email stored in sessionStorage for OTP verification step
- Redirects to OTP verification page on success

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "message": "Reset code sent to your email"
}
```

---

### 5. Reset Password API ✅

**Endpoint:** `POST /api/users/reset-password`

**Location:** [app/auth/create-new-password/page.jsx](app/auth/create-new-password/page.jsx)

**Implementation:**

- Accepts reset token from URL query params or sessionStorage
- Validates password confirmation match
- Sends new password + token to backend
- Clears reset data from sessionStorage on success
- Redirects to welcome-back page

**Request Body:**

```json
{
  "password": "new_password_here",
  "access_token": "reset_token_from_otp_verification"
}
```

**Response:**

```json
{
  "message": "Password reset successfully"
}
```

---

### 6. NaN Height CSS Error Fix ✅

**Location:** [app/get-started/page.jsx](app/get-started/page.jsx)

**Issue:** Invalid Tailwind classes `border-l-12`, `border-r-12`, `border-t-12` causing NaN height errors

**Fix:** Replaced with inline styles using proper CSS border properties:

```jsx
style={{
  width: 0,
  height: 0,
  borderLeft: '12px solid transparent',
  borderRight: '12px solid transparent',
  borderTop: '12px solid hsl(var(--card))'
}}
```

---

## API Service Functions

All API functions are located in [services/api/auth.js](services/api/auth.js):

```javascript
// Registration
registerUser(email, password);

// Login
loginUser(email, password);

// User Profile
createUserProfile(profileData, token);

// Password Reset
forgotPassword(email);
resetPassword(token, password);
```

---

## Authentication Flow Diagrams

### Registration Flow:

```
1. User enters details in onboarding → Account step
2. handleRegistration() calls registerUser(email, password)
3. Auto-login via signIn("credentials", { email, password })
4. Move to completion step
5. handleComplete() fetches session token
6. createUserProfile(profileData, token) sends onboarding data
7. Redirect to dashboard
```

### Google Login Flow:

```
1. User clicks "Continue with Google" button
2. NextAuth redirects to Google OAuth consent
3. Google returns user data to NextAuth callback
4. JWT callback calls /api/users/social-login with user data
5. Backend returns token and user info
6. Token stored in NextAuth session
7. Redirect to dashboard
```

### Password Reset Flow:

```
1. User enters email in forgot-password page
2. forgotPassword(email) sends request to backend
3. Backend sends reset link with token to user's email
4. User opens /auth/reset-password?token=... from email
5. Reset page parses token from URL
6. User creates and confirms new password
7. resetPassword(token, password) sends request to backend
8. Backend updates password
9. Redirect to welcome-back page
```

---

## Testing Checklist

### Google Login

- [ ] GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET configured
- [ ] Google OAuth consent screen configured
- [ ] Web fallback redirect URI is configured as `https://uat.nakhlah.net/api/auth/callback/google`
- [ ] Android OAuth client has the correct package name and SHA-1 fingerprints
- [ ] iOS OAuth client and reversed client-ID URL scheme are configured
- [ ] Test successful Google login flow on web, Android, and iOS
- [ ] Verify token storage in session
- [ ] Check redirect to dashboard

### User Profile Creation

- [ ] Test profile creation after registration
- [ ] Verify all onboarding data sent correctly
- [ ] Check Authorization header includes valid token
- [ ] Confirm profile data stored in backend

### Forgot Password

- [ ] Test email validation
- [ ] Verify reset email sent to user
- [ ] Test redirect to reset-password page

### Reset Password

- [ ] Test password validation (min 6 chars)
- [ ] Verify password confirmation match
- [ ] Check token retrieval from URL query params
- [ ] Test password update in backend
- [ ] Verify sessionStorage cleared after reset

---

## Notes

1. **Token Management:**
   - NextAuth handles JWT tokens for authenticated sessions
   - Reset password uses separate access_token from OTP verification
   - Session tokens stored automatically by NextAuth

2. **Error Handling:**
   - All API functions return `{ success, error }` format
   - Toast notifications show user-friendly messages
   - Loading states prevent duplicate submissions

3. **Security:**
   - Passwords never logged or exposed
   - Tokens stored securely in sessionStorage (short-term) or NextAuth session
   - HTTPS required for production Google OAuth

4. **OTP Verification:**
   - The OTP verification page flow needs to store the reset_token in sessionStorage
   - Token should be passed to create-new-password page for password reset API call

---

## Future Enhancements

- Add rate limiting for forgot password requests
- Implement refresh token rotation
- Add biometric authentication support
- Email verification after registration
- Two-factor authentication (2FA) option

---

Last Updated: 2024
