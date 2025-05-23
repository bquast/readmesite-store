/**
 * Cloudflare Pages Function to handle theme requests for store.readme.site.
 * It routes requests like /themename/asset.json to static files 
 * in /public/themes/themename/asset.json and handles future @user/theme logic.
 */
export async function onRequest({ request, env, params, next }) {
    const url = new URL(request.url);
    let pathSegments = params.path; 

    // Ensure pathSegments is always an array and filter empty segments (often occurs for root /)
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
        if (pathSegments.length !== 3) {
            return new Response("Not Found - Invalid user theme path. Expected format: /@username/themename/asset", { status: 404 });
        }
        const user = pathSegments[0];
        const theme = pathSegments[1];
        assetName = pathSegments[2];
        
        // --- Future Logic ---
        // Here you would look up if 'user' owns 'theme' and map to its storage.
        // For now, we return 404 as it's not implemented.
        console.log(`User theme request: ${user}/${theme}/${assetName} (Not implemented)`);
        return new Response(`User themes like ${user}/${theme} are not yet supported.`, { status: 501 }); // 501 Not Implemented
    } 
    // Handle global themes: /theme/asset
    else {
        if (pathSegments.length !== 2) {
            return new Response("Not Found - Invalid global theme path. Expected format: /themename/asset", { status: 404 });
        }
        const theme = pathSegments[0];
        assetName = pathSegments[1];

        // --- Future Logic ---
        // Here you would look up if 'theme' is a global theme and map it.
        // For now, we only handle 'darkmode'.
        if (theme !== 'darkmode') {
             return new Response(`Theme '${theme}' not found. Only 'darkmode' is currently available.`, { status: 404 });
        }
        // Map the public URL to the internal static asset path
        themePathPrefix = `/themes/${theme}`; 
    }

    // Construct the path to the static asset within the /public directory
    const assetPath = `${themePathPrefix}/${assetName}`; 
    console.log(`Routing request for '${url.pathname}' to static asset: '${assetPath}'`);

    try {
        // Create a new request object with the internal path
        const assetRequest = new Request(new URL(assetPath, url.origin).toString(), request);
        
        // Use env.ASSETS.fetch (or context.next() in newer Pages versions) 
        // to serve the file from the /public directory.
        const assetResponse = await env.ASSETS.fetch(assetRequest);

        if (assetResponse.status === 404) {
             console.warn(`Asset not found at internal path: ${assetPath}`);
             return new Response(`Asset '${assetName}' not found for the theme.`, { status: 404 });
        }

        // Return the asset response
        return assetResponse;

    } catch (e) {
         console.error(`Error fetching asset ${assetPath}:`, e);
         return new Response("Internal Server Error while fetching theme asset.", { status: 500 });
    }
}