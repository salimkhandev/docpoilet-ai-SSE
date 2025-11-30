"use client";
import grapesjs from "grapesjs";
import gjsBlocksBasic from "grapesjs-blocks-basic";
import gjsForms from "grapesjs-plugin-forms";
import gjsPreset from "grapesjs-preset-webpage";
import "grapesjs/dist/css/grapes.min.css";
import { useEffect, useState } from "react";
import { useAIState } from "../../contexts/AIStateContext";
import { defaultHtml } from "../../data/defaultHtml";
import { profileAvatarTemplate, resumeTemplate1Full, resumeTemplate2Full } from "../../data/resume-templates/templateExports";
import PreviewRenderer from "./PreviewRenderer";

export default function TailwindGrapes() {
  const [exported, setExported] = useState<{
    html: string;
    css: string;
    isFullHtml?: boolean;
    originalHtml?: string;
  } | null>(null);
  const { state, dispatch } = useAIState(); // ✅ now we can read & update HTML dynamically

  useEffect(() => {

    console.log('The state of the data is❌',state.htmlContent)

    if (exported) return;

    const editor = grapesjs.init({
      container: "#gjs",
      height: "100vh",
      width: "auto",
      storageManager: false,
      fromElement: false,

      // Enable undo/redo
      undoManager: {
        trackSelection: true,
      },

      // Device manager: Desktop only (non-mobile)
      deviceManager: {
        devices: [{ name: "Desktop", width: "" }],
      },

      // Layer manager configuration
      layerManager: {
        appendTo: ".layers-container",
        sortable: true,
      },

      // Panels configuration
      panels: {
        defaults: [
          {
            id: "layers",
            el: ".panel__right",
            resizable: {
              maxDim: 350,
              minDim: 200,
              tc: false,
              cl: true,
              cr: false,
              bc: false,
            },
          },
          {
            id: "panel-switcher",
            el: ".panel__switcher",
            buttons: [
              {
                id: "show-layers",
                active: true,
                label: "Layers",
                command: "show-layers",
                togglable: false,
              },
              {
                id: "show-style",
                active: true,
                label: "Styles",
                command: "show-styles",
                togglable: false,
              },
              {
                id: "show-traits",
                active: true,
                label: "Traits",
                command: "show-traits",
                togglable: false,
              },
            ],
          },
        ],
      },

      // Trait manager
      traitManager: {
        appendTo: ".traits-container",
      },

      // Style manager with comprehensive options
      styleManager: {
        appendTo: ".styles-container",
        sectors: [
          {
            name: "General",
            open: false,
            buildProps: [
              "float",
              "display",
              "position",
              "top",
              "right",
              "left",
              "bottom",
            ],
          },
          {
            name: "Dimension",
            open: false,
            buildProps: [
              "width",
              "height",
              "max-width",
              "min-height",
              "margin",
              "padding",
            ],
          },
          {
            name: "Typography",
            open: false,
            buildProps: [
              "font-family",
              "font-size",
              "font-weight",
              "letter-spacing",
              "color",
              "line-height",
              "text-align",
              "text-decoration",
              "text-shadow",
            ],
          },
          {
            name: "Decorations",
            open: false,
            buildProps: [
              "background-color",
              "border-radius",
              "border",
              "box-shadow",
              "background",
            ],
          },
          {
            name: "Effects",
            open: false,
            buildProps: [
              "opacity",
              "mix-blend-mode",
              "box-shadow",
              "text-shadow",
              "filter",
              "backdrop-filter",
              "transition",
            ],
          },
          {
            name: "Extra",
            open: false,
            buildProps: [
              "transition",
              "perspective",
              "transform",
              "cursor",
              "opacity",
              "overflow",
            ],
          },
          {
            name: "Flex",
            open: false,
            buildProps: [
              "flex-direction",
              "flex-wrap",
              "justify-content",
              "align-items",
              "align-content",
              "order",
              "flex-basis",
              "flex-grow",
              "flex-shrink",
              "align-self",
            ],
          },
        ],
      },

      // Block manager
      blockManager: {
        appendTo: "#blocks",
      },

      plugins: [gjsBlocksBasic, gjsForms, gjsPreset],
      pluginsOpts: {
        "grapesjs-preset-webpage": {
          blocksBasic: true,
          forms: true,
          modalImportTitle: "Import Template",
          modalImportLabel:
            '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
          modalImportContent: function (editor: any) {
            return editor.getHtml() + "<style>" + editor.getCss() + "</style>";
          },
        },
      },

      canvas: {
        styles: [],
        scripts: [],
        customBadgeLabel: () => '',
      },
    });
    
    // Dynamically configure SVG and other elements when they're encountered
    // This ensures any HTML element (including SVG) is properly handled without hardcoding
    editor.on('component:add', (component: any) => {
      const tagName = component.get('tagName')?.toLowerCase();
      
      // Make SVG elements selectable and hoverable
      if (tagName === 'svg') {
        component.set({
          droppable: true,
          editable: false,
          selectable: true,
          hoverable: true,
        });
      }
      
      // Handle SVG child elements dynamically (any element inside SVG namespace)
      // Check if parent is SVG or if it's a known SVG element
      const parent = component.parent();
      if (parent && parent.get('tagName')?.toLowerCase() === 'svg') {
        component.set({
          selectable: true,
          hoverable: true,
        });
      }
    });

    // Helper function to decode HTML entities
    const decodeHtmlEntities = (html: string): string => {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = html;
      return textarea.value;
    };

    // Helper function to detect Urdu/Arabic characters (RTL languages)
    const containsUrduOrArabic = (text: string): boolean => {
      if (!text || typeof text !== 'string') return false;
      // Urdu/Arabic Unicode ranges
      // Arabic: \u0600-\u06FF
      // Urdu extensions: \u0750-\u077F, \u08A0-\u08FF, \uFB50-\uFDFF, \uFE70-\uFEFF
      const urduArabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
      return urduArabicPattern.test(text);
    };

    // Function to recursively extract text from component and its children
    const extractComponentText = (component: any): string => {
      if (!component) return '';
      
      let textContent = '';
      
      // Get direct content
      const content = component.get('content');
      if (typeof content === 'string') {
        textContent += content;
      } else if (Array.isArray(content)) {
        content.forEach((item: any) => {
          if (typeof item === 'string') {
            textContent += item;
          } else if (item && typeof item === 'object') {
            // Recursively get text from child components
            if (item.get && typeof item.get === 'function') {
              textContent += extractComponentText(item);
            } else if (item.content) {
              textContent += typeof item.content === 'string' ? item.content : extractComponentText(item);
            }
          }
        });
      }
      
      // Get text from view element if available
      try {
        const view = component.getView?.();
        if (view && view.el) {
          const viewText = view.el.textContent || view.el.innerText || '';
          if (viewText.trim()) {
            textContent += viewText;
          }
        }
      } catch (e) {
        // Ignore errors getting view
      }
      
      // Recursively check child components
      try {
        const children = component.components?.();
        if (children && Array.isArray(children)) {
          children.forEach((child: any) => {
            textContent += extractComponentText(child);
          });
        }
      } catch (e) {
        // Ignore errors getting children
      }
      
      return textContent;
    };

    // Function to apply RTL direction to component if it contains Urdu/Arabic text
    const applyRTLIfNeeded = (component: any) => {
      try {
        if (!component) return;
        
        // Extract all text from component and its children
        const textContent = extractComponentText(component);

        // Check if text contains Urdu/Arabic characters
        if (containsUrduOrArabic(textContent)) {
          // Get current direction to avoid overwriting if already set
          const currentDirection = component.getStyle('direction');
          
          // Only apply if not already set or set to LTR
          if (!currentDirection || currentDirection === 'ltr') {
            // Apply RTL direction
            component.addStyle({
              'direction': 'rtl',
              'text-align': 'right',
              'unicode-bidi': 'embed'
            });
          }
          
          // Set dir attribute for proper HTML rendering
          component.setAttributes({
            dir: 'rtl'
          });
        } else {
          // If no Urdu/Arabic text, check if RTL was previously set and might need to be removed
          // But only if it's a leaf component (has no children with Urdu text)
          // We'll leave RTL if it was manually set, so we check if there are children first
          try {
            const children = component.components?.();
            if (!children || children.length === 0) {
              const currentDirection = component.getStyle('direction');
              // Don't remove RTL if it's explicitly set by user
              // Only remove if we auto-applied it and there's no Urdu text
            }
          } catch (e) {
            // Ignore
          }
        }
      } catch (error) {
        console.warn('Error applying RTL:', error);
      }
    };

    // Enable resizing for text elements
    // Make all text-based components resizable by default
    
    // Configure text component types to be resizable
    const textComponentTypes = ['text', 'textnode', 'link', 'label'];
    textComponentTypes.forEach(type => {
      const typeDef = editor.DomComponents.getType(type);
      if (typeDef) {
        editor.DomComponents.addType(type, {
          model: {
            defaults: {
              ...typeDef.model?.defaults,
              resizable: true,
              resizableText: true, // Allow resizing text content
            },
          },
        });
      }
    });

    // Override default text components to be resizable
    ['text', 'link'].forEach(type => {
      const typeDef = editor.DomComponents.getType(type);
      if (typeDef) {
        editor.DomComponents.addType(type, {
          model: {
            defaults: {
              ...typeDef.model?.defaults,
              resizable: true,
            },
          },
        });
      }
    });

    // Force Desktop device by default
    editor.setDevice("Desktop");

    // Style the root wrapper as a fixed desktop page (non-responsive)
    const wrapper = editor.DomComponents.getWrapper();
    wrapper?.setStyle({
      width: "1122px", // ~A4 width at 96dpi
      minHeight: "1587px", // ~A4 height at 96dpi
      margin: "0 auto",
      background: "#ffffff",
    });

    // Commands for panel switching
    editor.Commands.add("show-layers", {
      run(editor) {
        editor.Panels.getButton("views", "open-layers")?.set("active", 1);
      },
    });

    editor.Commands.add("show-styles", {
      run(editor) {
        editor.Panels.getButton("views", "open-sm")?.set("active", 1);
      },
    });

    editor.Commands.add("show-traits", {
      run(editor) {
        editor.Panels.getButton("views", "open-tm")?.set("active", 1);
      },
    });

    // ✅ When GrapesJS updates, sync back to context (to reflect live)
    editor.on("update", () => {
      // alert('updated')
      // const html = editor.getHtml();
      // dispatch({ type: "SET_HTML_CONTENT", payload: html });
    });

    // Enable resizing for text HTML elements when they're added
    editor.on('component:add', (component) => {
      const tagName = component.get('tagName')?.toLowerCase();
      
      // List of text-related elements that should be resizable
      const textElements = [
        'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'span', 'div', 'blockquote', 'a', 'strong', 
        'em', 'b', 'i', 'u', 'li', 'td', 'th',
        'section', 'article', 'header', 'footer', 
        'main', 'aside', 'nav', 'pre', 'code'
      ];
      
      // Check if it's a text element or text component
      if (textElements.includes(tagName) || 
          component.is('text') || 
          component.is('link') ||
          component.is('textnode')) {
        // Enable resizing
        component.set('resizable', true);
        
        // For inline elements (span, a, strong, em, etc.), make them inline-block for resizing
        const inlineElements = ['span', 'a', 'strong', 'em', 'b', 'i', 'u', 'code', 'small', 'sub', 'sup'];
        if (inlineElements.includes(tagName)) {
          // Ensure inline elements can be resized by making them inline-block
          const currentDisplay = component.getStyle('display');
          if (!currentDisplay || currentDisplay === 'inline') {
            component.addStyle({ 'display': 'inline-block' });
          }
        }
        
        // Set minimum dimensions for better resizing experience
        if (!component.getStyle('min-width')) {
          component.addStyle({ 'min-width': '20px' });
        }
        if (!component.getStyle('min-height')) {
          component.addStyle({ 'min-height': '10px' });
        }
        
        // Ensure the component maintains its text content while resizing
        const content = component.get('content');
        if (content && typeof content === 'string' && content.trim()) {
          // Preserve text content during resize
          component.set('editable', true);
        }

        // Apply RTL if component contains Urdu/Arabic text
        applyRTLIfNeeded(component);
      }

      // Make table cells editable
      if (tagName === "td" || tagName === "th") {
        component.set("editable", true);
        component.set("selectable", true);
        component.set("hoverable", true);
        component.set("droppable", true);
        
        // Ensure table cells can contain text nodes
        if (!component.get("content") || component.get("content").trim() === "") {
          component.set("content", " ");
        }
      }
    });

    // Handle component creation to set resizable property early
    editor.on('component:create', (component) => {
      const tagName = component.get('tagName')?.toLowerCase();
      const textElements = [
        'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'span', 'div', 'blockquote', 'a', 'strong', 
        'em', 'b', 'i', 'u', 'li', 'td', 'th',
        'section', 'article', 'header', 'footer',
        'main', 'aside', 'nav', 'pre', 'code'
      ];
      
      if (textElements.includes(tagName) || 
          component.is('text') || 
          component.is('link') ||
          component.is('textnode')) {
        component.set('resizable', true);
        
        // For inline elements, set display to inline-block for resizing
        const inlineElements = ['span', 'a', 'strong', 'em', 'b', 'i', 'u', 'code', 'small', 'sub', 'sup'];
        if (inlineElements.includes(tagName)) {
          const currentDisplay = component.getStyle('display');
          if (!currentDisplay || currentDisplay === 'inline') {
            component.addStyle({ 'display': 'inline-block' });
          }
        }

        // Apply RTL if component contains Urdu/Arabic text
        applyRTLIfNeeded(component);
      }
    });

    // Helper function to generate a random class name
    const generateRandomClass = (): string => {
      const prefix = 'resize-';
      const randomId = Math.random().toString(36).substring(2, 9);
      return `${prefix}${randomId}`;
    };

    // Store the currently selected component's resize class
    let currentResizeClass: string | null = null;

    // Configure the resizer to work better with text elements
    editor.on('component:selected', (component) => {
      const tagName = component.get('tagName')?.toLowerCase();
      const textElements = [
        'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'span', 'div', 'blockquote', 'a', 'strong', 
        'em', 'b', 'i', 'u', 'li', 'td', 'th',
        'section', 'article', 'header', 'footer',
        'main', 'aside', 'nav', 'pre', 'code'
      ];
      
      // Ensure text elements are marked as resizable when selected
      if (textElements.includes(tagName) || 
          component.is('text') || 
          component.is('link') ||
          component.is('textnode')) {
        if (!component.get('resizable')) {
          component.set('resizable', true);
        }
        
        // For inline elements, ensure they can be resized
        const inlineElements = ['span', 'a', 'strong', 'em', 'b', 'i', 'u', 'code', 'small', 'sub', 'sup'];
        if (inlineElements.includes(tagName)) {
          const currentDisplay = component.getStyle('display');
          if (!currentDisplay || currentDisplay === 'inline') {
            component.addStyle({ 'display': 'inline-block' });
          }
        }

        // Remove any existing resize-* classes from this component first
        const currentClasses = component.get('classes') || [];
        const classNames = currentClasses.map((cls: any) => cls.get('name')).filter(Boolean);
        classNames.forEach((className: string) => {
          if (className.startsWith('resize-')) {
            component.removeClass(className);
          }
        });

        // Add a new unique random class to differentiate this component for resizing
        const randomClass = generateRandomClass();
        component.addClass(randomClass);
        currentResizeClass = randomClass;

        // Apply RTL if component contains Urdu/Arabic text
        applyRTLIfNeeded(component);
      }
    });

    // Remove resize class when component is deselected (optional - uncomment if needed)
    // editor.on('component:deselected', (component) => {
    //   const currentClasses = component.get('classes') || [];
    //   const classNames = currentClasses.map((cls: any) => cls.get('name')).filter(Boolean);
    //   classNames.forEach((className: string) => {
    //     if (className.startsWith('resize-')) {
    //       component.removeClass(className);
    //     }
    //   });
    // });

    // Listen for component updates (when text content changes)
    editor.on('component:update', (component) => {
      // Apply RTL when component content is updated
      applyRTLIfNeeded(component);
      
      // Also check child components recursively
      const checkChildren = (comp: any) => {
        if (comp && comp.components) {
          comp.components().forEach((child: any) => {
            applyRTLIfNeeded(child);
            checkChildren(child);
          });
        }
      };
      checkChildren(component);
    });

    // Listen for component style changes to re-check RTL
    editor.on('component:styleUpdate', (component) => {
      applyRTLIfNeeded(component);
    });

    // Also handle existing components when HTML is loaded
    editor.on("load", () => {
      // Make all existing table cells editable and apply RTL
      const allComponents = editor.DomComponents.getComponents();
      const processComponents = (components: any) => {
        components.each((component: any) => {
          const tagName = component.get("tagName")?.toLowerCase();
          
          // Make table cells editable
          if (tagName === "td" || tagName === "th") {
            component.set("editable", true);
            component.set("selectable", true);
            component.set("hoverable", true);
            component.set("droppable", true);
          }
          
          // Apply RTL if needed
          applyRTLIfNeeded(component);
          
          // Recursively check child components
          if (component.components && component.components.length > 0) {
            processComponents(component.components);
          }
        });
      };
      processComponents(allComponents);
    });

    // Open asset manager on image double-click (less intrusive than on select)
    editor.on("component:dblclick", (component) => {
      if (!component || !component.is || !component.is("image")) return;
      editor.runCommand("open-assets", { target: component, types: ["image"] });
    });

    // Add a toolbar button on images to change the image
    editor.Commands.add("change-image", {
      run(ed, _sender, opts) {
        const target = (opts && opts.target) || ed.getSelected();
        if (target && target.is && target.is("image")) {
          ed.runCommand("open-assets", { target, types: ["image"] });
        }
      },
    });

    editor.on("component:selected", (component) => {
      if (!component || !component.is || !component.is("image")) return;
      const toolbar = component.get("toolbar") || [];
      const exists = toolbar.some((t: any) => t.id === "change-image");
      if (!exists) {
        toolbar.unshift({
          id: "change-image",
          attributes: { class: "fa fa-image", title: "Change image" },
          command: "change-image",
        });
        component.set("toolbar", toolbar);
      }
    });

    // Inject Tailwind config before Tailwind executes
    // Preflight is enabled by default (Tailwind's standard behavior)
    // This ensures proper rendering of borders, spacing, and utilities
    // Custom inline/internal CSS styles are NOT affected by preflight
    editor.on("canvas:frame:load", () => {
      const frameDoc = editor.Canvas.getDocument();
      if (!frameDoc) return;

      // Preflight enabled by default - no need to disable it
      // This ensures Tailwind utilities work correctly in the editor
      const cfg = frameDoc.createElement("script");
      cfg.textContent = `// Tailwind preflight enabled by default for proper utility behavior`;
      frameDoc.head.insertBefore(cfg, frameDoc.head.firstChild);

      // Add RTL support styles
      const rtlStyles = frameDoc.createElement("style");
      rtlStyles.textContent = `
        /* RTL support for Urdu/Arabic text */
        [dir="rtl"] {
          direction: rtl;
          text-align: right;
          unicode-bidi: embed;
        }
        [dir="rtl"] p,
        [dir="rtl"] h1,
        [dir="rtl"] h2,
        [dir="rtl"] h3,
        [dir="rtl"] h4,
        [dir="rtl"] h5,
        [dir="rtl"] h6,
        [dir="rtl"] div,
        [dir="rtl"] span,
        [dir="rtl"] li {
          direction: rtl;
          text-align: right;
        }
        /* Ensure RTL text starts from right */
        [dir="rtl"] * {
          unicode-bidi: embed;
        }
      `;
      frameDoc.head.appendChild(rtlStyles);
    });

    // Command to send HTML/CSS to preview with all dependencies
    editor.Commands.add("send-to-preview", {
      run() {
        // Get the basic HTML and CSS from the editor
        let html = editor.getHtml();
        const css = editor.getCss() ?? "";

        // Extract resources from defaultHtml to include in preview
        const parser = new DOMParser();
        const rawHtml = state.htmlContent || defaultHtml;
        const decodedHtml = decodeHtmlEntities(rawHtml);
        const doc = parser.parseFromString(decodedHtml, "text/html");

        // Get all external stylesheet links
        const styleLinks = Array.from(
          doc.querySelectorAll('link[rel="stylesheet"]'),
        )
          .map((link) => link.outerHTML)
          .join("\n");

        // Get all inline script tags (includes Tailwind config)
        const inlineScriptTags = Array.from(doc.querySelectorAll("script:not([src])"))
          .map((script) => script.outerHTML)
          .join("\n");

        // Get all external script tags
        const externalScriptTags = Array.from(doc.querySelectorAll("script[src]"))
          .map((script) => script.outerHTML)
          .join("\n");

        // Get all meta tags and other head content
        const metaTags = Array.from(doc.querySelectorAll("meta"))
          .map((meta) => meta.outerHTML)
          .join("\n");

        // Extract styles from head of defaultHtml for PDF rendering
        const extractedStyles = Array.from(doc.querySelectorAll("style"))
          .map((style) => style.textContent || "")
          .join("\n");

        // Combine all styles for PDF rendering
        const combinedCss = extractedStyles + "\n" + css;

        // Initialize libraries script without template literals
        const initScript = `
    // Initialize any libraries that need it
    document.addEventListener("DOMContentLoaded", function() {
      // Try to initialize Prism if available
      if (typeof Prism !== "undefined" && Prism.highlightAll) {
        Prism.highlightAll();
      }

      // Try highlight.js
      if (typeof hljs !== "undefined" && hljs.highlightAll) {
        hljs.highlightAll();
      }

      // Try mermaid
      if (typeof mermaid !== "undefined" && mermaid.init) {
        mermaid.init();
      }

      // Try KaTeX
      if (typeof katex !== "undefined" && katex.renderAll) {
        katex.renderAll();
      }
    });
  `;

        // Create a complete HTML document with all dependencies
        const fullHtml =
          "<!DOCTYPE html>\n" +
          '<html lang="en">\n' +
          "<head>\n" +
          "  " +
          metaTags +
          "\n" +
          "  <title>Document Preview</title>\n" +
          "  " +
          styleLinks +
          "\n" +
          "  " +
          inlineScriptTags +
          "\n" +
          "  " +
          externalScriptTags +
          "\n" +
          "  <style>" +
          css +
          "</style>\n" +
          "</head>\n" +
          "<body>\n" +
          "  " +
          html +
          "\n" +
          "  <script>" +
          initScript +
          "</script>\n" +
          "</body>\n" +
          "</html>";

        // Set the exported content to the full HTML document
        // Include the original HTML and combined CSS for proper PDF rendering
        setExported({
          html: fullHtml,
          css: combinedCss,
          isFullHtml: true,
        });
      },
    });

    // Extract all resources from defaultHtml
    const extractResources = () => {
      const parser = new DOMParser();
      const htmlToLoad = state.htmlContent || defaultHtml;
      const decodedHtml = decodeHtmlEntities(htmlToLoad);

      const doc = parser.parseFromString(decodedHtml, "text/html");

      // Extract all external stylesheet links
      const styleLinks = Array.from(
        doc.querySelectorAll('link[rel="stylesheet"]'),
      )
        .map((link) => link.getAttribute("href"))
        .filter((href) => href);

      // Extract all script sources
      const scriptSources = Array.from(doc.querySelectorAll("script[src]"))
        .map((script) => script.getAttribute("src"))
        .filter((src) => src);

      // Extract all inline styles
      const inlineStyles = Array.from(doc.querySelectorAll("style"))
        .map((style) => style.textContent)
        .filter((content) => content);

      // Extract all inline scripts
      const inlineScripts = Array.from(
        doc.querySelectorAll("script:not([src])"),
      )
        .map((script) => script.textContent)
        .filter((content) => content);

      return { styleLinks, scriptSources, inlineStyles, inlineScripts };
    };

    // Get resources from defaultHtml
    const { styleLinks, scriptSources, inlineStyles, inlineScripts } =
      extractResources();

    // Add extracted resources to the canvas
    styleLinks.forEach((href) => {
      if (href) {
        editor.Canvas.getConfig()?.styles?.push(href);
      }
    });

    scriptSources.forEach((src) => {
      if (src) {
        editor.Canvas.getConfig()?.scripts?.push(src);
      }
    });

    // Create a custom iframe component
    editor.DomComponents.addType("iframe-wrapper", {
      model: {
        defaults: {
          tagName: "div",
          droppable: true,
          attributes: { class: "iframe-wrapper" },
          traits: [],
          components: [
            {
              type: "iframe",
              attributes: {
                src: "",
                style: "width: 100%; height: 100%; border: none;",
              },
              content: "",
            },
          ],
        },
      },
    });

    // Create a custom HTML script component
    editor.DomComponents.addType("html-with-scripts", {
      model: {
        defaults: {
          tagName: "div",
          droppable: true,
          content: "",
          script: function () {
            // This script runs in the iframe context and executes any
            // necessary initialization for all loaded libraries
            const executeScripts = () => {
              // Create a custom event that signals scripts should initialize
              const event = new CustomEvent("content-loaded");
              document.dispatchEvent(event);

              // Execute any inline script initializations that might be needed
              // This will run any global initialization functions that were defined
              const scriptTags = document.querySelectorAll("script:not([src])");
              scriptTags.forEach((script) => {
                try {
                  eval(script.textContent || "");
                } catch (e) {
                  console.warn("Error executing inline script:", e);
                }
              });
            };

            // Call after a short delay to ensure DOM and external scripts are ready
            setTimeout(executeScripts, 100);
          },
        },
      },
    });

    // Override default table cell components to make them editable
    editor.DomComponents.addType("cell", {
      extend: "cell",
      model: {
        defaults: {
          editable: true,
          selectable: true,
          hoverable: true,
          droppable: true,
        },
      },
    });

    // Command to render full HTML with dependencies
    editor.Commands.add("render-full-html", {
      run() {
        // Decode HTML entities before parsing
        const rawHtml = state.htmlContent || defaultHtml;
        const decodedHtml = decodeHtmlEntities(rawHtml);
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(decodedHtml, "text/html");

        // Get only body content to avoid breaking the editor
        const bodyContent = doc.body.innerHTML;

        // Extract styles from head
        const styleElements = doc.querySelectorAll("style");
        let inlineStyles = "";
        styleElements.forEach((style) => {
          inlineStyles += style.textContent || "";
        });

        // Apply the HTML and CSS
        editor.setComponents(bodyContent);
        if (inlineStyles) {
          editor.setStyle(inlineStyles);
        }

        // Apply RTL to all components after HTML is loaded
        setTimeout(() => {
          const allComponents = editor.DomComponents.getComponents();
          const checkAllComponents = (comps: any) => {
            if (comps) {
              comps.forEach((comp: any) => {
                const tagName = comp.get("tagName")?.toLowerCase();
                
                // Make table cells editable
                if (tagName === "td" || tagName === "th") {
                  comp.set("editable", true);
                  comp.set("selectable", true);
                  comp.set("hoverable", true);
                  comp.set("droppable", true);
                }
                
                // Apply RTL if needed
                applyRTLIfNeeded(comp);
                
                // Recursively check child components
                if (comp.components) {
                  checkAllComponents(comp.components());
                }
              });
            }
          };
          checkAllComponents(allComponents);
        }, 100);

        // Wait for components to be rendered then trigger Prism
        setTimeout(() => {
          const frame = editor.Canvas.getFrameEl();
          if (frame && frame.contentWindow) {
            const doc = frame.contentWindow.document;

            // Extract scripts from the original HTML
            const parser = new DOMParser();
            const rawHtml = state.htmlContent || defaultHtml;
            const decodedHtml = decodeHtmlEntities(rawHtml);
            const originalDoc = parser.parseFromString(
              decodedHtml,
              "text/html",
            );
            
            // Extract external scripts (with src attribute) from head
            const externalScripts = originalDoc.querySelectorAll("head script[src]");
            const inlineScripts = originalDoc.querySelectorAll("script:not([src])");

            // Function to load external scripts and then execute inline scripts
            const loadExternalScripts = (scripts: NodeListOf<HTMLScriptElement>, index: number = 0) => {
              if (index >= scripts.length) {
                // All external scripts loaded, now execute inline scripts
                inlineScripts.forEach((script) => {
                  const newScript = doc.createElement("script");
                  newScript.textContent = script.textContent;
                  doc.body.appendChild(newScript);
                });

                // Create a generic script runner that will initialize any library
                const runScripts = doc.createElement("script");
                runScripts.textContent = `
                  // Dispatch a content loaded event that libraries can listen for
                  document.dispatchEvent(new CustomEvent('content-loaded'));

                  // Try to run any common library initializers that might be present
                  // This is a fallback for libraries that don't auto-initialize
                  const commonLibraries = [
                    { name: 'Prism', init: 'highlightAll' },
                    { name: 'hljs', init: 'highlightAll' },
                    { name: 'mermaid', init: 'init' },
                    { name: 'katex', init: 'renderAll' }
                  ];

                  commonLibraries.forEach(lib => {
                    if (window[lib.name] && typeof window[lib.name][lib.init] === 'function') {
                      try {
                        window[lib.name][lib.init]();
                      } catch(e) {
                        console.warn(\`Error initializing \${lib.name}.\${lib.init}()\`, e);
                      }
                    }
                  });
                `;
                doc.body.appendChild(runScripts);
                return;
              }

              const script = scripts[index];
              const src = script.getAttribute("src");
              if (src) {
                // Check if script already exists in head
                const existingScript = doc.querySelector(`head script[src="${src}"]`);
                if (!existingScript) {
                  const newScript = doc.createElement("script");
                  newScript.src = src;
                  newScript.onload = () => {
                    loadExternalScripts(scripts, index + 1);
                  };
                  newScript.onerror = () => {
                    console.warn(`Failed to load script: ${src}`);
                    loadExternalScripts(scripts, index + 1);
                  };
                  doc.head.appendChild(newScript);
                } else {
                  // Script already exists, continue to next
                  loadExternalScripts(scripts, index + 1);
                }
              } else {
                // No src, skip and continue
                loadExternalScripts(scripts, index + 1);
              }
            };

            // Start loading external scripts
            if (externalScripts.length > 0) {
              loadExternalScripts(externalScripts);
            } else {
              // No external scripts, just execute inline scripts
              inlineScripts.forEach((script) => {
                const newScript = doc.createElement("script");
                newScript.textContent = script.textContent;
                doc.body.appendChild(newScript);
              });

              // Create a generic script runner
              const runScripts = doc.createElement("script");
              runScripts.textContent = `
                document.dispatchEvent(new CustomEvent('content-loaded'));
                const commonLibraries = [
                  { name: 'Prism', init: 'highlightAll' },
                  { name: 'hljs', init: 'highlightAll' },
                  { name: 'mermaid', init: 'init' },
                  { name: 'katex', init: 'renderAll' }
                ];
                commonLibraries.forEach(lib => {
                  if (window[lib.name] && typeof window[lib.name][lib.init] === 'function') {
                    try {
                      window[lib.name][lib.init]();
                    } catch(e) {
                      console.warn(\`Error initializing \${lib.name}.\${lib.init}()\`, e);
                    }
                  }
                });
              `;
              doc.body.appendChild(runScripts);
            }
          }
        }, 1500); // Increased timeout further to ensure all external resources load completely
      },
    });

    // Run the command to render HTML
    editor.on("load", () => {
      editor.runCommand("render-full-html");
    });

    // Command to export as JSON</parameter>
    editor.Commands.add("export-json", {
      run(editor) {
        const json = editor.getProjectData();
        const dataStr = JSON.stringify(json, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "grapesjs-project.json";
        link.click();
        URL.revokeObjectURL(url);
      },
    });

    // Command to clear canvas
    editor.Commands.add("clear-canvas", {
      run(editor) {
        if (confirm("Are you sure you want to clear the canvas?")) {
          editor.DomComponents.clear();
          editor.CssComposer.clear();
        }
      },
    });

    // Command to toggle blocks panel
    editor.Commands.add("toggle-blocks", {
      run(editor) {
        const blocksPanel = document.querySelector(
          ".w-64.bg-gray-900",
        ) as HTMLElement;
        if (blocksPanel) {
          blocksPanel.style.display =
            blocksPanel.style.display === "none" ? "block" : "none";
        }
      },
    });

    // Command to toggle right sidebar (layers, styles, traits)
    editor.Commands.add("toggle-right-panel", {
      run(editor) {
        const rightPanel = document.querySelector(
          ".w-80.bg-gray-100",
        ) as HTMLElement;
        if (rightPanel) {
          rightPanel.style.display =
            rightPanel.style.display === "none" ? "block" : "none";
        }
      },
    });

    // Add keyboard shortcuts
    editor.Keymaps.add("toggle-blocks", "ctrl+b", "toggle-blocks");
    editor.Keymaps.add("toggle-right-panel", "ctrl+r", "toggle-right-panel");

    // Add custom buttons in GrapesJS panel
    editor.Panels.addButton("options", [
      {
        id: "reload-html-btn",
        className: "fa fa-refresh",
        command: "render-full-html",
        attributes: { title: "Reload HTML with Dependencies" },
      },
      {
        id: "preview-pdf-btn",
        className: "fa fa-file-pdf-o",
        command: "send-to-preview",
        attributes: { title: "Preview & Download PDF" },
      },
      {
        id: "export-json-btn",
        className: "fa fa-download",
        command: "export-json",
        attributes: { title: "Export as JSON" },
      },
      {
        id: "clear-canvas-btn",
        className: "fa fa-trash",
        command: "clear-canvas",
        attributes: { title: "Clear Canvas" },
      },
      {
        id: "toggle-blocks-btn",
        className: "fa fa-th-large",
        command: "toggle-blocks",
        attributes: { title: "Toggle Blocks Panel" },
      },
      {
        id: "toggle-right-panel-btn",
        className: "fa fa-cog",
        command: "toggle-right-panel",
        attributes: { title: "Toggle Right Panel (Layers, Styles, Traits)" },
      },
    ]);

    // Add custom blocks
    editor.BlockManager.add("tailwind-card", {
      label: "Card",
      category: "Tailwind",
      content: `
        <div class="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white">
          <div class="font-bold text-xl mb-2">Card Title</div>
          <p class="text-gray-700 text-base">
            Card content goes here. This is a Tailwind CSS card component.
          </p>
        </div>
      `,
    });

    editor.BlockManager.add("tailwind-button", {
      label: "Button",
      category: "Tailwind",
      content: `
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Click Me
        </button>
      `,
    });

    editor.BlockManager.add("tailwind-hero", {
      label: "Hero Section",
      category: "Tailwind",
      content: `
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-5xl font-bold mb-4">Welcome to Our Site</h1>
            <p class="text-xl mb-8">Build amazing things with Tailwind CSS</p>
            <button class="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100">
              Get Started
            </button>
          </div>
        </div>
      `,
    });

    // Profile avatar block with Tailwind styles - using template HTML
    editor.BlockManager.add("tailwind-profile-avatar", {
      label: "Profile Avatar",
      category: "Tailwind",
      content: profileAvatarTemplate,
    });

    editor.BlockManager.add("resume-template-1", {
      label: "Resume Template 1 (Full)",
      category: "Templates",
      content: resumeTemplate1Full,
      media: '<img src="/man.jpg" alt="Resume Template 2" style="max-width: 100%; height: auto; object-fit: cover; border-radius: 4px;" />',
      activate: true,
    });
    // Full Resume Template 2 - Complete template from HTML file
    editor.BlockManager.add("resume-template-2", {
      label: "Resume Template 2 (Full)",
      category: "Templates",
      content: resumeTemplate2Full,
      media: '<img src="/man.jpg" alt="Resume Template 2" style="max-width: 100%; height: auto; object-fit: cover; border-radius: 4px;" />',
      activate: true,
    });

    return () => {
      editor.destroy();
    };
  }, [exported, state.htmlUpdateCount]);

  if (exported) {
    return (
      <PreviewRenderer
        html={exported.html}
        css={exported.css}
        onBack={() => setExported(null)}
      />
    );
  }

  return (
    <div className="flex h-screen">
      {/* Left sidebar - Blocks */}
      <div
        className="w-64 bg-gray-900 text-white overflow-y-auto"
        style={{ display: "none" }}
      >
        <div className="p-4 font-bold border-b border-gray-700">Blocks</div>
        <div id="blocks" className="p-2"></div>
      </div>

      {/* Main editor */}
      <div className="flex-1">
        <div id="gjs"></div>
      </div>

      {/* Right sidebar - Layers, Styles, Traits */}
      <div className="w-80 bg-gray-100 border-l border-gray-300 flex flex-col panel__right">
        <div className="panel__switcher flex border-b border-gray-300"></div>
        <div className="flex-1 overflow-y-auto">
          <div className="layers-container p-2"></div>
          <div className="styles-container p-2"></div>
          <div className="traits-container p-2"></div>
        </div>
      </div>

      {/* Hidden source of defaultHtml for reference */}
      <iframe
        id="reference-frame"
        srcDoc={defaultHtml}
        style={{ display: "none" }}
        title="Reference HTML"
        onLoad={(e) => {
          // This ensures any scripts in the iframe get executed
          // We can use this reference to debug if needed
          console.log("Reference HTML frame loaded");

          // Execute any scripts in the reference frame to see how they should work
          const frame = e.currentTarget;
          if (frame.contentWindow) {
            const doc = frame.contentWindow.document;
            
            // Extract inline scripts from defaultHtml for this specific use
            const parser = new DOMParser();
            const defaultDoc = parser.parseFromString(defaultHtml, "text/html");
            const scripts = defaultDoc.querySelectorAll("script:not([src])");
            
            scripts.forEach((script) => {
              try {
                const newScript = doc.createElement("script");
                newScript.textContent = script.textContent || "";
                doc.body.appendChild(newScript);
              } catch (err) {
                console.warn("Error executing reference frame script:", err);
              }
            });
          }
        }}
      />
    </div>
  );
}
