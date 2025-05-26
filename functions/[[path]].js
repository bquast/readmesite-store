/**
 * Cloudflare Pages Function - ASSETS_V5 approach
 * Expects requests like /themes/themename.css or /themes/themename-palette.css
 * Serves files from public/themes/
 */
export async function onRequest({ request, env, params }) {
    const url = new URL(request.url);
    const pathname = url.pathname; // e.g., /themes/darkmode.css

    console.log(`[ASSETS_V5] Request for: ${pathname}`);

    // Only handle paths starting with /themes/
    if (!pathname.startsWith('/themes/')) {
        if (pathname === '/') {
            console.log("[ASSETS_V5] Serving root.");
            return new Response(`
                <!DOCTYPE html>
                <html lang="en" style="font-family: sans-serif;">
                <head><title>READMEsite Themes</title></head>
                <body>
                    <h1>Welcome to READMEsite Themes Store!</h1>
                    <p>Themes are served from /themes/themename.css (and .html)</p>
                </body>
                </html>`, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
        console.log(`[ASSETS_V5] Path ${pathname} not under /themes/ and not root. Returning 404.`);
        return new Response(`Not Found: Invalid path ${pathname}`, { status: 404 });
    }

    // pathname is like /themes/darkmode.css or /themes/darkmode-ocean.css
    // We want to fetch this exact path from the static assets (which maps to public/themes/...)
    const assetPathToFetch = pathname; // The full path as requested

    // Basic validation for filename part
    const filename = pathname.substring('/themes/'.length);
    if (!filename || (!filename.endsWith('.css') && !filename.endsWith('.html'))) {
        console.log(`[ASSETS_V5] Invalid file extension or missing filename in: ${pathname}`);
        return new Response(`Not Found: Invalid file requested ${filename}`, { status: 404 });
    }
    
    console.log(`[ASSETS_V5] Attempting env.ASSETS.fetch for: '${assetPathToFetch}' (maps to public${assetPathToFetch})`);
    try {
        // Create a new request object for the asset path.
        // env.ASSETS.fetch uses the pathname of this new request.
        const assetRequestUrl = new URL(assetPathToFetch, url.origin).toString();
        const assetRequest = new Request(assetRequestUrl, request);
        
        const assetResponse = await env.ASSETS.fetch(assetRequest);

        if (assetResponse.status === 404) {
             console.error(`[ASSETS_V5] env.ASSETS.fetch returned 404 for: ${assetPathToFetch}. Ensure 'public${assetPathToFetch}' exists.`);
             return new Response(`Error: Asset ${assetPathToFetch} not found by ASSETS.fetch.`, { status: 404 });
        }
        console.log(`[ASSETS_V5] env.ASSETS.fetch successful for ${assetPathToFetch}, status: ${assetResponse.status}`);
        return assetResponse;

    } catch (e) {
         console.error(`[ASSETS_V5] Error during env.ASSETS.fetch for ${assetPathToFetch}: ${e.message}`, e);
         return new Response(`Internal Server Error during ASSETS.fetch: ${e.message}`, { status: 500 });
    }
}