// import { NextRequest, NextResponse } from "next/server";

// // Configuration
// const BASE_URL =
//   "https://chat.botpress.cloud/9ebfc64f-547d-4f33-90ca-5ad5bf917473";
// const USER_KEY =
//   process.env.USER_KEY ||
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNhbGltIiwiaWF0IjoxNzYwNzc3MDk3fQ.j1e_thMHh7R32phLU06EQMnswVRhMobFuVKSq0QXZs4";

// // GET: List all conversations
// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const limit = searchParams.get("limit") || "50";
//     const offset = searchParams.get("offset") || "0";

//     const url = `${BASE_URL}/conversations?limit=${limit}&offset=${offset}`;
//     const options = {
//       method: "GET",
//       headers: {
//         "x-user-key": USER_KEY,
//       },
//     };

//     const response = await fetch(url, options);
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error("Failed to list conversations");
//     }

//     return NextResponse.json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     console.error("Error listing conversations:", error);
//     return NextResponse.json(
//       { error: "Failed to list conversations" },
//       { status: 500 },
//     );
//   }
// }

// // POST: Create a new conversation
// export async function POST(request: NextRequest) {
//   try {
//     let body;
//     try {
//       body = await request.json();
//     } catch (parseError) {
//       return NextResponse.json(
//         { error: "Invalid JSON in request body" },
//         { status: 400 },
//       );
//     }

//     const { id } = body;

//     if (!id) {
//       return NextResponse.json(
//         { error: "Conversation id is required" },
//         { status: 400 },
//       );
//     }

//     const url = `${BASE_URL}/conversations`;
//     const options = {
//       method: "POST",
//       headers: {
//         "x-user-key": USER_KEY,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         id,
//       }),
//     };

//     const response = await fetch(url, options);

//     // Handle empty response or non-JSON response
//     const contentType = response.headers.get("content-type");
//     let data = null;
//     let errorText = "";

//     // Read response body once
//     const text = await response.text().catch(() => "");

//     if (!response.ok) {
//       errorText = text;
//       console.error("Botpress API error:", response.status, errorText);
//     } else if (contentType && contentType.includes("application/json")) {
//       if (text && text.trim()) {
//         try {
//           data = JSON.parse(text);
//         } catch (parseError) {
//           console.error("Failed to parse Botpress response:", parseError);
//           // If parsing fails but response was ok, continue with null data
//         }
//       }
//     }

//     if (!response.ok) {
//       throw new Error(
//         `Failed to create conversation in Botpress: ${response.status} ${errorText || ""}`,
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     console.error("Error creating conversation:", error);
//     return NextResponse.json(
//       { error: "Failed to create conversation" },
//       { status: 500 },
//     );
//   }
// }

