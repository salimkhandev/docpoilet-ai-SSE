"use client"
import { useEffect, useRef } from "react";
import { useAIState } from "../../contexts/AIStateContext";

const Documents = () => {
  const { state } = useAIState();
  const iframeRef = useRef(null);

  const defaultHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mountain Scene - Tailwind CSS</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet">
</head>
<body class="bg-gradient-to-b from-blue-200 to-blue-500 min-h-screen flex items-center justify-center">
  <div class="flex flex-col items-center">
    <h1 class="text-3xl font-bold mb-4 flex items-center gap-2" style="font-family: 'Montserrat', sans-serif;">
      <span>🏔️</span> Mountain Scene Example
    </h1>
    <div class="relative w-[400px] h-[250px]">
      <svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="400" height="250" fill="url(#skyGradient)" />
        <defs>
          <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="250" gradientUnits="userSpaceOnUse">
            <stop stop-color="#BEE3F8"/>
            <stop offset="1" stop-color="#63B3ED"/>
          </linearGradient>
        </defs>
        <circle cx="320" cy="60" r="30" fill="#FFD700" opacity="0.8"/>
        <polygon points="70,220 200,50 330,220" fill="#4A5568"/>
        <polygon points="200,50 230,110 200,90 170,110" fill="#EDF2F7"/>
        <polygon points="120,220 200,120 280,220" fill="#718096"/>
        <rect x="90" y="200" width="8" height="20" fill="#2F855A"/>
        <rect x="302" y="200" width="8" height="20" fill="#2F855A"/>
        <polygon points="94,200 98,190 102,200" fill="#38A169"/>
        <polygon points="306,200 310,190 314,200" fill="#38A169"/>
        <rect y="220" width="400" height="30" fill="#68D391"/>
      </svg>
    </div>
    <p class="mt-4 text-gray-700 max-w-xl text-center">
      <strong>Explanation:</strong> This scene uses SVG to draw a stylized mountain landscape with a sun, snow cap, and trees.
    </p>
  </div>
</body>
</html>
`;

  const htmlContent = state.htmlContent || defaultHtml;

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
    }
  }, [htmlContent]);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100 p-2">
      <iframe
        ref={iframeRef}
        title="HTML Preview"
        className="w-full h-full border-0 rounded-lg shadow-md"
      />
    </div>
  );
};

export default Documents;
