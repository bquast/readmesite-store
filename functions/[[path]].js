/**
 * Cloudflare Pages Function to handle theme requests for store.readme.site.
 * It routes /themename/asset to /internal-assets/themename/asset 
 * and relies on _routes.json to serve /internal-assets/* statically.
 */
export async function onRequest({ request, params }) {
    const url = new URL(request.url);
    let pathSegments = params.path; 

    // Ensure pathSegments is always an array and filter empty segments
    if (!Array.isArray(pathSegments)) {
        pathSegments = [];
    } else {
        pathSegments = pathSegments.filter(segment => segment.length > 0);
    }

    // Handle root / request - Show a simple landing page
    if (pathSegments.length === 0) {
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
                 <p>Want to add your own theme? User accounts and uploads coming soon!</p>
             </body>
             </html>`, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    let themePathPrefix;
    let assetName;

    // Handle user themes: /@user/theme/asset
    if (pathSegments[0].startsWith('@')) {
        // --- Future Logic ---
        return new Response(`User themes are not yet supported.`, { status: 501 }); // 501 Not Implemented
    } 
    // Handle global themes: /theme/asset
    else {
        if (pathSegments.length !== 2) {
            return new Response(`Not Found - Invalid path. Expected /themename/asset. Got: ${url.pathname}`, { status: 404 });
        }
        const theme = pathSegments[0];
        assetName = pathSegments[1];

        if (theme !== 'darkmode') {
             return new Response(`Theme '${theme}' not found.`, { status: 404 });
        }
        // Map to the internal, static-only path
        themePathPrefix = `/internal-assets/${theme}`; 
    }

    // Construct the path to the static asset
    const assetPath = `${themePathPrefix}/${assetName}`; 
    console.log(`Rewriting '${url.pathname}' to static path: '${assetPath}'`);

    try {
        // Create a new request for the static path
        const newUrl = new URL(assetPath, url.origin);
        const newRequest = new Request(newUrl.toString(), request);

        // Fetch the rewritten path. Since /internal-assets/* is excluded 
        // from functions (by _routes.json), this will hit the 
        // static asset handler provided by Cloudflare Pages.
        return fetch(newRequest);

    } catch (e) {
         console.error(`Error during fetch for ${assetPath}:`, e);
         return new Response("Internal Server Error during fetch.", { status: 500 });
    }
}