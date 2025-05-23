/**
 * Cloudflare Pages Function to handle theme requests for store.readme.site.
 * It routes /themename/asset to /internal-assets/themename/asset 
 * and relies on _routes.json (in ROOT) to serve /internal-assets/* statically.
 */
export async function onRequest({ request, params }) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    // FIX: Handle cases where params.path might be undefined (like root URL requests)
    let pathSegments = (params.path || []).filter(segment => segment.length > 0); 

    console.log(`Function received request for: ${pathname}`);

    // Handle root / request - Show a simple landing page
    if (pathSegments.length === 0) {
        console.log("Serving root page.");
        return new Response(`
            <!DOCTYPE html>
            <html lang="en" style="font-family: sans-serif; background-color: #f0f0f0; color: #333;">
            <head>
               <meta charset="UTF-8">
               <meta name="viewport" content="width=device-width, initial-scale=1.0">
               <title>READMEsite Themes</title>
               <style>
                   body { max-width: 600px; margin: 50px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                   a { color: #0366d6; }
                   code { background-color: #eef; padding: 2px 5px; border-radius: 3px; }
               </style>
            </head>
            <body>
                <h1>Welcome to READMEsite Themes Store!</h1>
                <p>This is where themes for <a href="https://readme.site" target="_blank">READMEsite</a> live.</p>
                <p>Available themes:</p>
                <ul>
                    <li><a href="/darkmode/theme.json">darkmode</a> (Global)</li>
                </ul>
                <p>You can use a theme with the command: <code>npx readmesite --theme darkmode</code></p>
            </body>
            </html>`, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    // If it somehow still gets an internal path, 404. It shouldn't if _routes.json works.
    if (pathSegments[0] === 'internal-assets') {
        console.error(`Function was hit by internal path: ${url.pathname}. _routes.json might be wrong.`);
        return new Response(`Not Found - Internal path hit function.`, { status: 404 });
    }

    if (pathSegments[0].startsWith('@')) {
        return new Response(`User themes not yet supported.`, { status: 501 });
    }

    if (pathSegments.length !== 2) {
        return new Response(`Not Found - Invalid path. Expected /themename/asset. Got: ${url.pathname}`, { status: 404 });
    }

    const theme = pathSegments[0];
    const assetName = pathSegments[1];

    if (theme !== 'darkmode') {
        return new Response(`Theme '${theme}' not found.`, { status: 404 });
    }

    // Rewrite the path to the internal, static-only path
    const assetPath = `/internal-assets/${theme}/${assetName}`;
    console.log(`Rewriting '${url.pathname}' to static path: '${assetPath}'`);

    try {
        const newUrl = new URL(assetPath, url.origin);
        const newRequest = new Request(newUrl.toString(), request);
        // Fetch the rewritten path - _routes.json should make this hit static assets.
        return fetch(newRequest);
    } catch (e) {
        console.error(`Error during fetch for ${assetPath}:`, e);
        return new Response("Internal Server Error during fetch.", { status: 500 });
    }
}