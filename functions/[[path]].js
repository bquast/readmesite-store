export async function onRequest({ request, env }) { // Simplified params
    const url = new URL(request.url);
    const pathname = url.pathname;

    console.log(`[SIMPLE] Request for: ${pathname}`);

    // Only handle /darkmode/theme.json for now
    if (pathname === '/darkmode/theme.json') {
        // TRY THE PATH *WITHOUT* LEADING SLASH
        const assetPath = 'themes/darkmode/theme.json'; 
        console.log(`[SIMPLE] Attempting ASSETS.fetch for: '${assetPath}'`);
        try {
            // Fetch needs a full URL, but ASSETS might use the path internally.
            // Let's construct the request based on the *internal* path idea.
            // We still need a valid URL for the Request object, use the original.
            // But we need to tell ASSETS.fetch WHAT to fetch.
            // The docs imply ASSETS.fetch(request) uses the request's URL.
            // So we NEED to give it a request with the /themes/ path.
            
            const internalAssetUrl = new URL(`/themes/darkmode/theme.json`, url.origin);
            const assetRequest = new Request(internalAssetUrl.toString(), request);
            
            const assetResponse = await env.ASSETS.fetch(assetRequest);

            if (assetResponse.status === 404) {
                 console.error(`[SIMPLE] ASSETS.fetch got 404 for: ${internalAssetUrl.pathname}`);
                 return new Response(`ASSETS.fetch 404.`, { status: 404 });
            }
            console.log(`[SIMPLE] ASSETS.fetch OK.`);
            return assetResponse;

        } catch (e) {
             console.error(`[SIMPLE] ASSETS.fetch error:`, e);
             return new Response(`ASSETS.fetch Error: ${e.message}`, { status: 500 });
        }
    }

    console.log(`[SIMPLE] Path ${pathname} not matched. 404.`);
    return new Response(`Not Found: ${pathname}`, { status: 404 });
}