/**
 * Cloudflare Pages Function - ASSETS_V3 approach
 */
export async function onRequest({ request, env, params }) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    let pathSegments = (params.path || []).filter(segment => segment.length > 0);

    console.log(`[ASSETS_V3] Request for: ${pathname}`);

    // Handle root / request
    if (pathSegments.length === 0) {
        console.log("[ASSETS_V3] Serving root.");
        return new Response(`
            <!DOCTYPE html>
            <html lang="en" style="font-family: sans-serif;">
            <head><title>READMEsite Themes</title></head>
            <body>
                <h1>Welcome to READMEsite Themes Store!</h1>
                <p>Theme store is active. Try fetching /darkmode/theme.json, /darkmode/style.css, /darkmode/index.html</p>
            </body>
            </html>`, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    const requestedTheme = pathSegments[0];
    const requestedAsset = pathSegments.length > 1 ? pathSegments[1] : null;

    // Only handle /darkmode/* for now
    if (requestedTheme === 'darkmode' && requestedAsset) {
        // Ensure asset name is one of the allowed files
        if (!['theme.json', 'style.css', 'index.html'].includes(requestedAsset)) {
            console.log(`[ASSETS_V3] Invalid asset requested: ${requestedAsset}`);
            return new Response(`Not Found: Invalid asset ${requestedAsset} for theme ${requestedTheme}`, { status: 404 });
        }

        const assetPath = `/themes/darkmode/${requestedAsset}`; // Path relative to site root
        const assetUrlToFetch = new URL(assetPath, url.origin).toString(); 

        console.log(`[ASSETS_V3] Path: ${pathname} -> Attempting env.ASSETS.fetch for: '${assetUrlToFetch}'`);
        try {
            const assetResponse = await env.ASSETS.fetch(assetUrlToFetch);

            if (assetResponse.status === 404) {
                 console.error(`[ASSETS_V3] env.ASSETS.fetch returned 404 for: ${assetUrlToFetch}. Ensure 'public${assetPath}' exists.`);
                 return new Response(`Error: Asset ${assetPath} not found by ASSETS.fetch.`, { status: 404 });
            }
            console.log(`[ASSETS_V3] env.ASSETS.fetch successful for ${assetUrlToFetch}, status: ${assetResponse.status}`);
            return assetResponse;

        } catch (e) {
             console.error(`[ASSETS_V3] Error during env.ASSETS.fetch for ${assetUrlToFetch}: ${e.message}`, e);
             return new Response(`Internal Server Error during ASSETS.fetch: ${e.message}`, { status: 500 });
        }
    }

    console.log(`[ASSETS_V3] Path ${pathname} did not match defined rules. Returning 404.`);
    return new Response(`Not Found: ${pathname}`, { status: 404 });
}