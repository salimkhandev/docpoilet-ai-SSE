import chromium from "@sparticuz/chromium-min";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes for very large files (47+ pages)

type RenderPayload = {
  html: string;
  css?: string;
  tailwindConfig?: string;
};

const TAILWIND_CDN_REGEX =
  /<script[^>]+src=["']https:\/\/cdn\.tailwindcss\.com["'][^>]*><\/script>/i;
const SCRIPT_REGEX = /<script\b[^>]*>[\s\S]*?<\/script>/gi;

const stripScriptTags = (script?: string) =>
  script?.replace(/^<script\b[^>]*>/i, "").replace(/<\/script>$/i, "").trim();

const buildTailwindConfigTag = (config?: string) => {
  const sanitizedConfig = stripScriptTags(config);

  const applyUserConfig = sanitizedConfig
    ? `try { ${sanitizedConfig} } catch (error) { console.error("Failed to apply custom Tailwind config:", error); }`
    : "";

  // Preflight is ENABLED for proper Tailwind CSS behavior
  // Preflight only resets browser defaults - it doesn't affect inline/internal CSS
  // This ensures borders, spacing, and other Tailwind utilities work correctly
  // Note: By not setting preflight: false, preflight is enabled by default
  const enforcePreflight = `try {
    if (!window.tailwind) window.tailwind = {};
    if (!tailwind.config) tailwind.config = {};
    // Preflight is enabled by default (Tailwind's standard behavior)
    // This ensures proper rendering of borders, spacing, and utilities
    // Custom inline/internal CSS styles are NOT affected by preflight
  } catch (error) {
    console.error("Failed to configure Tailwind:", error);
  }`;

  const scriptBody = [applyUserConfig, enforcePreflight].filter(Boolean).join("\n");
  return `<script>${scriptBody}</script>`;
};

const extractTailwindConfig = (html: string) => {
  let configScript: string | undefined;
  let sanitizedHtml = html;

  let match: RegExpExecArray | null;
  while ((match = SCRIPT_REGEX.exec(html))) {
    const scriptTag = match[0];
    if (scriptTag.toLowerCase().includes("tailwind.config")) {
      configScript = scriptTag;
      sanitizedHtml = sanitizedHtml.replace(scriptTag, "");
      break;
    }
  }

  return { sanitizedHtml, configScript };
};

const injectTailwindConfig = (html: string, tailwindConfigTag: string) => {
  if (!tailwindConfigTag) return html;

  if (TAILWIND_CDN_REGEX.test(html)) {
    return html.replace(TAILWIND_CDN_REGEX, (match) => `${match}\n${tailwindConfigTag}`);
  }

  if (html.includes("</head>")) {
    return html.replace("</head>", `${tailwindConfigTag}\n</head>`);
  }

  return `${tailwindConfigTag}${html}`;
};

const isFullHtmlDocument = (html: string) => {
  const trimmed = html.trim().toLowerCase();
  return trimmed.startsWith("<!doctype") || trimmed.startsWith("<html");
};

const extractScripts = (html: string, preserveTailwindCdn: boolean = false) => {
  const externalScripts: Array<{ src: string; tag: string }> = [];
  const inlineScripts: Array<{ content: string; tag: string }> = [];
  let htmlWithoutScripts = html;

  let match: RegExpExecArray | null;
  const scriptRegex = new RegExp(SCRIPT_REGEX.source, SCRIPT_REGEX.flags);
  while ((match = scriptRegex.exec(html))) {
    const scriptTag = match[0];
    
    // Preserve Tailwind CDN script if requested
    if (preserveTailwindCdn && TAILWIND_CDN_REGEX.test(scriptTag)) {
      continue;
    }
    
    const srcMatch = scriptTag.match(/src=["']([^"']+)["']/i);
    
    if (srcMatch) {
      externalScripts.push({ src: srcMatch[1], tag: scriptTag });
    } else {
      const contentMatch = scriptTag.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      if (contentMatch) {
        inlineScripts.push({ content: contentMatch[1], tag: scriptTag });
      }
    }
    
    htmlWithoutScripts = htmlWithoutScripts.replace(scriptTag, "");
  }

  return { externalScripts, inlineScripts, htmlWithoutScripts };
};

const buildHtmlDocument = (
  html: string,
  css: string | undefined,
  tailwindConfigTag: string,
) => {
  if (isFullHtmlDocument(html)) {
    let documentHtml = injectTailwindConfig(html, tailwindConfigTag);

    if (css && documentHtml.includes("</head>")) {
      documentHtml = documentHtml.replace("</head>", `<style>${css}</style></head>`);
    }

    // Remove all scripts from the HTML - they will be loaded separately
    // Preserve Tailwind CDN script as it's needed for Tailwind to work
    const { htmlWithoutScripts } = extractScripts(documentHtml, true);
    return htmlWithoutScripts;
  }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.tailwindcss.com"></script>
    ${tailwindConfigTag}
    <style>
      @page { size: A4; margin: 0; }
      html, body { margin: 0; padding: 0; background: #ffffff; color: #111827; }
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"; }
    </style>
    ${css ? `<style>${css}</style>` : ""}
  </head>
  <body>
    <div id="root" class="preview-scope">${html}</div>
  </body>
  </html>`;
};

// Robust wait function with progressive fallback strategy
const waitForPageReady = async (page: any, timeout: number = 180000) => {
  const startTime = Date.now();
  
  try {
    // Strategy 1: Wait for load event (fastest, most reliable)
    await Promise.race([
      page.evaluate(() => {
        return new Promise<void>((resolve) => {
          if (document.readyState === "complete") {
            resolve();
          } else {
            window.addEventListener("load", () => resolve(), { once: true });
          }
        });
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Load timeout")), Math.min(timeout, 60000))
      ),
    ]);
  } catch (error) {
    // Continue to next strategy
  }

  // Strategy 2: Wait for network to settle (with timeout)
  const remainingTime = timeout - (Date.now() - startTime);
  if (remainingTime > 10000) {
    try {
      // Try to wait for network idle, but with a shorter timeout
      await Promise.race([
        page.evaluate(() => {
          return new Promise<void>((resolve) => {
            let idleCount = 0;
            const checkIdle = () => {
              if (performance.getEntriesByType("resource").length > 0) {
                const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
                const activeResources = resources.filter(
                  (r) => r.responseEnd === 0 || Date.now() - r.responseEnd < 500
                );
                if (activeResources.length <= 2) {
                  idleCount++;
                  if (idleCount >= 2) {
                    resolve();
                    return;
                  }
                } else {
                  idleCount = 0;
                }
              } else {
                idleCount++;
                if (idleCount >= 2) {
                  resolve();
                  return;
                }
              }
              setTimeout(checkIdle, 250);
            };
            checkIdle();
          });
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Network idle timeout")), Math.min(remainingTime, 30000))
        ),
      ]);
    } catch (error) {
      // Continue anyway - page might be ready
    }
  }

  // Strategy 3: Final wait for any remaining dynamic content
  const finalWaitTime = timeout - (Date.now() - startTime);
  if (finalWaitTime > 1000) {
    await new Promise((resolve) => 
      setTimeout(resolve, Math.min(finalWaitTime, 3000))
    );
  }
};

// Retry helper with exponential backoff
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  operationName: string = "operation"
): Promise<T> => {
  let lastError: Error | unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`${operationName} failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

// Estimate document size to adjust timeouts
const estimateDocumentSize = (html: string): "small" | "medium" | "large" => {
  const size = html.length;
  if (size > 1000000) return "large"; // > 1MB
  if (size > 500000) return "medium"; // > 500KB
  return "small";
};

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as RenderPayload;
    const { html, css, tailwindConfig } = payload || {};
    
    if (!html || typeof html !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'html' in body" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Estimate document size to adjust timeouts dynamically
    const docSize = estimateDocumentSize(html);
    const baseTimeout = docSize === "large" ? 240000 : docSize === "medium" ? 180000 : 120000;
    
    const isProd =
      process.env.NODE_ENV === "production" ||
      process.env.VERCEL_ENV === "production";

    const browser = isProd
      ? await retryOperation(
          async () => {
            const puppeteer = await import("puppeteer-core");
            const executablePath = await chromium.executablePath(
              "https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar",
            );
            return puppeteer.default.launch({
              args: [...chromium.args, "--disable-dev-shm-usage", "--disable-gpu"],
              executablePath,
              headless: true,
            });
          },
          3,
          2000,
          "Browser launch"
        )
      : await retryOperation(
          () => (
            import("puppeteer")
          ).then((puppeteer) =>
            puppeteer.default.launch({
              headless: true,
              args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-software-rasterizer",
              ],
              executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
            })
          ),
          3,
          2000,
          "Browser launch"
        );
    
    const page = await browser.newPage();
    
    // Set timeouts based on document size
    page.setDefaultTimeout(baseTimeout);
    page.setDefaultNavigationTimeout(baseTimeout);
    
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

    const { sanitizedHtml, configScript: parsedConfigScript } =
      extractTailwindConfig(html);
    const effectiveConfig = tailwindConfig || parsedConfigScript;
    const tailwindConfigTag = buildTailwindConfigTag(effectiveConfig);
    
    // Extract scripts from the original HTML before building document
    const { externalScripts, inlineScripts } = extractScripts(sanitizedHtml);
    
    const htmlDocument = buildHtmlDocument(
      sanitizedHtml,
      css,
      tailwindConfigTag,
    );

    // Use progressive wait strategy for large documents
    try {
      // First, set content with a more lenient wait strategy
      await page.setContent(htmlDocument, {
        waitUntil: ["load", "domcontentloaded"],
        timeout: baseTimeout,
      });
      
      // Then use our custom robust wait function
      await waitForPageReady(page, baseTimeout);
    } catch (error) {
      // Fallback: try with just domcontentloaded
      console.log("Primary wait strategy failed, trying fallback...");
      try {
        await page.setContent(htmlDocument, {
          waitUntil: "domcontentloaded",
          timeout: baseTimeout,
        });
        await waitForPageReady(page, Math.min(baseTimeout, 60000));
      } catch (fallbackError) {
        throw new Error(`Failed to load page content: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // Load external scripts sequentially with error handling, then execute inline scripts
    const loadScriptsSequentially = async (scripts: Array<{ src: string; tag: string }>, index: number = 0): Promise<void> => {
      if (index >= scripts.length) {
        // All external scripts loaded, now execute inline scripts
        for (const script of inlineScripts) {
          try {
            await (page.evaluate as any)(
              (scriptContent: string) => {
                const newScript = document.createElement("script");
                newScript.textContent = scriptContent;
                document.body.appendChild(newScript);
              },
              script.content || ""
            );
          } catch (error) {
            console.warn(`Failed to execute inline script: ${error instanceof Error ? error.message : String(error)}`);
            // Continue with other scripts
          }
        }
        return;
      }
// 
      const script = scripts[index];
      try {
        // Check if script already exists
        const scriptExists = await (page.evaluate as any)(
          (scriptSrc: string) => {
            return !!document.querySelector(`script[src="${scriptSrc}"]`);
          },
          script.src
        );

        if (!scriptExists) {
          try {
            await page.addScriptTag({ url: script.src });
          } catch (scriptError) {
            // Retry once if script loading fails
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await page.addScriptTag({ url: script.src });
          }
        }
      } catch (error) {
        console.warn(`Failed to load script ${script.src}: ${error instanceof Error ? error.message : String(error)}`);
        // Continue with other scripts
      }
      
      await loadScriptsSequentially(scripts, index + 1);
    };

    if (externalScripts.length > 0) {
      await loadScriptsSequentially(externalScripts);
    } else {
      // No external scripts, just execute inline scripts
      for (const script of inlineScripts) {
        try {
          await (page.evaluate as any)(
            (scriptContent: string) => {
              const newScript = document.createElement("script");
              newScript.textContent = scriptContent;
              document.body.appendChild(newScript);
            },
            script.content || ""
          );
        } catch (error) {
          console.warn(`Failed to execute inline script: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    // Wait for content to stabilize - longer wait for large documents
    const stabilizationWait = docSize === "large" ? 3000 : docSize === "medium" ? 2000 : 1000;
    await new Promise((resolve) => setTimeout(resolve, stabilizationWait));

    // Generate PDF with retry logic
    const pdfBuffer = await retryOperation(
      () =>
        page.pdf({
          format: "A4",
          printBackground: true,
          margin: { top: "12px", right: "0", bottom: "12px", left: "0" },
          preferCSSPageSize: true,
          timeout: Math.min(baseTimeout, 120000), // Cap at 2 minutes for PDF generation
        }),
      2,
      2000,
      "PDF generation"
    );

    // Cleanup with error handling
    try {
      await page.close();
    } catch (error) {
      console.warn("Error closing page:", error);
    }
    
    try {
      await browser.close();
    } catch (error) {
      console.warn("Error closing browser:", error);
    }

    const arrayBuffer = pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength,
    );

    return new Response(arrayBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": "attachment; filename=design.pdf",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("render-pdf failed", message);
    return new Response(
      JSON.stringify({ error: "Failed to render PDF", message }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
}
