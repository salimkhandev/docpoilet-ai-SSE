// import { NextRequest, NextResponse } from "next/server";

// // Configuration
// const BASE_URL =
//   "https://chat.botpress.cloud/9ebfc64f-547d-4f33-90ca-5ad5bf917473";
// const USER_KEY =
//   process.env.USER_KEY ||
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNhbGltIiwiaWF0IjoxNzYwNzc3MDk3fQ.j1e_thMHh7R32phLU06EQMnswVRhMobFuVKSq0QXZs4";
// // const DEFAULT_CONVERSATION_ID = "salim";

// // Helper function to generate ETag from data

// // POST: Send message to Botpress and get AI response
// export async function POST(request: NextRequest) {
//   try {
//     const { message, conversationId } = await request.json();

//     if (!message) {
//       return NextResponse.json(
//         { error: "Message is required" },
//         { status: 400 },
//       );
//     }

//     const cid = conversationId || "salim";

//     // Send message to Botpress
//     const url = `${BASE_URL}/messages`;
//     const options = {
//       method: "POST",
//       headers: {
//         "x-user-key": USER_KEY,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         payload: {
//           type: "text",
//           text: message,
//         },
//         conversationId: cid,
//       }),
//     };

//     const response = await fetch(url, options);
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error("Failed to send message to Botpress");
//     }

//     // Parse AI response - return simple text
//     // console.log('data',data)
//     const aiResponse = data.message.payload?.text || null;
//     console.log(
//       "aiResponse to client from botpress ie the same message to the client again",
//       aiResponse,
//     );
//     return NextResponse.json({
//       success: true,
//       text: aiResponse,
//     });
//   } catch (error) {
//     console.error("Error in ai-chat:", error);
//     return NextResponse.json(
//       { error: "Failed to send message" },
//       { status: 500 },
//     );
//   }
// }

// // GET: Get messages from Botpress
// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const conversationId = searchParams.get("conversationId");
//     const cid = conversationId || "salim";

//     const url = `${BASE_URL}/conversations/${cid}/messages`;
//     const options = {
//       method: "GET",
//       headers: {
//         "x-user-key": USER_KEY,
//       },
//     };

//     const response = await fetch(url, options);
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error("Failed to fetch messages");
//     }

//     return NextResponse.json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch messages" },
//       { status: 500 },
//     );
//   }
// }