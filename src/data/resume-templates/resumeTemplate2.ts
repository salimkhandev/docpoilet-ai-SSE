// Resume Template 2 exports from resumeTemplate2.html

// Full Resume Template 2 - Complete HTML document
export const resumeTemplate2Full = `<!DOCTYPE html> 
<html lang="en"> 
<head> 
  <meta charset="UTF-8" /> 
  <title>Salim Khan - Full Stack Developer</title> 
  <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
  <script src="https://cdn.tailwindcss.com"></script> 
  <link 
    rel="stylesheet" 
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
  /> 
  <style> 
    @page { 
      size: A4; 
      margin: 0; 
    } 
    body { 
      -webkit-print-color-adjust: exact; 
      print-color-adjust: exact; 
    } 
  </style> 
</head> 
<body class="bg-gray-100 flex justify-center items-center min-h-screen py-6"> 
  <div 
    class="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl rounded-2xl overflow-hidden border border-slate-200" 
  > 
    <!-- Header --> 
    <header class="px-10 pt-10 pb-6 border-b border-slate-200 bg-white"> 
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"> 
        <div> 
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900"> 
            SALIM <span class="text-indigo-600">KHAN</span> 
          </h1> 
          <p class="mt-1 text-lg font-semibold text-slate-700"> 
            Full Stack Developer 
          </p> 
        </div> 
        <div class="text-sm text-slate-700 space-y-1"> 
          <div class="flex items-center gap-2"> 
            <i class="fa-solid fa-location-dot text-indigo-600 w-4"></i> 
            <span>Peshawar, Pakistan</span> 
          </div> 
          <div class="flex items-center gap-2"> 
            <i class="fa-solid fa-envelope text-indigo-600 w-4"></i> 
            <a href="mailto:youremail@example.com" class="hover:text-indigo-600"> 
              youremail@example.com 
            </a> 
          </div> 
          <div class="flex items-center gap-2"> 
            <i class="fa-solid fa-phone text-indigo-600 w-4"></i> 
            <a href="tel:+920000000000" class="hover:text-indigo-600"> 
              +92 000 0000000 
            </a> 
          </div> 
          <div class="flex items-center gap-2"> 
            <i class="fa-brands fa-github text-indigo-600 w-4"></i> 
            <a href="https://github.com/your-github" class="hover:text-indigo-600"> 
              github.com/your-github 
            </a> 
          </div> 
          <div class="flex items-center gap-2"> 
            <i class="fa-brands fa-linkedin text-indigo-600 w-4"></i> 
            <a href="https://linkedin.com/in/your-linkedin" class="hover:text-indigo-600"> 
              linkedin.com/in/your-linkedin 
            </a> 
          </div> 
        </div> 
      </div> 
    </header> 

    <!-- Body --> 
    <main class="px-10 py-8 grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8"> 
      <!-- Left Column --> 
      <section class="space-y-6"> 
        <!-- Summary --> 
        <div> 
          <h2 class="text-sm font-bold tracking-[0.2em] text-slate-500 uppercase flex items-center gap-2"> 
            <i class="fa-solid fa-user text-indigo-600"></i> 
            Profile 
          </h2> 
          <p class="mt-2 text-sm leading-relaxed text-slate-700"> 
            Full Stack Developer with hands-on experience building responsive, high-performance web 
            applications using React, Next.js, Node.js, Express, PostgreSQL, and Tailwind CSS. 
            Strong focus on clean architecture, reusable components, and modern UI/UX practices. 
            Proven ability to collaborate with cross-functional teams and deliver scalable solutions 
            on time. 
          </p> 
        </div> 

        <!-- Experience --> 
        <div> 
          <h2 class="text-sm font-bold tracking-[0.2em] text-slate-500 uppercase flex items-center gap-2"> 
            <i class="fa-solid fa-briefcase text-indigo-600"></i> 
            Professional Experience 
          </h2> 

          <!-- Job 1 --> 
          <div class="mt-3 space-y-1"> 
            <div class="flex flex-wrap items-baseline justify-between gap-2"> 
              <h3 class="text-base font-semibold text-slate-900"> 
                Full Stack Developer 
              </h3> 
              <span class="text-xs font-medium text-slate-500"> 
                Jan 2024 - Present 
              </span> 
            </div> 
            <div class="flex flex-wrap items-center justify-between gap-2"> 
              <p class="text-sm font-medium text-indigo-700"> 
                Tech Solutions, Peshawar 
              </p> 
            </div> 
            <ul class="mt-2 list-disc list-outside pl-5 space-y-1.5 text-sm text-slate-700"> 
              <li> 
                Developed comprehensive web applications using 
                <span class="font-semibold">React, Next.js, Node.js, and PostgreSQL</span>. 
              </li> 
              <li> 
                Implemented responsive, mobile-first designs and improved overall site performance 
                by approximately <span class="font-semibold">30%</span>. 
              </li> 
              <li> 
                Collaborated with cross-functional teams (design, QA, product) to deliver 
                high-quality features on schedule. 
              </li> 
              <li> 
                Integrated RESTful APIs and optimized database queries for better scalability and 
                reliability. 
              </li> 
            </ul> 
          </div> 

          <!-- Job 2 --> 
          <div class="mt-4 space-y-1"> 
            <div class="flex flex-wrap items-baseline justify-between gap-2"> 
              <h3 class="text-base font-semibold text-slate-900"> 
                Frontend Developer 
              </h3> 
              <span class="text-xs font-medium text-slate-500"> 
                Jun 2022 - Dec 2023 
              </span> 
            </div> 
            <div class="flex flex-wrap items-center justify-between gap-2"> 
              <p class="text-sm font-medium text-indigo-700"> 
                Web Creators, Peshawar 
              </p> 
            </div> 
            <ul class="mt-2 list-disc list-outside pl-5 space-y-1.5 text-sm text-slate-700"> 
              <li> 
                Built interactive, component-based user interfaces using 
                <span class="font-semibold">React</span> and 
                <span class="font-semibold">Tailwind CSS</span>. 
              </li> 
              <li> 
                Worked with <span class="font-semibold">REST APIs</span> and managed application 
                state using <span class="font-semibold">Redux</span> and 
                <span class="font-semibold">Context API</span>. 
              </li> 
              <li> 
                Enhanced user experience through performance optimization and modern design 
                patterns. 
              </li> 
              <li> 
                Collaborated closely with designers to translate Figma/wireframes into pixel-perfect 
                UIs. 
              </li> 
            </ul> 
          </div> 
        </div> 

        <!-- Education --> 
        <div> 
          <h2 class="text-sm font-bold tracking-[0.2em] text-slate-500 uppercase flex items-center gap-2"> 
            <i class="fa-solid fa-graduation-cap text-indigo-600"></i> 
            Education 
          </h2> 
          <div class="mt-3"> 
            <h3 class="text-base font-semibold text-slate-900"> 
              Bachelor of Computer Science 
            </h3> 
            <p class="text-sm font-medium text-indigo-700"> 
              University of Peshawar 
            </p> 
            <p class="text-xs text-slate-500 mt-1"> 
              Graduation Year: 2023 (example) 
            </p> 
          </div> 
        </div> 
      </section> 

      <!-- Right Column --> 
      <aside class="space-y-6"> 
        <!-- Technical Skills --> 
        <div> 
          <h2 class="text-sm font-bold tracking-[0.2em] text-slate-500 uppercase flex items-center gap-2"> 
            <i class="fa-solid fa-code text-indigo-600"></i> 
            Technical Skills 
          </h2> 
          <div class="mt-3 space-y-3 text-sm text-slate-800"> 
            <div> 
              <p class="font-semibold text-slate-900">Frontend</p> 
              <p class="mt-1"> 
                React, Next.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS 
              </p> 
            </div> 
            <div> 
              <p class="font-semibold text-slate-900">Backend</p> 
              <p class="mt-1"> 
                Node.js, Express 
              </p> 
            </div> 
            <div> 
              <p class="font-semibold text-slate-900">Database</p> 
              <p class="mt-1"> 
                PostgreSQL 
              </p> 
            </div> 
            <div> 
              <p class="font-semibold text-slate-900">Tools &amp; Others</p> 
              <p class="mt-1"> 
                Git, GitHub, REST APIs, npm/yarn, VS Code 
              </p> 
            </div> 
          </div> 
        </div> 

        <!-- Projects --> 
        <div> 
          <h2 class="text-sm font-bold tracking-[0.2em] text-slate-500 uppercase flex items-center gap-2"> 
            <i class="fa-solid fa-diagram-project text-indigo-600"></i> 
            Projects 
          </h2> 
          <div class="mt-3 space-y-3 text-sm text-slate-800"> 
            <div> 
              <p class="font-semibold text-slate-900"> 
                Full Stack Web Application 
              </p> 
              <p class="mt-1"> 
                Built a full stack app using React, Next.js, Node.js, and PostgreSQL with 
                authentication, CRUD operations, and responsive UI. 
              </p> 
            </div> 
            <div> 
              <p class="font-semibold text-slate-900"> 
                Responsive Dashboard UI 
              </p> 
              <p class="mt-1"> 
                Created a modern admin dashboard using React and Tailwind CSS with charts, tables, 
                and dark/light-ready design. 
              </p> 
            </div> 
          </div> 
        </div> 

        <!-- Soft Skills --> 
        <div> 
          <h2 class="text-sm font-bold tracking-[0.2em] text-slate-500 uppercase flex items-center gap-2"> 
            <i class="fa-solid fa-people-group text-indigo-600"></i> 
            Soft Skills 
          </h2> 
          <ul class="mt-3 list-disc list-outside pl-5 space-y-1.5 text-sm text-slate-800"> 
            <li>Team collaboration &amp; communication</li> 
            <li>Problem-solving &amp; debugging</li> 
            <li>Time management &amp; ownership</li> 
            <li>Adaptability to new technologies</li> 
          </ul> 
        </div> 

        <!-- Languages --> 
        <div> 
          <h2 class="text-sm font-bold tracking-[0.2em] text-slate-500 uppercase flex items-center gap-2"> 
            <i class="fa-solid fa-language text-indigo-600"></i> 
            Languages 
          </h2> 
          <ul class="mt-3 list-disc list-outside pl-5 space-y-1.5 text-sm text-slate-800"> 
            <li>English</li> 
            <li>Urdu</li> 
            <li>Pashto</li> 
          </ul> 
        </div> 
      </aside> 
    </main> 
  </div> 
</body> 
</html>`;
