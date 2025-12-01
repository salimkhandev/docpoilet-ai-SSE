export const ATSresumeTemplateFull = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Salim Khan - ATS Friendly Resume (No Icons)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        background: #e5e7eb;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
          sans-serif;
      }

      .page {
        width: 210mm;
        min-height: 297mm;
        margin: 16px auto;
        background: #ffffff;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);
      }
    </style>
  </head>
  <body class="antialiased">
    <div class="page px-10 py-10">
      <!-- Header -->
      <header class="border-b border-slate-200 pb-4 mb-6">
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
          Salim Khan
        </h1>
        <p class="mt-1 text-sm text-slate-700">
          Results-driven professional with strong experience in software
          development, problem solving, and delivering high-quality solutions in
          fast-paced environments.
        </p>

        <!-- Contact (plain text, no icons) -->
        <div class="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-800">
          <span>Email: salim.khan@example.com</span>
          <span>Phone: +1 234 567 890</span>
          <span>Location: New York, USA</span>
          <span>
            LinkedIn:
            <a
              href="https://www.linkedin.com/in/salim-khan"
              class="text-blue-700 underline"
            >
              linkedin.com/in/salim-khan
            </a>
          </span>
          <span>
            GitHub:
            <a
              href="https://github.com/salim-khan"
              class="text-blue-700 underline"
            >
              github.com/salim-khan
            </a>
          </span>
        </div>
      </header>

      <div class="grid grid-cols-12 gap-6">
        <!-- Left Column -->
        <section class="col-span-12 md:col-span-8 space-y-5">
          <!-- Professional Summary -->
          <section>
            <h2 class="text-sm font-semibold tracking-wide text-slate-900 uppercase">
              Professional Summary
            </h2>
            <div class="mt-1 h-0.5 w-10 bg-blue-600 rounded-full"></div>
            <p class="mt-2 text-sm leading-relaxed text-slate-800">
              Detail-oriented software engineer with experience in designing,
              developing, and maintaining web applications. Skilled in modern
              JavaScript frameworks, RESTful APIs, and database design. Adept at
              collaborating with cross-functional teams, optimizing performance,
              and writing clean, maintainable code.
            </p>
          </section>

          <!-- Experience -->
          <section>
            <h2 class="text-sm font-semibold tracking-wide text-slate-900 uppercase">
              Professional Experience
            </h2>
            <div class="mt-1 h-0.5 w-10 bg-blue-600 rounded-full"></div>

            <!-- Job 1 -->
            <div class="mt-3">
              <div class="flex flex-wrap justify-between gap-y-1">
                <div>
                  <h3 class="text-sm font-semibold text-slate-900">
                    Senior Software Engineer
                  </h3>
                  <p class="text-xs text-slate-700">
                    TechNova Solutions, New York, USA
                  </p>
                </div>
                <p class="text-xs text-slate-600">Jan 2021 – Present</p>
              </div>
              <p class="mt-1 text-xs font-medium text-slate-700">
                Key Responsibilities & Achievements:
              </p>
              <ul class="mt-1 list-disc list-inside text-sm text-slate-800 space-y-1">
                <li>
                  Led the development of scalable web applications using React,
                  Node.js, and TypeScript, improving performance and user
                  experience.
                </li>
                <li>
                  Collaborated with product managers and designers to define
                  requirements and deliver features on time and within scope.
                </li>
                <li>
                  Implemented automated testing and CI/CD pipelines, reducing
                  regression issues and deployment time.
                </li>
                <li>
                  Mentored junior developers, conducted code reviews, and
                  promoted best practices in coding standards and architecture.
                </li>
              </ul>
            </div>

            <!-- Job 2 -->
            <div class="mt-4">
              <div class="flex flex-wrap justify-between gap-y-1">
                <div>
                  <h3 class="text-sm font-semibold text-slate-900">
                    Software Engineer
                  </h3>
                  <p class="text-xs text-slate-700">
                    BrightCode Labs, New York, USA
                  </p>
                </div>
                <p class="text-xs text-slate-600">Jul 2017 – Dec 2020</p>
              </div>
              <p class="mt-1 text-xs font-medium text-slate-700">
                Key Responsibilities & Achievements:
              </p>
              <ul class="mt-1 list-disc list-inside text-sm text-slate-800 space-y-1">
                <li>
                  Developed and maintained full-stack web applications using
                  JavaScript, React, and Node.js.
                </li>
                <li>
                  Optimized database queries and API endpoints, improving response
                  times and system reliability.
                </li>
                <li>
                  Worked closely with QA teams to identify, troubleshoot, and
                  resolve software defects.
                </li>
                <li>
                  Participated in Agile ceremonies and contributed to sprint
                  planning, estimation, and retrospectives.
                </li>
              </ul>
            </div>
          </section>

          <!-- Projects -->
          <section>
            <h2 class="text-sm font-semibold tracking-wide text-slate-900 uppercase">
              Selected Projects
            </h2>
            <div class="mt-1 h-0.5 w-10 bg-blue-600 rounded-full"></div>

            <div class="mt-3 space-y-3">
              <div>
                <h3 class="text-sm font-semibold text-slate-900">
                  Customer Analytics Dashboard
                </h3>
                <p class="text-xs text-slate-700">
                  Tech stack: React, TypeScript, Node.js, PostgreSQL
                </p>
                <ul class="mt-1 list-disc list-inside text-sm text-slate-800 space-y-1">
                  <li>
                    Built an interactive dashboard for visualizing customer
                    behavior and sales metrics, enabling data-driven decision
                    making.
                  </li>
                  <li>
                    Implemented reusable UI components and state management for
                    maintainability and scalability.
                  </li>
                </ul>
              </div>

              <div>
                <h3 class="text-sm font-semibold text-slate-900">
                  Task Management Web Application
                </h3>
                <p class="text-xs text-slate-700">
                  Tech stack: React, Node.js, MongoDB
                </p>
                <ul class="mt-1 list-disc list-inside text-sm text-slate-800 space-y-1">
                  <li>
                    Developed a responsive task management tool with user
                    authentication, role-based access, and real-time updates.
                  </li>
                  <li>
                    Integrated RESTful APIs and implemented secure authentication
                    flows.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </section>

        <!-- Right Column -->
        <aside class="col-span-12 md:col-span-4 space-y-5">
          <!-- Skills -->
          <section>
            <h2 class="text-sm font-semibold tracking-wide text-slate-900 uppercase">
              Technical Skills
            </h2>
            <div class="mt-1 h-0.5 w-10 bg-blue-600 rounded-full"></div>
            <div class="mt-2 space-y-2 text-sm text-slate-800">
              <div>
                <p class="text-xs font-semibold text-slate-700 uppercase">
                  Programming Languages
                </p>
                <p>JavaScript, TypeScript, HTML, CSS</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-700 uppercase">
                  Frameworks & Libraries
                </p>
                <p>React, Node.js, Express</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-700 uppercase">
                  Databases
                </p>
                <p>PostgreSQL, MongoDB</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-700 uppercase">
                  Tools & Platforms
                </p>
                <p>Git, GitHub, Docker, REST APIs, CI/CD</p>
              </div>
            </div>
          </section>

          <!-- Education -->
          <section>
            <h2 class="text-sm font-semibold tracking-wide text-slate-900 uppercase">
              Education
            </h2>
            <div class="mt-1 h-0.5 w-10 bg-blue-600 rounded-full"></div>
            <div class="mt-2">
              <h3 class="text-sm font-semibold text-slate-900">
                Bachelor of Science in Computer Science
              </h3>
              <p class="text-xs text-slate-700">
                University of New York, New York, USA
              </p>
              <p class="text-xs text-slate-600">2013 – 2017</p>
            </div>
          </section>

          <!-- Certifications -->
          <section>
            <h2 class="text-sm font-semibold tracking-wide text-slate-900 uppercase">
              Certifications
            </h2>
            <div class="mt-1 h-0.5 w-10 bg-blue-600 rounded-full"></div>
            <ul class="mt-2 list-disc list-inside text-sm text-slate-800 space-y-1">
              <li>Certified JavaScript Developer</li>
              <li>Cloud Fundamentals Certification</li>
            </ul>
          </section>

          <!-- Additional Information -->
          <section>
            <h2 class="text-sm font-semibold tracking-wide text-slate-900 uppercase">
              Additional Information
            </h2>
            <div class="mt-1 h-0.5 w-10 bg-blue-600 rounded-full"></div>
            <ul class="mt-2 list-disc list-inside text-sm text-slate-800 space-y-1">
              <li>Languages: English (Fluent), Hindi (Fluent)</li>
              <li>Work Authorization: Eligible to work in the USA</li>
              <li>Open to relocation and remote opportunities</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  </body>
</html>`;

