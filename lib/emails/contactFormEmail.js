/**
 * Email template(s) for the "Contact Us" form (app/api/contact/route.js).
 *
 * Why a dedicated file:
 *  - Email HTML must use inline styles (most inboxes strip <style> blocks
 *    and ignore Tailwind classes), so the markup below is intentionally
 *    verbose and self-contained.
 *  - Keeping the template separate from the route handler keeps the API
 *    route focused on validation/transport, and makes the template easy
 *    to preview/update without touching request-handling logic.
 *
 * Usage:
 *   import { buildContactFormEmailHtml, buildContactFormEmailText } from
 *     "@/lib/emails/contactFormEmail";
 *
 *   const html = buildContactFormEmailHtml({ name, email, subject, message });
 *   const text = buildContactFormEmailText({ name, email, subject, message });
 */

const BRAND_ACCENT = "#7c3aed"; // matches --accent (violet) design token
const BRAND_BG = "#f5f1e8"; // warm sand background, matches app palette

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Renders plain text with line breaks preserved as <br> after escaping,
 * so user-supplied message content can never inject markup into the email.
 */
function escapeHtmlMultiline(value) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

/**
 * Builds the HTML body for the "new contact form submission" notification
 * email sent to the site inbox (CONTACT_EMAIL_TO).
 */
export function buildContactFormEmailHtml({ name, email, subject, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtmlMultiline(message);
  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New Contact Form Submission</title>
  </head>
  <body style="margin:0;padding:0;background-color:${BRAND_BG};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_BG};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
            <!-- Header -->
            <tr>
              <td style="background-color:${BRAND_ACCENT};padding:24px 32px;">
                <span style="color:#ffffff;font-size:20px;font-weight:700;">🌴 Nakhlah</span>
                <div style="color:#ede9fe;font-size:13px;margin-top:4px;">New message from the Contact Us form</div>
              </td>
            </tr>

            <!-- Meta -->
            <tr>
              <td style="padding:24px 32px 0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#6b7280;width:90px;">From</td>
                    <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#6b7280;">Email</td>
                    <td style="padding:6px 0;font-size:14px;">
                      <a href="mailto:${safeEmail}" style="color:${BRAND_ACCENT};text-decoration:none;">${safeEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#6b7280;">Subject</td>
                    <td style="padding:6px 0;font-size:14px;color:#111827;">${safeSubject}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#6b7280;">Received</td>
                    <td style="padding:6px 0;font-size:13px;color:#6b7280;">${submittedAt}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding:20px 32px 32px 32px;">
                <div style="font-size:13px;color:#6b7280;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.04em;">Message</div>
                <div style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px 18px;font-size:14px;line-height:1.6;color:#111827;white-space:pre-wrap;">${safeMessage}</div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 32px 28px 32px;border-top:1px solid #f1f0eb;">
                <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
                  This message was sent from the Contact Us form on the Nakhlah app.
                  Reply directly to this email to respond to ${safeName}.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Plain-text fallback for email clients that don't render HTML.
 */
export function buildContactFormEmailText({ name, email, subject, message }) {
  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return [
    "New Contact Us submission",
    "",
    `From: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    `Received: ${submittedAt}`,
    "",
    "Message:",
    message,
  ].join("\n");
}
