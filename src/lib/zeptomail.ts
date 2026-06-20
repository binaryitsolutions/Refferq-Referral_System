import { SendMailClient } from 'zeptomail';

const ZEPTOMAIL_URL = 'https://api.zeptomail.com/v1.1/email';

function parseFrom(from: string): { address: string; name: string } {
  const match = from.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) return { name: match[1].trim(), address: match[2].trim() };
  return { address: from.trim(), name: from.trim() };
}

export async function sendZeptomail(params: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<{ success: boolean; error?: string }> {
  const token = process.env.ZEPTOMAIL_API_KEY;
  if (!token) {
    throw new Error('ZEPTOMAIL_API_KEY environment variable is not set');
  }

  const fromStr = params.from ?? process.env.ZEPTOMAIL_FROM_EMAIL ?? 'noreply@refferq.com';
  const from = parseFrom(fromStr);

  const client = new SendMailClient({ url: ZEPTOMAIL_URL, token });

  try {
    await client.sendMail({
      from,
      to: [{ email_address: { address: params.to, name: params.to } }],
      subject: params.subject,
      htmlbody: params.html,
    });
    return { success: true };
  } catch (error: any) {
    const message = error?.message ?? JSON.stringify(error);
    return { success: false, error: message };
  }
}
