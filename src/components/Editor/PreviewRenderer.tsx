import { useCallback, useEffect, useMemo, useRef } from "react";

type PreviewRendererProps = {
    html: string;
    css: string;
    onBack: () => void;
};

const SCRIPT_REGEX = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
const TAILWIND_CDN_REGEX =
    /<script[^>]+src=["']https:\/\/cdn\.tailwindcss\.com["'][^>]*><\/script>/i;

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

export default function PreviewRenderer({ html, css, onBack }: PreviewRendererProps) {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const { sanitizedHtml, tailwindConfigTag, tailwindConfigScript } = useMemo(() => {
        let extractedScript: string | undefined;
        let workingHtml = html;

        let match: RegExpExecArray | null;
        while ((match = SCRIPT_REGEX.exec(html))) {
            const scriptTag = match[0];
            if (scriptTag.toLowerCase().includes("tailwind.config")) {
                extractedScript = scriptTag;
                workingHtml = workingHtml.replace(scriptTag, "");
                break;
            }
        }

        return {
            sanitizedHtml: workingHtml,
            tailwindConfigScript: extractedScript ? stripScriptTags(extractedScript) : undefined,
            tailwindConfigTag: buildTailwindConfigTag(extractedScript),
        };
    }, [html]);

    const handleDownloadPdf = useCallback(async () => {
        const response = await fetch("/api/handle-pdf/render-pdf", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ html, css, tailwindConfig: tailwindConfigScript }),
        });

        if (!response.ok) {
            console.error("PDF generation failed:", response.status, response.statusText);
            return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "design.pdf";
        anchor.click();
        URL.revokeObjectURL(url);
    }, [html, css, tailwindConfigScript]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        const buildDocument = () => {
            const trimmedHtml = sanitizedHtml.trim();
            const isFullDocument =
                trimmedHtml.startsWith("<!DOCTYPE") ||
                trimmedHtml.startsWith("<!doctype") ||
                trimmedHtml.startsWith("<html");

            const previewScopeStyles = `
              html, body { margin: 0; padding: 0; background: #1f2937; display: flex; justify-content: center; overflow-x: hidden !important; }
              body { min-height: 100vh; overflow-x: hidden !important; }
              .preview-wrapper { display: flex; justify-content: center; padding: 32px 0 48px; width: 100%; max-width: 794px; box-sizing: border-box; overflow-x: hidden !important; }
              .preview-scope { color: #f9fafb; background-color: #111827; padding: 48px; width: 100%; max-width: 794px; box-sizing: border-box; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); border-radius: 16px; overflow-x: hidden !important; overflow-wrap: break-word; word-wrap: break-word; }
              .preview-scope * { max-width: 100% !important; box-sizing: border-box; overflow-wrap: break-word; word-wrap: break-word; }
              .preview-scope img, .preview-scope video, .preview-scope iframe { max-width: 100% !important; height: auto !important; }
              .preview-scope table { width: 100% !important; table-layout: fixed !important; }
              .preview-scope pre, .preview-scope code { overflow-x: auto; max-width: 100%; word-wrap: break-word; white-space: pre-wrap; }
              .preview-scope .bg-white { background-color: #111827 !important; }
              .preview-scope .bg-gray-100 { background-color: #1f2937 !important; }
              .preview-scope .text-gray-800 { color: #f9fafb !important; }
              .preview-scope .text-gray-600 { color: #d1d5db !important; }
              .preview-scope .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
              .preview-scope .text-green-500 { color: #22c55e !important; }
              .preview-scope .border-green-500 { border-color: #22c55e !important; }
              .preview-scope .shadow { box-shadow: none !important; }
            `;
            const previewStyles = `<style>${previewScopeStyles}${css || ""}</style>`;

            if (isFullDocument) {
                let documentHtml = sanitizedHtml;

                // Add custom CSS if provided
                if (css && documentHtml.includes("</head>")) {
                    documentHtml = documentHtml.replace("</head>", `<style>${css}</style></head>`);
                } else if (css && documentHtml.includes("</style>")) {
                    // If there's already a style tag, append to it
                    const lastStyleIndex = documentHtml.lastIndexOf("</style>");
                    if (lastStyleIndex !== -1) {
                        documentHtml = documentHtml.slice(0, lastStyleIndex) + css + documentHtml.slice(lastStyleIndex);
                    }
                }

                // Inject Tailwind config script if needed
                if (TAILWIND_CDN_REGEX.test(documentHtml)) {
                    // Check if config already exists
                    const hasConfig = /tailwind\.config\s*=/.test(documentHtml);
                    if (!hasConfig) {
                        documentHtml = documentHtml.replace(
                            TAILWIND_CDN_REGEX,
                            (match) => `${match}\n${tailwindConfigTag}`
                        );
                    }
                } else if (documentHtml.includes("</head>")) {
                    // Add Tailwind CDN and config if not present
                    const hasTailwindCDN = /cdn\.tailwindcss\.com/.test(documentHtml);
                    const hasConfig = /tailwind\.config\s*=/.test(documentHtml);
                    if (!hasTailwindCDN) {
                        documentHtml = documentHtml.replace(
                            "</head>",
                            `<script src="https://cdn.tailwindcss.com"></script>\n${tailwindConfigTag}\n</head>`
                        );
                    } else if (!hasConfig) {
                        documentHtml = documentHtml.replace(
                            "</head>",
                            `${tailwindConfigTag}\n</head>`
                        );
                    }
                } else {
                    documentHtml = `<script src="https://cdn.tailwindcss.com"></script>\n${tailwindConfigTag}${documentHtml}`;
                }

                return documentHtml;
            }

            return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.tailwindcss.com"></script>
    ${tailwindConfigTag}
    ${previewStyles}
  </head>
  <body>
    <div class="preview-wrapper">
      <div class="preview-scope">${sanitizedHtml}</div>
    </div>
  </body>
</html>`;
        };

        const A4_WIDTH_PX = 794;
        const A4_HEIGHT_PX = 1123;

        const adjustIframeSize = () => {
            if (!iframe) return;
            const htmlElement = doc.documentElement;
            const body = doc.body;
            if (!htmlElement || !body) return;

            const contentHeight = Math.max(
                body.scrollHeight,
                htmlElement.scrollHeight,
                body.offsetHeight,
                htmlElement.offsetHeight
            );

            const pageHeight =
                contentHeight < A4_HEIGHT_PX
                    ? Math.max(contentHeight + 96, 360)
                    : contentHeight;
            iframe.style.height = `${pageHeight}px`;
            iframe.style.maxWidth = `${A4_WIDTH_PX}px`;
            iframe.style.width = "100%";
        };

        const documentHtml = buildDocument();
        
        // Write the full document first
        doc.open();
        doc.write(documentHtml);
        doc.close();
        
        // Now extract and remove resources from the actual iframe document
        // This is more reliable than string manipulation
        const externalStylesheets = Array.from(doc.querySelectorAll("link[rel='stylesheet']")) as HTMLLinkElement[];
        const externalScripts = Array.from(doc.querySelectorAll("script[src]")) as HTMLScriptElement[];
        const inlineScripts = Array.from(doc.querySelectorAll("script:not([src])")) as HTMLScriptElement[];
        
        // Store resource data before removing
        const stylesheetData = externalStylesheets.map(link => ({
            href: link.getAttribute("href") || "",
            rel: link.getAttribute("rel") || "stylesheet"
        }));
        
        const scriptData = externalScripts.map(script => ({
            src: script.getAttribute("src") || "",
            async: script.hasAttribute("async"),
            defer: script.hasAttribute("defer")
        }));
        
        const inlineScriptData = inlineScripts.map(script => ({
            content: script.textContent || "",
            isConfig: script.textContent?.includes("tailwind.config") || false
        }));
        
        // Remove all resources from DOM (we'll add them back in correct order)
        [...externalStylesheets, ...externalScripts, ...inlineScripts].forEach(resource => {
            resource.remove();
        });

        // Function to load external stylesheets sequentially
        const loadStylesheetsSequentially = (stylesheets: typeof stylesheetData, index: number = 0) => {
            if (index >= stylesheets.length) {
                // All stylesheets loaded, now load scripts
                loadScriptsSequentially(scriptData);
                return;
            }

            const linkData = stylesheets[index];
            if (linkData.href) {
                const existingLink = doc.querySelector(`link[href="${linkData.href}"]`);
                if (!existingLink) {
                    const newLink = doc.createElement("link");
                    newLink.rel = linkData.rel;
                    newLink.href = linkData.href;
                    newLink.onload = () => {
                        loadStylesheetsSequentially(stylesheets, index + 1);
                    };
                    newLink.onerror = () => {
                        console.warn(`Failed to load stylesheet: ${linkData.href}`);
                        loadStylesheetsSequentially(stylesheets, index + 1);
                    };
                    doc.head.appendChild(newLink);
                } else {
                    loadStylesheetsSequentially(stylesheets, index + 1);
                }
            } else {
                loadStylesheetsSequentially(stylesheets, index + 1);
            }
        };

        // Function to load external scripts sequentially, then execute inline scripts
        const loadScriptsSequentially = (scripts: typeof scriptData, index: number = 0) => {
            if (index >= scripts.length) {
                // All external scripts loaded, now execute inline scripts
                // Execute inline scripts in order
                inlineScriptData.forEach((inlineData) => {
                    const newScript = doc.createElement("script");
                    newScript.textContent = inlineData.content;
                    // Append to head if it's a config script, otherwise to body
                    if (inlineData.isConfig) {
                        doc.head.appendChild(newScript);
                    } else {
                        doc.body.appendChild(newScript);
                    }
                });
                
                // Wait a bit for scripts to execute, then adjust size
                requestAnimationFrame(() => {
                    setTimeout(adjustIframeSize, 50);
                    setTimeout(adjustIframeSize, 200);
                    setTimeout(adjustIframeSize, 500);
                });
                return;
            }

            const currentScript = scripts[index];
            if (currentScript.src) {
                // Check if script already exists
                const existingScript = doc.querySelector(`script[src="${currentScript.src}"]`);
                if (!existingScript) {
                    const newScript = doc.createElement("script");
                    newScript.src = currentScript.src;
                    newScript.async = currentScript.async;
                    newScript.defer = currentScript.defer;
                    newScript.onload = () => {
                        loadScriptsSequentially(scripts, index + 1);
                    };
                    newScript.onerror = () => {
                        console.warn(`Failed to load script: ${currentScript.src}`);
                        loadScriptsSequentially(scripts, index + 1);
                    };
                    doc.head.appendChild(newScript);
                } else {
                    // Script already exists, continue to next
                    loadScriptsSequentially(scripts, index + 1);
                }
            } else {
                // No src, skip and continue
                loadScriptsSequentially(scripts, index + 1);
            }
        };

        // Start loading resources: stylesheets first, then scripts
        if (stylesheetData.length > 0) {
            loadStylesheetsSequentially(stylesheetData);
        } else if (scriptData.length > 0) {
            loadScriptsSequentially(scriptData);
        } else {
            // No external resources, just execute inline scripts
            inlineScriptData.forEach((scriptData) => {
                const newScript = doc.createElement("script");
                newScript.textContent = scriptData.content;
                if (scriptData.isConfig) {
                    doc.head.appendChild(newScript);
                } else {
                    doc.body.appendChild(newScript);
                }
            });
            
            requestAnimationFrame(() => {
                setTimeout(adjustIframeSize, 50);
                setTimeout(adjustIframeSize, 200);
            });
        }

        const resizeHandler = () => adjustIframeSize();
        window.addEventListener("resize", resizeHandler);

        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }, [sanitizedHtml, css, tailwindConfigTag]);

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <div className="p-4 flex gap-2 justify-center">
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                    Back to editor
                </button>
                <button
                    onClick={handleDownloadPdf}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Download PDF
                </button>
            </div>

            <div className="flex-1 flex items-start justify-center px-4 pb-6 overflow-x-hidden overflow-y-auto">
                <iframe
                    ref={iframeRef}
                    title="HTML Preview"
                    className="border-0 rounded-lg shadow-md bg-gray-800 max-w-full"
                    style={{ maxWidth: "794px", width: "100%" }}
                />
            </div>
        </div>
    );
}



