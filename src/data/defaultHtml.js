export const defaultHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DocPilot AI – Smart Document Builder</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      body {
        font-family: 'Inter', sans-serif;
        width: 210mm;
        height: 297mm;
        margin: 0 auto;
        background: #0f172a;
        color: #e5e7eb;
        overflow: hidden;
      }
      .page-content {
        padding: 15mm 18mm;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(37, 99, 235, 0.15);
        border: 1px solid rgba(59, 130, 246, 0.5);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .pill {
        display: inline-flex;
        padding: 4px 9px;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(148, 163, 184, 0.5);
        font-size: 10px;
      }
      .glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%),
                    radial-gradient(circle at bottom right, rgba(59,130,246,0.18), transparent 55%);
        pointer-events: none;
        z-index: -1;
      }
      .card {
        border-radius: 18px;
        border: 1px solid rgba(148, 163, 184, 0.4);
        background: linear-gradient(145deg, rgba(15,23,42,0.95), rgba(15,23,42,0.85));
        box-shadow:
          0 18px 45px rgba(15,23,42,0.9),
          0 0 0 1px rgba(15,23,42,1);
        padding: 14px 16px;
      }
      @media print {
        body {
          width: 210mm;
          height: 297mm;
        }
      }
    </style>
  </head>
  <body>
    <div class="page-content relative overflow-hidden">
      <div class="glow"></div>

      <span class="badge">
        <span style="width:8px;height:8px;border-radius:999px;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,0.25);display:inline-block;"></span>
        Live • DocPilot AI
      </span>

      <h1 class="mt-3 text-3xl font-bold tracking-tight leading-tight">
        Welcome to <span class="text-blue-400">DocPilot AI</span>
      </h1>
      <p class="mt-2 text-xs text-slate-300 max-w-xl leading-relaxed">
        DocPilot AI is your AI‑powered co‑pilot for documents. Describe what you need in plain language,
        and DocPilot instantly turns it into a clean, structured, and ready‑to‑export document – no complex
        editors or formatting skills required.
      </p>

      <div class="mt-3 grid grid-cols-2 gap-3 max-w-xl text-xs text-slate-200">
        <div class="card">
          <p class="text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-[0.14em]">
            What you can do
          </p>
          <ul class="list-disc pl-4 space-y-0.5 text-[10px] text-slate-300">
            <li>Create resumes, cover letters, and reports by chatting with AI.</li>
            <li>Visually edit your document with a drag‑and‑drop builder.</li>
            <li>Export to PDF or DOCX in a single click.</li>
          </ul>
        </div>

        <div class="card">
          <p class="text-[10px] font-semibold text-slate-300 mb-1 uppercase tracking-[0.14em]">
            Getting started
          </p>
          <ol class="list-decimal pl-4 space-y-0.5 text-[10px] text-slate-300">
            <li>Use the chat to tell DocPilot what you want to create.</li>
            <li>Tweak the layout in the visual editor to match your style.</li>
            <li>Download a polished document ready to share or print.</li>
          </ol>
        </div>
      </div>

      <div class="mt-3 flex flex-wrap gap-2 text-slate-300">
        <span class="pill">AI‑assisted writing</span>
        <span class="pill">Visual document builder</span>
        <span class="pill">PDF / DOCX export</span>
        <span class="pill">Resume & reports</span>
      </div>

      <p class="mt-3 text-[10px] text-slate-400">
        Start by editing this page or asking the AI to draft your first document. DocPilot AI handles the structure,
        styling, and export – you focus on your ideas.
      </p>
    </div>
  </body>
</html>
`;
