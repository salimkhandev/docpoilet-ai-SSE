/**
 * Utility functions for wrapping loose text nodes in GrapesJS editor
 * This ensures text nodes with empty element siblings are properly wrapped
 * so they can be selected and edited in GrapesJS
 */

/**
 * Wraps loose text nodes in span tags when they have empty element siblings
 * Optimized to check siblings once per container instead of per text node
 * @param container - The HTML element to process
 */
export const wrapTextNodesForGrapesJS = (container: HTMLElement): void => {
  const childNodes = Array.from(container.childNodes);

  // Early exit if no children
  if (childNodes.length === 0) return;

  // Pre-check siblings once instead of per text node
  const siblings = Array.from(container.children);
  const hasEmptySiblings = siblings.some((el) => !el.textContent?.trim());

  childNodes.forEach((node) => {
    // If it's a text node with actual text
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      if (hasEmptySiblings) {
        // Wrap text in a <span>
        const wrapper = document.createElement("span");
        wrapper.className = "label";
        wrapper.textContent = node.textContent.trim();
        container.replaceChild(wrapper, node);
      }
    }
    // Recursively handle child elements
    else if (node.nodeType === Node.ELEMENT_NODE) {
      wrapTextNodesForGrapesJS(node as HTMLElement);
    }
  });
};

/**
 * Preprocesses HTML string to wrap loose text nodes before GrapesJS parses it
 * @param html - The HTML string to preprocess
 * @returns The preprocessed HTML string with wrapped text nodes
 */
export const preprocessHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Wrap loose text nodes in the parsed document
  wrapTextNodesForGrapesJS(doc.body);

  return doc.body.innerHTML;
};

