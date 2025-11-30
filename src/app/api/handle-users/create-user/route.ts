// import { NextRequest, NextResponse } from "next/server";

// const BASE_URL =
//   "https://chat.botpress.cloud/9ebfc64f-547d-4f33-90ca-5ad5bf917473";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { name, pictureUrl, profile, id, userKey } = body;

//     if (!name || !id) {
//       return NextResponse.json(
//         { error: "Name and id are required" },
//         { status: 400 }
//       );
//     }

//     const authKey = userKey || USER_KEY;

//     const url = `${BASE_URL}/users`;
//     const options = {
//       method: "POST",
//       headers: {
//         "x-user-key": authKey,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         name,
//         pictureUrl: pictureUrl || "",
//         profile: profile || "",
//         id,
//       }),
//     };

//     const response = await fetch(url, options);
//     const data = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: "Failed to create user" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to create user" },
//       { status: 500 }
//     );
//   }
// }
