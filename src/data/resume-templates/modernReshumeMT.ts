export const modernReshumeMTFull = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Resume - Full Stack Developer | Salim Khan</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
  <style>
    @page {
      size: A4;
      margin: 0;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    .preview-content {
      word-break: break-word;
    }

    .chip {
      white-space: nowrap;
    }

    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  </style>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['system-ui', 'ui-sans-serif', 'Segoe UI', 'Roboto', 'sans-serif'],
          },
          colors: {
            primary: {
              50: '#eef2ff',
              100: '#e0e7ff',
              200: '#c7d2fe',
              300: '#a5b4fc',
              400: '#818cf8',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
              800: '#3730a3',
              900: '#312e81',
            },
            accent: {
              50: '#fdf2ff',
              100: '#fae8ff',
              200: '#f5d0fe',
              300: '#f0abfc',
              400: '#e879f9',
              500: '#d946ef',
              600: '#c026d3',
              700: '#a21caf',
              800: '#86198f',
              900: '#701a75',
            },
            tealx: {
              50: '#ecfeff',
              100: '#cffafe',
              200: '#a5f3fc',
              300: '#67e8f9',
              400: '#22d3ee',
              500: '#06b6d4',
              600: '#0891b2',
              700: '#0e7490',
              800: '#155e75',
              900: '#164e63',
            }
          },
          boxShadow: {
            neon: '0 0 15px rgba(99,102,241,0.6)',
          },
        },
      },
    }; 
  </script>
</head>

