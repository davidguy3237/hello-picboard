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

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email. </p>`,
  });
}
