const ZEPTOMAIL_API = 'https://api.zeptomail.com/v1.1/email';

function parseFrom(from: string): { address: string; name?: string } {
  const match = from.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) return { name: match[1].trim(), address: match[2].trim() };
  return { address: from.trim() };
}

export async function sendZeptomail(params: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.ZEPTOMAIL_API_KEY;
  if (!apiKey) {
    throw new Error('ZEPTOMAIL_API_KEY environment variable is not set');
  }

  const fromStr = params.from ?? process.env.ZEPTOMAIL_FROM_EMAIL ?? 'noreply@refferq.com';
  const from = parseFrom(fromStr);

  const response = await fetch(ZEPTOMAIL_API, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-enczapikey ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [{ email_address: { address: params.to } }],
      subject: params.subject,
      htmlbody: params.html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }

  return { success: true };
}
