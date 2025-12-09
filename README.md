# Scan Proxy

Lightweight proxy for Wolf-Agents security scanning tools.

## Endpoints

- `GET /api/headers?url=example.com` - Fetch HTTP headers
- `GET /api/dns?domain=example.com&type=TXT` - DNS lookups (SPF, DKIM, DMARC)

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ewolfmedia/scan-proxy)
