import { resend, EMAIL_FROM } from "./client";

/**
 * Send a welcome email to a new user.
 */
export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Welcome!",
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Thanks for signing up. We're glad to have you on board.</p>
      <p>If you have any questions, just reply to this email.</p>
    `,
  });
}

/**
 * Send a notification email.
 */
export async function sendNotificationEmail(
  to: string,
  subject: string,
  message: string
) {
  return resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html: `
      <h2>${subject}</h2>
      <p>${message}</p>
    `,
  });
}

/**
 * Send a password reset email with a reset link.
 */
export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  return resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `,
  });
}