<body class="bg-slate-100 flex justify-center items-center min-h-screen p-4 font-sans">
  <div
    class="preview-content w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl rounded-3xl overflow-hidden border border-slate-200 relative">
    <!-- Gradient Accent Background -->
    <div class="gradient-overlay absolute inset-0 pointer-events-none">
      <div class="absolute -top-32 -left-32 w-80 h-80 bg-primary-100/80 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-32 -right-32 w-80 h-80 bg-accent-100/80 rounded-full blur-3xl"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100"></div>
    </div>

    <!-- Content Wrapper -->
    <div class="relative z-10 grid grid-cols-[34%_66%] h-full">
      <!-- LEFT PANEL -->
      <aside class="border-r border-slate-200 bg-slate-50/90 backdrop-blur-xl px-6 py-7 flex flex-col gap-6">
        <!-- Profile -->
        <section class="flex flex-col items-center text-center gap-3">
          <div class="relative">
            <div
              class="w-32 h-32 rounded-3xl bg-gradient-to-tr from-primary-400 via-accent-400 to-tealx-300 p-[3px] shadow-lg shadow-primary-200/70">
              <div class="w-full h-full rounded-3xl bg-white flex items-center justify-center">
                <img
                  src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1730239213~exp=1730242813~hmac=7765d17a286efa84fbb99e4757bc5ae7b1e246698ca280c1564cf2104ab63aeb&w=1060"
                  alt="Profile logo placeholder"
                  class="w-full h-full rounded-3xl object-cover" />
              </div>
            </div>
            <span
              class="absolute -bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-300 px-2 py-[2px] text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-700 shadow-md shadow-emerald-200/80 backdrop-blur whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Open to work
            </span>
          </div>
          <div>
            <h1 class="text-xl font-semibold tracking-tight text-slate-900">
              Salim <span class="text-primary-600">Khan</span>
            </h1>
            <p class="text-[11px] uppercase tracking-[0.25em] text-slate-500 mt-1">
              Full Stack Developer
            </p>
          </div>
        </section>

        <!-- Contact -->
        <section>
          <h2 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 mb-3">
            <span class="w-1 h-4 rounded-full bg-primary-400"></span>
            Contact
          </h2>
          <div class="space-y-2.5 text-[11px]">
            <div class="flex items-start gap-2">
              <span class="mt-[2px] text-primary-500 icon"><i class="bi bi-geo-alt-fill"></i></span>
              <div>
                <p class="font-medium text-slate-900">Location</p>
                <p class="text-slate-500/90">City, Country (Remote / Hybrid)</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <span class="mt-[2px] text-primary-500 icon"><i class="bi bi-envelope-fill"></i></span>
              <div>
                <p class="font-medium text-slate-900">Email</p>
                <p class="text-slate-500/90">salim.khan.dev@example.com</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <span class="mt-[2px] text-primary-500 icon"><i class="bi bi-telephone-fill"></i></span>
              <div>
                <p class="font-medium text-slate-900">Phone</p>
                <p class="text-slate-500/90">+00 123 456 7890</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <span class="mt-[2px] text-primary-500 icon"><i class="bi bi-globe2"></i></span>
              <div>
                <p class="font-medium text-slate-900">Portfolio</p>
                <a href="https://salimkhan.dev"
                  class="text-primary-600 hover:text-primary-500 underline decoration-primary-400/70">
                  salimkhan.dev
                </a>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <span class="mt-[2px] text-primary-500 icon"><i class="bi bi-linkedin"></i></span>
              <div>
                <p class="font-medium text-slate-900">LinkedIn</p>
                <a href="https://www.linkedin.com/in/salim-khan"
                  class="text-primary-600 hover:text-primary-500 underline decoration-primary-400/70">
                  linkedin.com/in/salim-khan
                </a>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <span class="mt-[2px] text-primary-500 icon"><i class="bi bi-github"></i></span>
              <div>
                <p class="font-medium text-slate-900">GitHub</p>
                <a href="https://github.com/salimkhan"
                  class="text-primary-600 hover:text-primary-500 underline decoration-primary-400/70">
                  github.com/salimkhan
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- Tech Stack -->
        <section>
          <h2 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 mb-3">
            <span class="w-1 h-4 rounded-full bg-accent-400"></span>
            Tech Stack
          </h2>
          <div class="space-y-2 text-[11px]">
            <div>
              <p class="text-[11px] font-semibold text-slate-900 mb-1 flex items-center gap-1">
                <span class="text-accent-500 icon"><i class="bi bi-palette-fill"></i></span>
                 Frontend
              </p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  class="chip px-2 py-0.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700">React</span>
                <span
                  class="chip px-2 py-0.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700">Next.js</span>
                <span
                  class="chip px-2 py-0.5 rounded-full bg-accent-50 border border-accent-200 text-accent-700">TypeScript</span>
                <span class="chip px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700">Tailwind
                  CSS</span>
                <span
                  class="chip px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700">Redux</span>
              </div>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-slate-900 mb-1 flex items-center gap-1">
                <span class="text-accent-500 icon"><i class="bi bi-cpu-fill"></i></span> Backend
              </p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  class="chip px-2 py-0.5 rounded-full bg-tealx-50 border border-tealx-200 text-tealx-700">Node.js</span>
                <span
                  class="chip px-2 py-0.5 rounded-full bg-tealx-50 border border-tealx-200 text-tealx-700">Express</span>
                <span class="chip px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700">REST
                  APIs</span>
                <span
                  class="chip px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700">GraphQL</span>
              </div>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-slate-900 mb-1 flex items-center gap-1">
                <span class="text-accent-500 icon"><i class="bi bi-hdd-stack-fill"></i></span> Databases &amp; Cloud
              </p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  class="chip px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700">PostgreSQL</span>
                <span
                  class="chip px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700">MongoDB</span>
                <span
                  class="chip px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700">Redis</span>
                <span
                  class="chip px-2 py-0.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700">Docker</span>
                <span
                  class="chip px-2 py-0.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700">AWS</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Skills -->
        <section>
          <h2 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 mb-3">
            <span class="w-1 h-4 rounded-full bg-tealx-400"></span>
            Skills
          </h2>
          <div class="space-y-2 text-[11px]">
            <div class="flex items-center justify-between">
              <span class="text-slate-800">JavaScript / TypeScript</span>
              <span class="text-[10px] text-primary-600">Expert</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div class="h-full w-[92%] bg-gradient-to-r from-primary-400 via-accent-400 to-tealx-400 rounded-full"></div>
            </div>

            <div class="flex items-center justify-between mt-2">
              <span class="text-slate-800">React / Next.js</span>
              <span class="text-[10px] text-primary-600">Advanced</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div class="h-full w-[88%] bg-gradient-to-r from-primary-400 via-accent-400 to-tealx-400 rounded-full"></div>
            </div>

            <div class="flex items-center justify-between mt-2">
              <span class="text-slate-800">Node.js / Express</span>
              <span class="text-[10px] text-primary-600">Advanced</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div class="h-full w-[86%] bg-gradient-to-r from-primary-400 via-accent-400 to-tealx-400 rounded-full"></div>
            </div>

            <div class="flex items-center justify-between mt-2">
              <span class="text-slate-800">System Design</span>
              <span class="text-[10px] text-primary-600">Strong</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div class="h-full w-[80%] bg-gradient-to-r from-primary-400 via-accent-400 to-tealx-400 rounded-full"></div>
            </div>
          </div>
        </section>

        <!-- Languages -->
        <section class="mt-auto pb-2">
          <h2 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 mb-3">
            <span class="w-1 h-4 rounded-full bg-primary-400"></span>
            Languages
          </h2>
          <div class="space-y-1.5 text-[11px]">
            <div class="flex items-center justify-between">
              <span class="text-slate-800">English</span>
              <span class="text-slate-500/90">Fluent</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-800">Hindi / Urdu</span>
              <span class="text-slate-500/90">Native</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-800">Other</span>
              <span class="text-slate-500/90">Conversational</span>
            </div>
          </div>
        </section>
      </aside>

      <!-- RIGHT PANEL -->
      <main class="px-7 py-7 flex flex-col gap-4 bg-white/80">
        <!-- Header Summary -->
        <section class="mb-1">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p
                class="chip inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-primary-700">
                <i class="bi bi-laptop text-primary-500"></i> Full Stack Developer
              </p>
              <h1 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                Building scalable, delightful web experiences end‑to‑end.
              </h1>
            </div>
            <div class="hidden md:flex flex-col items-end text-[11px] text-slate-500">
              <span class="chip px-2 py-1 rounded-full bg-slate-50 border border-slate-200">
                Experience: <span class="text-primary-700 font-medium">4–6+ years</span>
              </span>
              <span class="chip mt-1 px-2 py-1 rounded-full bg-slate-50 border border-slate-200">
                Focus: <span class="text-accent-600 font-medium">React · Node · Cloud</span>
              </span>
            </div>
          </div>
          <p class="mt-3 text-[12px] leading-relaxed text-slate-700">
            Full stack engineer with a strong product mindset, crafting responsive UIs and robust APIs with equal care.
            Experienced in designing, building, and deploying modern web applications using React, Next.js, Node.js, and
            cloud‑native tooling. Passionate about clean architecture, performance, DX, and shipping features that users
            genuinely love.
          </p>
        </section>

        <!-- Experience -->
        <section>
          <h2 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 mb-2.5">
            <span class="w-1 h-4 rounded-full bg-primary-400"></span>
            Experience
          </h2>

          <div class="space-y-3.5 text-[12px]">
            <!-- Job 1 -->
            <article class="relative rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
              <div
                class="absolute left-0 top-0 h-full w-[3px] rounded-l-2xl bg-gradient-to-b from-primary-400 via-accent-400 to-tealx-400">
              </div>
              <div class="ml-2">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="font-semibold text-slate-900">
                      Senior Full Stack Developer
                    </h3>
                    <p class="text-[11px] text-slate-500">
                      TechNova Labs · Remote
                    </p>
                  </div>
                  <div class="text-right text-[11px] text-slate-500">
                    <p>2021 – Present</p>
                    <p class="text-emerald-600">Full‑time</p>
                  </div>
                </div>
                <p class="mt-1.5 text-[11px] text-slate-700">
                  Leading end‑to‑end development of SaaS dashboards and internal tools using React, Next.js, Node.js,
                  and PostgreSQL.
                </p>
                <ul class="mt-2.5 space-y-1.5 text-[11px] text-slate-700">
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-primary-500">▹</span>
                    <span>
                      Architected a modular monorepo (frontend + backend) that reduced deployment time by
                      <span class="text-primary-200 font-semibold">40%</span> and simplified CI/CD.
                    </span>
                  </li>
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-primary-500">▹</span>
                    <span>
                      Implemented real‑time analytics dashboards with WebSockets and caching, improving perceived
                      performance and engagement.
                    </span>
                  </li>
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-primary-500">▹</span>
                    <span>
                      Collaborated with designers and PMs to ship features in 2‑week sprints, maintaining
                      <span class="text-primary-200 font-semibold">95%+</span> on‑time delivery.
                    </span>
                  </li>
                </ul>
                <div class="mt-2.5 flex flex-wrap gap-1.5 text-[10px]">
                  <span
                    class="chip px-2 py-0.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700">React</span>
                  <span
                    class="chip px-2 py-0.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700">Next.js</span>
                  <span
                    class="chip px-2 py-0.5 rounded-full bg-tealx-50 border border-tealx-200 text-tealx-700">Node.js</span>
                  <span
                    class="chip px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700">PostgreSQL</span>
                  <span
                    class="chip px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700">Redis</span>
                  <span
                    class="chip px-2 py-0.5 rounded-full bg-accent-50 border border-accent-200 text-accent-700">Docker</span>
                </div>
              </div>
            </article>

            <!-- Job 2 -->
            <article class="relative rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
              <div
                class="absolute left-0 top-0 h-full w-[3px] rounded-l-2xl bg-gradient-to-b from-tealx-400 via-primary-400 to-accent-400">
              </div>
              <div class="ml-2">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="font-semibold text-slate-900">
                      Full Stack Engineer
                    </h3>
                    <p class="text-[11px] text-slate-500">
                      CloudBridge Solutions · On‑site / Hybrid
                    </p>
                  </div>
                  <div class="text-right text-[11px] text-slate-500">
                    <p>2018 – 2021</p>
                    <p class="text-sky-600">Full‑time</p>
                  </div>
                </div>
                <p class="mt-1.5 text-[11px] text-slate-700">
                  Built customer‑facing web apps and internal admin portals, focusing on performance, reliability, and
                  maintainability.
                </p>
                <ul class="mt-2.5 space-y-1.5 text-[11px] text-slate-700">
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-primary-500">▹</span>
                    <span>
                      Migrated legacy jQuery apps to React and modular APIs, reducing bundle size by
                      <span class="text-primary-200 font-semibold">30%</span> and improving Lighthouse scores.
                    </span>
                  </li>
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-primary-500">▹</span>
                    <span>
                      Designed RESTful services and authentication flows (JWT, OAuth) used by multiple product teams.
                    </span>
                  </li>
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-primary-500">▹</span>
                    <span>
                      Mentored junior developers on best practices, code reviews, and testing strategies.
                    </span>
                  </li>
                </ul>
                <div class="mt-2.5 flex flex-wrap gap-1.5 text-[10px]">
                  <span
                    class="chip px-2 py-0.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700">React</span>
                  <span
                    class="chip px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700">Express</span>
                  <span
                    class="chip px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700">MongoDB</span>
                  <span class="chip px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700">REST
                    APIs</span>
                  <span
                    class="chip px-2 py-0.5 rounded-full bg-accent-50 border border-accent-200 text-accent-700">CI/CD</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <!-- Projects & Highlights -->
        <section class="grid grid-cols-2 gap-4">
          <!-- Projects -->
          <div>
            <h2 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 mb-2.5">
              <span class="w-1 h-4 rounded-full bg-accent-400"></span>
              Selected Projects
            </h2>
            <div class="space-y-2.5 text-[12px]">
              <article class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h3 class="font-semibold text-slate-900 flex items-center gap-1.5">
                      SaaS Analytics Dashboard
                      <span
                        class="chip text-[10px] px-1.5 py-0.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700">
                        React · Node
                      </span>
                    </h3>
                    <p class="text-[11px] text-slate-600">
                      Real‑time metrics, role‑based access, and custom reporting.
                    </p>
                  </div>
                </div>
                <ul class="mt-1.5 space-y-1 text-[11px] text-slate-700">
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-accent-500">▹</span>
                    <span>Implemented live charts with WebSockets and server‑side pagination.</span>
                  </li>
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-accent-500">▹</span>
                    <span>Optimized queries and caching to handle thousands of events/min.</span>
                  </li>
                </ul>
              </article>

              <article class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h3 class="font-semibold text-slate-900 flex items-center gap-1.5">
                      E‑commerce Platform
                      <span
                        class="chip text-[10px] px-1.5 py-0.5 rounded-full bg-tealx-50 border border-tealx-200 text-tealx-700">
                        Next.js · Stripe
                      </span>
                    </h3>
                    <p class="text-[11px] text-slate-600">
                      SEO‑friendly storefront with secure checkout and admin panel.
                    </p>
                  </div>
                </div>
                <ul class="mt-1.5 space-y-1 text-[11px] text-slate-700">
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-accent-500">▹</span>
                    <span>Implemented SSR/ISR for fast, SEO‑optimized product pages.</span>
                  </li>
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-accent-500">▹</span>
                    <span>Integrated Stripe payments and webhooks for order lifecycle.</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>

          <!-- Highlights / Education -->
          <div>
            <h2 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 mb-2.5">
              <span class="w-1 h-4 rounded-full bg-tealx-400"></span>
              Highlights &amp; Education
            </h2>
            <div class="space-y-2.5 text-[12px]">
              <!-- Highlights -->
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <h3 class="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <i class="bi bi-lightning-charge-fill text-accent-500"></i> Key Highlights
                </h3>
                <ul class="space-y-1.5 text-[11px] text-slate-700">
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-tealx-500">▹</span>
                    <span>Comfortable owning features across the stack from idea to production.</span>
                  </li>
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-tealx-500">▹</span>
                    <span>Strong focus on DX: reusable components, clear APIs, and documentation.</span>
                  </li>
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-tealx-500">▹</span>
                    <span>Experience with agile workflows, code reviews, and mentoring.</span>
                  </li>
                </ul>
              </div>

              <!-- Education -->
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <h3 class="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <i class="bi bi-mortarboard-fill text-primary-500"></i> Education
                </h3>
                <div class="text-[11px] text-slate-700">
                  <p class="font-semibold text-slate-900">
                    B.Tech in Computer Science (or related)
                  </p>
                  <p class="text-slate-600">
                    University Name · 2014 – 2018
                  </p>
                  <p class="mt-1 text-slate-600/90">
                    Focus on software engineering, data structures, algorithms, and web technologies.
                  </p>
                </div>
              </div>

              <!-- Certifications -->
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <h3 class="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <i class="bi bi-award-fill text-tealx-500"></i> Certifications
                </h3>
                <ul class="space-y-1.5 text-[11px] text-slate-700">
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-primary-500">▹</span>
                    <span>Modern React &amp; TypeScript (Online)</span>
                  </li>
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-primary-500">▹</span>
                    <span>Backend APIs with Node.js &amp; Express (Online)</span>
                  </li>
                  <li class="flex gap-1.5">
                    <span class="mt-[2px] text-primary-500">▹</span>
                    <span>Cloud Fundamentals (AWS / similar)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer / Interests -->
        <section class="mt-1 pt-2 border-t border-slate-200">
          <div class="flex items-center justify-between gap-3 text-[11px] text-slate-600">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 border border-slate-200">
                <i class="bi bi-stars text-accent-500"></i> Open to: Full‑time · Remote · Hybrid
              </span>
              <span
                class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 border border-slate-200">
                <i class="bi bi-bullseye text-primary-500"></i> Interests: DX, DevTools, Scalable Systems
              </span>
            </div>
          
          </div>
        </section>
      </main>
    </div>
  </div>
</body>

</html>`