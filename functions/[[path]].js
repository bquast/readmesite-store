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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>READMEsite Themes Store</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f9f9f9; }
        .store-container { max-width: 900px; margin: 20px auto; background-color: #fff; border: 1px solid #eee; border-radius: 8px; padding: 30px; }
        h1, h2 { border-bottom: 1px solid #eee; padding-bottom: 10px; color: #000; }
        h1 { text-align: center; border: none; }
        .theme-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; }
        .theme-card { border: 1px solid #ddd; border-radius: 6px; padding: 20px; transition: box-shadow 0.2s ease; }
        .theme-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .theme-card h3 { margin-top: 0; display: flex; justify-content: space-between; align-items: center; }
        .theme-card h3 a { font-size: 0.7em; font-weight: normal; color: #0366d6; text-decoration: none; }
        .theme-card h3 a:hover { text-decoration: underline; }
        .palette { display: flex; height: 30px; border-radius: 4px; overflow: hidden; margin: 10px 0; border: 1px solid #ccc; }
        .palette-color { flex-grow: 1; }
        .palette-split { display: flex; flex-grow: 1; }
        code { background-color: #eef; color: #333; padding: 3px 6px; border-radius: 3px; font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.9em; display: block; margin-top: 10px; white-space: pre; }
        .footer { text-align: center; margin-top: 40px; font-size: 0.9em; color: #888; }
        @media (prefers-color-scheme: dark) {
            body { background-color: #1a1a1a; color: #e0e0e0; }
            .store-container { background-color: #2c2c2c; border-color: #444; }
            h1, h2 { border-color: #555; color: #f0f0f0; }
            .theme-card { border-color: #555; }
            .theme-card h3 a { color: #58a6ff; }
            code { background-color: #334; color: #e0e0e0; }
            .footer { color: #aaa; }
        }
    </style>
</head>
<body>
    <div class="store-container">
        <h1>READMEsite Theme Store</h1>
        <p>Choose a theme to style your READMEsite! Use the theme name with the <code>--theme</code> flag.</p>
        
        <h2>Available Themes</h2>

        <div class="theme-list">

            <div class="theme-card">
                <h3>Darkmode <a href="/themes/darkmode.css" target="_blank">View CSS</a></h3>
                <div class="palette">
                    <div class="palette-color" style="background-color: #1a1a1a;"></div>
                    <div class="palette-color" style="background-color: #2c2c2c;"></div>
                    <div class="palette-color" style="background-color: #e0e0e0;"></div>
                    <div class="palette-color" style="background-color: #c9d1d9;"></div>
                    <div class="palette-color" style="background-color: #58a6ff;"></div>
                </div>
                <code>npx readmesite --theme darkmode</code>
            </div>

            <div class="theme-card">
                <h3>System <a href="/themes/system.css" target="_blank">View CSS</a></h3>
                <div class="palette">
                    <div class="palette-split">
                         <div class="palette-color" style="background-color: #ffffff;"></div>
                         <div class="palette-color" style="background-color: #f6f8fa;"></div>
                         <div class="palette-color" style="background-color: #24292e;"></div>
                    </div>
                     <div class="palette-split">
                         <div class="palette-color" style="background-color: #1a1a1a;"></div>
                         <div class="palette-color" style="background-color: #2c2c2c;"></div>
                         <div class="palette-color" style="background-color: #e0e0e0;"></div>
                    </div>
                </div>
                <code>npx readmesite --theme system</code>
            </div>

            <div class="theme-card">
                <h3>Solarized <a href="/themes/solarized.css" target="_blank">View CSS</a></h3>
                <div class="palette">
                    <div class="palette-color" style="background-color: #fdf6e3;"></div>
                    <div class="palette-color" style="background-color: #eee8d5;"></div>
                    <div class="palette-color" style="background-color: #002b36;"></div>
                    <div class="palette-color" style="background-color: #073642;"></div>
                    <div class="palette-color" style="background-color: #268bd2;"></div>
                    <div class="palette-color" style="background-color: #859900;"></div>
                </div>
                <code>npx readmesite --theme solarized</code>
            </div>

            <div class="theme-card">
                <h3>Solarized Light <a href="/themes/solarized-light.css" target="_blank">View CSS</a></h3>
                <div class="palette">
                    <div class="palette-color" style="background-color: #fdf6e3;"></div>
                    <div class="palette-color" style="background-color: #eee8d5;"></div>
                    <div class="palette-color" style="background-color: #93a1a1;"></div>
                    <div class="palette-color" style="background-color: #657b83;"></div>
                    <div class="palette-color" style="background-color: #268bd2;"></div>
                    <div class="palette-color" style="background-color: #b58900;"></div>
                </div>
                <code>npx readmesite --theme solarized-light</code>
            </div>

            <div class="theme-card">
                <h3>Solarized Dark <a href="/themes/solarized-dark.css" target="_blank">View CSS</a></h3>
                <div class="palette">
                    <div class="palette-color" style="background-color: #002b36;"></div>
                    <div class="palette-color" style="background-color: #073642;"></div>
                    <div class="palette-color" style="background-color: #586e75;"></div>
                    <div class="palette-color" style="background-color: #839496;"></div>
                    <div class="palette-color" style="background-color: #268bd2;"></div>
                    <div class="palette-color" style="background-color: #dc322f;"></div>
                </div>
                <code>npx readmesite --theme solarized-dark</code>
            </div>

            <div class="theme-card">
                <h3>Nord <a href="/themes/nord.css" target="_blank">View CSS</a></h3>
                <div class="palette">
                    <div class="palette-color" style="background-color: #2e3440;"></div>
                    <div class="palette-color" style="background-color: #3b4252;"></div>
                    <div class="palette-color" style="background-color: #d8dee9;"></div>
                    <div class="palette-color" style="background-color: #88c0d0;"></div>
                    <div class="palette-color" style="background-color: #a3be8c;"></div>
                </div>
                <code>npx readmesite --theme nord</code>
            </div>

            <div class="theme-card">
                <h3>Dracula <a href="/themes/dracula.css" target="_blank">View CSS</a></h3>
                <div class="palette">
                    <div class="palette-color" style="background-color: #282a36;"></div>
                    <div class="palette-color" style="background-color: #44475a;"></div>
                    <div class="palette-color" style="background-color: #f8f8f2;"></div>
                    <div class="palette-color" style="background-color: #bd93f9;"></div>
                    <div class="palette-color" style="background-color: #50fa7b;"></div>
                    <div class="palette-color" style="background-color: #ff79c6;"></div>
                </div>
                <code>npx readmesite --theme dracula</code>
            </div>

            <div class="theme-card">
                <h3>Monokai <a href="/themes/monokai.css" target="_blank">View CSS</a></h3>
                <div class="palette">
                    <div class="palette-color" style="background-color: #272822;"></div>
                    <div class="palette-color" style="background-color: #75715e;"></div>
                    <div class="palette-color" style="background-color: #f8f8f2;"></div>
                    <div class="palette-color" style="background-color: #f92672;"></div>
                    <div class="palette-color" style="background-color: #a6e22e;"></div>
                    <div class="palette-color" style="background-color: #66d9ef;"></div>
                </div>
                <code>npx readmesite --theme monokai</code>
            </div>

            <div class="theme-card">
                <h3>Clean <a href="/themes/clean.css" target="_blank">View CSS</a></h3>
                <div class="palette">
                    <div class="palette-color" style="background-color: #ffffff;"></div>
                    <div class="palette-color" style="background-color: #eeeeee;"></div>
                    <div class="palette-color" style="background-color: #f8f8f8;"></div>
                    <div class="palette-color" style="background-color: #333333;"></div>
                    <div class="palette-color" style="background-color: #007bff;"></div>
                </div>
                <code>npx readmesite --theme clean</code>
            </div>

            <div class="theme-card">
                <h3>Academic <a href="/themes/academic.css" target="_blank">View CSS</a></h3>
                <div class="palette">
                    <div class="palette-color" style="background-color: #fbfaf7;"></div>
                    <div class="palette-color" style="background-color: #ffffff;"></div>
                    <div class="palette-color" style="background-color: #e0e0e0;"></div>
                    <div class="palette-color" style="background-color: #333333;"></div>
                    <div class="palette-color" style="background-color: #0056b3;"></div>
                </div>
                <code>npx readmesite --theme academic</code>
            </div>

            <div class="theme-card">
                <h3>Retro <a href="/themes/retro.css" target="_blank">View CSS</a></h3>
                <div class="palette">
                    <div class="palette-color" style="background-color: #0a0a2a;"></div>
                    <div class="palette-color" style="background-color: #1a1a3a;"></div>
                    <div class="palette-color" style="background-color: #33ff33;"></div>
                    <div class="palette-color" style="background-color: #ffff33;"></div>
                    <div class="palette-color" style="background-color: #00cc00;"></div>
                </div>
                <code>npx readmesite --theme retro</code>
            </div>

        </div> <div class="footer">
            <p>Themes provided by the <a href="https://github.com/bquast/readmesite-store">READMEsite Store</a>.</p>
        </div>
    </div>
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