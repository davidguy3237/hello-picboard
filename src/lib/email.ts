// TODO: Figure out how to use AWS SES later
// https://www.npmjs.com/package/@aws-sdk/client-ses
// https://docs.aws.amazon.com/ses/latest/dg/setting-up.html
// https://github.com/aws/aws-sdk-js-v3#getting-started
// https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/ses/src/ses_sendemail.js#L15
// https://stackoverflow.com/questions/73130039/whats-the-up-to-date-way-of-sending-emails-with-aws-ses
// https://www.suprsend.com/post/how-to-implement-email-sending-in-next-js-with-aws-ses
// https://medium.com/nerd-for-tech/sending-emails-with-nextjs-and-amazon-simple-email-services-ses-8e4e10d1d397

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.<br>If you did not make this request, you may ignore this.</p>`,
  });
}

export async function sendPasswordChangedEmail(email: string, token: string) {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Your password has been changed!",
    html: `<p>Your password has been changed. If you didn't make this change, please <a href="${resetLink}">reset your password</a> immediately. </p>`,
  });
}
// TODO: See if this can be made nonblocking
export async function sendTwoFactorTokenEmail(email: string, token: string) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}. This code expires in 5 minutes.</p>`,
  });
}
