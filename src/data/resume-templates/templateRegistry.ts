// Central registry for all resume templates used by the editor.
// Add new entries here to make them appear in the template gallery.

import { resumeTemplate1Full } from "./resumeTemplate1";
import { resumeTemplate2Full } from "./resumeTemplate2";
import { ATSresumeTemplateFull } from "./ATSresumeTemplate";

export type TemplateDefinition = {
  id: string;
  title: string;
  description?: string;
  html: string;
};

export const templates: TemplateDefinition[] = [
  {
    id: "resume-1",
    title: "Resume Template 1",
    description: "Dark, modern resume with neon accents.",
    html: resumeTemplate1Full,
  },
  {
    id: "resume-2",
    title: "Resume Template 2",
    description: "Clean, white resume layout with two columns.",
    html: resumeTemplate2Full,
  },
  {
    id: "ats-resume",
    title: "ATS Resume Template",
    description: "ATS friendly resume template.",
    html: ATSresumeTemplateFull,
  },
];

