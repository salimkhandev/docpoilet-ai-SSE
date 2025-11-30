// Simple HTML to DOCX Converter
// Install: npm install html-to-docx fs

const fs = require("fs");
const htmlToDocx = require("html-to-docx");


const html = fs.readFileSync("resume.html", "utf-8");



(async () => {
  try {
    const buffer = await htmlToDocx(html);
    fs.writeFileSync("SalimKhan_Resume.docx", buffer);
    console.log("✅ Editable Word document created: SalimKhan_Resume.docx");
  } catch (err) {
    console.error("❌ Conversion failed:", err);
  }
})();




