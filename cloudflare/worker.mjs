const json = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

// No keys, request bodies, or responses are logged or persisted.
export async function relay(request, upstream = fetch) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  let input;
  try { input = await request.json(); }
  catch { return json({ error: 'Invalid JSON' }, 400); }
  const { apiKey, method, path, body } = input || {};
  if (!apiKey || !method || !path) return json({ error: 'Missing required fields: apiKey, method, path' }, 400);
  // Keep user credentials strictly on the provider origin, including redirects.
  let url;
  try {
    url = new URL(`https://developers.hostinger.com${path}`);
    if (typeof apiKey !== 'string' || typeof method !== 'string' || typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//') || path.includes('\\') || url.origin !== 'https://developers.hostinger.com' || url.username || url.password) throw new Error();
  } catch { return json({ error: 'Invalid Hostinger request' }, 400); }
  try {
    const response = await upstream(url.href, {
      method,
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      redirect: 'manual',
    });
    if (response.status >= 300 && response.status < 400) {
      return json({ error: 'Hostinger redirected the request' }, 502);
    }
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { message: text }; }
    const result = Array.isArray(data) ? { data, _httpStatus: response.status } : { ...data, _httpStatus: response.status };
    if ([204, 205, 304].includes(response.status)) return new Response(null, { status: response.status, headers: { 'Cache-Control': 'no-store' } });
    return json(result, response.status);
  } catch (error) {
    const code = /illegal invocation|incorrect.*this/i.test(error.message) ? 'runtime_binding' : /redirect/i.test(error.message) ? 'upstream_redirect' : 'upstream_network';
    return json({ error: 'Hostinger request failed', code }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'botsetupguide.com') {
      url.hostname = 'www.botsetupguide.com';
      return Response.redirect(url.href, 307);
    }
    if (url.pathname === '/api/hostinger' || url.pathname === '/api/hostinger.js') return relay(request);
    if (url.pathname === '/' || url.pathname === '/upgrade') url.pathname = '/index.html';
    return env.ASSETS.fetch(new Request(url, request));
  },
};
