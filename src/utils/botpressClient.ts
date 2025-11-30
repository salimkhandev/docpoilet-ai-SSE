// import { Client } from "@botpress/client";

// // Configuration
// const BOTPRESS_TOKEN =
//   process.env.USER_KEY ||
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNhbGltIiwiaWF0IjoxNzYwNzc3MDk3fQ.j1e_thMHh7R32phLU06EQMnswVRhMobFuVKSq0QXZs4";
// const WORKSPACE_ID = process.env.WORKSPACE_ID || "";
// const BOT_ID = process.env.BOT_ID || "";

// // Initialize the Botpress client
// export const botpressClient = new Client({
//   token: BOTPRESS_TOKEN,
//   workspaceId: WORKSPACE_ID,
//   botId: BOT_ID,
// });

// // Function to get all messages for a conversation using .collect()
// export async function getAllMessages(conversationId: string = "salims") {
//   try {
//     // Use list.messages().collect() to fetch up to 1000 messages automatically
//     const messages = await botpressClient.list
//       .messages({ conversationId: conversationId })
//       .collect({ limit: 1000 });

    
    
//     (`✅ Fetched ${messages.length} messages using .collect()`);

//     return {
//       success: true,
//       data: {
//         messages: messages,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching messages with Botpress client:", error);
//     return {
//       success: false,
//       error: "Failed to fetch messages",
//       data: {
//         messages: [],
//       },
//     };
//   }
// }

// // Function to send a message using Botpress client
// export async function sendMessageToBotpress(
//   text: string,
//   conversationId: string = "salim",
// ) {
//   try {
//     const result = await botpressClient.createMessage({
//       conversationId: conversationId,
//       userId: "salim",
//       type: "text",
//       payload: {
//         text: text,
//       },
//       tags: {},
//     });

//     console.log("✅ Message sent successfully");

//     // Extract the AI response text from the result
//     const aiResponseText = result.message?.payload?.text || null;

//     return {
//       success: true,
//       text: aiResponseText,
//       message: result.message,
//     };
//   } catch (error) {
//     console.error("Error sending message with Botpress client:", error);
//     return {
//       success: false,
//       error: "Failed to send message",
//       text: null,
//     };
//   }
// }

// // Function to get all conversations using .collect()
// export async function getAllConversations(limit: number = 1000) {
//   try {
//     const conversations = await botpressClient.list
//       .conversations({})
//       .collect({ limit: limit });

//     console.log(`✅ Fetched ${conversations.length} conversations`);

//     return {
//       success: true,
//       conversations: conversations,
//     };
//   } catch (error) {
//     console.error("Error fetching conversations:", error);
//     return {
//       success: false,
//       error: "Failed to fetch conversations",
//       conversations: [],
//     };
//   }
// }

// // Function to iterate through messages using async generator
// export async function* iterateMessages(conversationId: string) {
//   try {
//     for await (const message of botpressClient.list.messages({
//       conversationId,
//     })) {
//       yield message;
//     }
//   } catch (error) {
//     console.error("Error iterating messages:", error);
//     throw error;
//   }
// }
