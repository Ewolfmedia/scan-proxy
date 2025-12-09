// Vercel Edge Function - DNS lookups for email security (SPF, DKIM, DMARC)
// Used by Wolf-Agents email security scanning tools

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const type = searchParams.get('type') || 'TXT'; // TXT, MX, A, AAAA, etc.

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!domain) {
    return new Response(
      JSON.stringify({ error: 'Missing domain parameter' }),
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    // Use Cloudflare's DNS over HTTPS
    const dnsUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`;
    
    const response = await fetch(dnsUrl, {
      headers: { 'Accept': 'application/dns-json' },
    });

    const data = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        domain: domain,
        type: type,
        records: data.Answer || [],
        status: data.Status,
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
