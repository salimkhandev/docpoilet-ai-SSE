"use client"
import { useEffect, useRef } from "react"
import grapesjs from "grapesjs"
import "grapesjs/dist/css/grapes.min.css"

const Documents = () => {
  const editorRef = useRef(null)
  const containerRef = useRef(null)

  const defaultHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Simple Section</title>
  <style>
    body {
      background: #0f172a;
      font-family: Arial, sans-serif;
      padding: 20px;
      color: white;
    }
    section {
      margin-top: 20px;
    }
    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      color: #cbd5e1;
      margin-bottom: 10px;
    }
    .bar {
      width: 4px;
      height: 16px;
      border-radius: 4px;
      background: #60a5fa;
    }
  </style>
</head>
<body>
  <section>
    <h1 class="title">
      <span class="bar"></span>
      Experiences
    </h1>
    <p style="color:#94a3b8;">
      This is an example section where you can add your content.
    </p>
  </section>
</body>
</html>
  `

  useEffect(() => {
    if (!editorRef.current && containerRef.current) {
      const editor = grapesjs.init({
        container: containerRef.current,
        height: "100vh",
        width: "100%",
        fromElement: false,
        storageManager: false
      })

      editorRef.current = editor
      editor.setComponents(defaultHtml)

      // Store pending cursor position globally
      let pendingCursorPosition = null

      // Listen for RTE enable event to set cursor position
      editor.on('rte:enable', (view) => {
        console.log('🎯 RTE enabled')

        if (pendingCursorPosition && view && view.el) {
          const { clickX, clickY } = pendingCursorPosition

          // Wait for RTE to be fully ready
          setTimeout(() => {
            const el = view.el

            if (!el.isContentEditable) {
              console.warn('Element not editable yet')
              return
            }

            // Focus first
            el.focus()

            // Set cursor position
            try {
              let range = null

              if (document.caretRangeFromPoint) {
                range = document.caretRangeFromPoint(clickX, clickY)
              } else if (document.caretPositionFromPoint) {
                const pos = document.caretPositionFromPoint(clickX, clickY)
                if (pos) {
                  range = document.createRange()
                  range.setStart(pos.offsetNode, pos.offset)
                  range.collapse(true)
                }
              }

              if (range) {
                const sel = window.getSelection()
                sel.removeAllRanges()
                sel.addRange(range)
                console.log('✅ Cursor positioned at click location')
              }
            } catch (err) {
              console.warn('Error setting cursor:', err)
            }

            // Clear pending position
            pendingCursorPosition = null
          }, 150)
        }
      })

      // Ensure content is synced when RTE is disabled (when you click away)
      editor.on('rte:disable', (view) => {
        console.log('💾 RTE disabled - saving content')

        if (view && view.el) {
          const component = view.model
          if (component) {
            const currentContent = view.el.innerHTML

            // Update component with current DOM content
            component.set('content', currentContent)
            component.components(currentContent)

            console.log('✅ Content synced on RTE disable:', currentContent)

            // Trigger update event to notify GrapesJS
            editor.trigger('component:update', component)
          }
        }
      })

      // Handle component mount
      editor.on('component:mount', (component) => {
        const tagName = component.get('tagName')
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].includes(tagName)) {
          component.set({
            editable: true,
            stylable: true,
          })

          const view = component.view

          // Double-click handler
          view.el.addEventListener('dblclick', (e) => {
            e.stopPropagation()

            // Store click coordinates for later use
            pendingCursorPosition = {
              clickX: e.clientX,
              clickY: e.clientY
            }

            console.log('📍 Stored click position:', pendingCursorPosition)

            // Select component
            editor.select(component)

            // Enable RTE (this will trigger rte:enable event)
            setTimeout(() => {
              const rte = editor.RichTextEditor
              if (rte && rte.enable) {
                rte.enable(view, component.get('activeOnRender'))
              }
            }, 0)
          })
        }
      })

      // Log updates to verify content is being saved
      editor.on('component:update', (component) => {
        console.log('📝 Component updated:', component.toHTML())
      })
    }
  }, [])

  return (
    <div className="w-full h-screen bg-gray-100 p-2">
      <div
        ref={containerRef}
        className="w-full h-full rounded-lg overflow-hidden shadow-md"
      ></div>
    </div>
  )
}

export default Documents