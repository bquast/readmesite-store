/**
 * Cloudflare Pages Function - ASSETS.fetch approach
 */
export async function onRequest({ request, env, params }) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    let pathSegments = (params.path || []).filter(segment => segment.length > 0);

    console.log(`[ASSETS] Request for: ${pathname}`);

    // Handle root / request
    if (pathSegments.length === 0) {
        console.log("[ASSETS] Serving root.");
        return new Response(`
            <!DOCTYPE html>
            <html lang="en" style="font-family: sans-serif;">
            <head><title>READMEsite Themes</title></head>
            <body>
                <h1>Welcome to READMEsite Themes Store!</h1>
                <p>Available themes: <a href="/darkmode/theme.json">darkmode</a></p>
            </body>
            </html>`, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    // If request is for /themes/ - it MUST NOT hit here. If it does, ASSETS is re-routing.
    if (pathSegments[0] === 'themes') {
        console.error(`[ASSETS] Function caught /themes/ path: ${pathname}. ASSETS.fetch is likely re-routing!`);
        return new Response(`Error: /themes/ path hit function.`, { status: 500 });
    }

    if (pathSegments[0].startsWith('@')) {
        return new Response(`User themes not yet supported.`, { status: 501 });
    }

    if (pathSegments.length !== 2) {
        return new Response(`Not Found: Invalid path. Expected /themename/asset. Got: ${pathname}`, { status: 404 });
    }

    const theme = pathSegments[0];
    const assetName = pathSegments[1];

    if (theme !== 'darkmode') {
        return new Response(`Theme '${theme}' not found.`, { status: 404 });
    }

    // Rewrite to /themes/
    const assetPath = `/themes/<span class="math-inline">\{theme\}/</span>{assetName}`;
    console.log(`[ASSETS] Rewriting '<span class="math-inline">\{pathname\}' to '</span>{assetPath}' and fetching via env.ASSETS.fetch.`);

    try {
        const assetUrl = new URL(assetPath, url.origin);
        const assetRequest = new Request(assetUrl.toString(), request);

        // Fetch using ASSETS.fetch
        const assetResponse = await env.ASSETS.fetch(assetRequest);

        if (assetResponse.status === 404) {
             console.error(`[ASSETS] env.ASSETS.fetch got 404 for: ${assetPath}. Are files in public/themes/?`);
             return new Response(`ASSETS.fetch 404 for ${assetPath}.`, { status: 404 });
        }
        console.log(`[ASSETS] env.ASSETS.fetch successful for ${assetPath}`);
        return assetResponse;

    } catch (e) {
         console.error(`[ASSETS] Error during env.ASSETS.fetch for ${assetPath}:`, e);
         return new Response(`Internal Server Error during ASSETS.fetch: ${e.message}`, { status: 500 });
    }
}