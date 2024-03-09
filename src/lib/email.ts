// TODO: Figure out how to use AWS SES later
// https://www.npmjs.com/package/@aws-sdk/client-ses
// https://docs.aws.amazon.com/ses/latest/dg/setting-up.html
// https://github.com/aws/aws-sdk-js-v3#getting-started
// https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/ses/src/ses_sendemail.js#L15
// https://stackoverflow.com/questions/73130039/whats-the-up-to-date-way-of-sending-emails-with-aws-ses
// https://www.suprsend.com/post/how-to-implement-email-sending-in-next-js-with-aws-ses
// https://medium.com/nerd-for-tech/sending-emails-with-nextjs-and-amazon-simple-email-services-ses-8e4e10d1d397

import { generateTwoFactorToken } from "@/lib/tokens";
import { Resend } from "resend";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

if (
  !process.env.RESEND_API_KEY ||
  !process.env.NEXT_PUBLIC_APP_URL ||
  !process.env.AWS_SES_REGION ||
  !process.env.AWS_SES_ENDPOINT ||
  !process.env.AWS_SES_ACCESS_KEY_ID ||
  !process.env.AWS_SES_SECRET_ACCESS_KEY
) {
  throw new Error(
    "Missing environment variable: RESEND_API_KEY, NEXT_PUBLIC_APP_URL, AWS_SES_REGION, AWS_SES_ENDPOINT, AWS_SES_ACCESS_KEY_ID or AWS_SES_SECRET_ACCESS_KEY",
  );
}

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

const client = new SESClient({
  region: process.env.AWS_SES_REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  },
});

export async function sendVerificationEmail(
  username: string,
  email: string,
  token: string,
) {
  const confirmationLink = `${domain}/new-verification?token=${token}`;
  const verificationEmail = new SendEmailCommand({
    Source: "Hello! Picboard <notifications@hellopicboard.com>",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Welcome to Hello! Picboard",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
          <p>Hello ${username},</p>
          <p>Thank you for creating an account with Hello! Picboard. To get started, please verify your email address by clicking the link below:</p>
          <p><a href="${confirmationLink}">Verify Email Address</a></p>
          <p>Or copy and paste this link in your browser:</p>
          <p>${confirmationLink}</p>
          <p>If you did not create this account, please ignore this email or contact us at support@hellopicboard.com.</p>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
          Hello ${username},
          Thank you for creating an account with Hello! Picboard. To get started, please verify your email address by clicking the link below:
          ${confirmationLink}
          If you did not create this account, please ignore this email or contact us at support@hellopicboard.com.
          `,
        },
      },
    },
  });

  await client.send(verificationEmail);
}

// export async function sendVerificationEmail(email: string, token: string) {
//   const confirmLink = `${domain}/new-verification?token=${token}`;

//   await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: email,
//     subject: "Confirm your email",
//     html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
//   });
// }

export async function sendResetPasswordEmail(
  username: string,
  email: string,
  token: string,
) {
  const resetLink = `${domain}/new-password?token=${token}`;
  const resetPasswordEmail = new SendEmailCommand({
    Source: "Hello! Picboard <notifications@hellopicboard.com>",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Reset your password",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
          <p>Hello ${username},</p>
          <p>We received a request to reset your password. If you did not make this request, you may ignore this email.</p>
          <p>To reset your password, click the following link:</p>
          <p><a href="${resetLink}" target="_blank">Reset Password</a></p>
          <p>Or copy and paste this link in your browser:</p>
          <p>${resetLink}</p>
          <p>This link will expire in 1 hour.</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
          Hello ${username},
          We received a request to reset your password. If you did not make this request, you may ignore this email.
          To reset your password, click the following link:
          ${resetLink}
          This link will expire in 1 hour.
          `,
        },
      },
    },
  });

  await client.send(resetPasswordEmail);
}

// export async function sendResetPasswordEmail(email: string, token: string) {
//   const resetLink = `${domain}/new-password?token=${token}`;

//   await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: email,
//     subject: "Reset your password",
//     html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.<br>If you did not make this request, you may ignore this.</p>`,
//   });
// }

export async function sendPasswordChangedEmail(
  username: string,
  email: string,
) {
  const passwordChangedEmail = new SendEmailCommand({
    Source: "Hello! Picboard <notifications@hellopicboard.com>",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Your password has been changed",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
          <p>Hello ${username},</p>
          <p>This is to inform you that your password has been changed.</p>
          <p>If you did not make this change or suspect any unauthorized activity, please contact us immediately at support@hellopicboard.com.</p>
          <p>If you made this change, you can disregard this email.</p>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
          Hello ${username},
          This is to inform you that your password has been changed.
          If you did not make this change or suspect any unauthorized activity, please contact us immediately at support@hellopicboard.com.
          If you made this change, you can disregard this email.
          `,
        },
      },
    },
  });

  await client.send(passwordChangedEmail);
}

// export async function sendPasswordChangedEmail(
//   email: string,
//   token: string,
// ) {
//   const resetLink = `${domain}/new-password?token=${token}`;

//   await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: email,
//     subject: "Your password has been changed!",
//     html: `<p>Your password has been changed. If you didn't make this change, please <a href="${resetLink}">reset your password</a> immediately. </p>`,
//   });
// }

export async function sendTwoFactorTokenEmail(username: string, email: string) {
  const twoFactorToken = await generateTwoFactorToken(email);
  const twoFactorEmail = new SendEmailCommand({
    Source: "Hello! Picboard <notifications@hellopicboard.com>",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Two Factor Authentication Code",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
          <p>Hello ${username},</p>
          <p>Your two factor authentication code is:</p>
          <p><code style="font-size: 24px">${twoFactorToken.token}</code></p>
          <p>This code will expire in 5 minutes.</p>
          <p>If you did not request this code, please ignore this email.</p>
          <p>Keep your code secure and do not share it with anyone.</p>
          <p>If you have any questions or need assistance, please contact us at support@hellopicboard.com.</p>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
          Hello ${username},
          Your two factor authentication code is:
          <code>${twoFactorToken.token}</code>
          This code will expire in 5 minutes.
          If you did not request this code, please ignore this email.
          Keep your code secure and do not share it with anyone.
          If you have any questions or need assistance, please contact us at support@hellopicboard.com.
          `,
        },
      },
    },
  });
  await client.send(twoFactorEmail);
}

// export async function sendTwoFactorTokenEmail(email: string) {
//   const twoFactorToken = await generateTwoFactorToken(email);
//   await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: twoFactorToken.email,
//     subject: "2FA Code",
//     html: `<p>Your 2FA code: ${twoFactorToken.token}. This code expires in 5 minutes.</p>`,
//   });
// }
