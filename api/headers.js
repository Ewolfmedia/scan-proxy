// Vercel Edge Function - Fetches HTTP headers from any URL
// Used by Wolf-Agents security scanning tools

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  // CORS headers for cross-origin requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!targetUrl) {
    return new Response(
      JSON.stringify({ error: 'Missing url parameter' }),
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    // Normalize URL
    let url = targetUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Always use GET to ensure all headers are returned
    // (some servers return fewer headers with HEAD)
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'Wolf-Security-Scanner/1.0' },
    });

    // Collect headers
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return new Response(
      JSON.stringify({
        success: true,
        url: response.url,
        status: response.status,
        headers: headers,
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
