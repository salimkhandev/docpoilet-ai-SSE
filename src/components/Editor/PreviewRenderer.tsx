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

                if (css && documentHtml.includes("</head>")) {
                    documentHtml = documentHtml.replace("</head>", `<style>${css}</style></head>`);
                }

                if (TAILWIND_CDN_REGEX.test(documentHtml)) {
                    documentHtml = documentHtml.replace(
                        TAILWIND_CDN_REGEX,
                        (match) => `${match}\n${tailwindConfigTag}`
                    );
                } else if (documentHtml.includes("</head>")) {
                    documentHtml = documentHtml.replace(
                        "</head>",
                        `${tailwindConfigTag}\n</head>`
                    );
                } else {
                    documentHtml = `${tailwindConfigTag}${documentHtml}`;
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
        const parser = new DOMParser();
        const parsedDoc = parser.parseFromString(documentHtml, "text/html");
        
        // Extract scripts from the parsed document
        const externalScripts = Array.from(parsedDoc.querySelectorAll("script[src]")) as HTMLScriptElement[];
        const inlineScripts = Array.from(parsedDoc.querySelectorAll("script:not([src])")) as HTMLScriptElement[];
        
        // Remove all scripts from the HTML before writing
        let htmlWithoutScripts = documentHtml;
        const allScripts = [...externalScripts, ...inlineScripts];
        allScripts.forEach((script) => {
            const scriptTag = script.outerHTML;
            htmlWithoutScripts = htmlWithoutScripts.replace(scriptTag, "");
        });

        doc.open();
        doc.write(htmlWithoutScripts);
        doc.close();

        // Function to load external scripts sequentially, then execute inline scripts
        const loadScriptsSequentially = (scripts: HTMLScriptElement[], index: number = 0) => {
            if (index >= scripts.length) {
                // All external scripts loaded, now execute inline scripts
                inlineScripts.forEach((script) => {
                    const newScript = doc.createElement("script");
                    newScript.textContent = script.textContent || "";
                    doc.body.appendChild(newScript);
                });
                
                requestAnimationFrame(adjustIframeSize);
                setTimeout(adjustIframeSize, 100);
                return;
            }

            const script = scripts[index];
            const src = script.getAttribute("src");
            if (src) {
                // Check if script already exists
                const existingScript = doc.querySelector(`script[src="${src}"]`);
                if (!existingScript) {
                    const newScript = doc.createElement("script");
                    newScript.src = src;
                    newScript.onload = () => {
                        loadScriptsSequentially(scripts, index + 1);
                    };
                    newScript.onerror = () => {
                        console.warn(`Failed to load script: ${src}`);
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

        // Start loading external scripts
        if (externalScripts.length > 0) {
            loadScriptsSequentially(externalScripts);
        } else {
            // No external scripts, just execute inline scripts
            inlineScripts.forEach((script) => {
                const newScript = doc.createElement("script");
                newScript.textContent = script.textContent || "";
                doc.body.appendChild(newScript);
            });
            
            requestAnimationFrame(adjustIframeSize);
            setTimeout(adjustIframeSize, 100);
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



