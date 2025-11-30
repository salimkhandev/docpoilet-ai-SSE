import { getUserKeyFromCookie } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = `https://chat.botpress.cloud/${process.env.BOT_ID}`;

// Parse multiple concatenated JSON objects
function parseJSONObjects(bufferContent: string): any[] {
    const objects: any[] = [];
    let pos = 0;
    
    while (pos < bufferContent.length) {
        while (pos < bufferContent.length && /\s/.test(bufferContent[pos])) {
            pos++;
        }
        if (pos >= bufferContent.length) break;
        
        if (bufferContent[pos] === '{') {
            let braceCount = 0;
            const start = pos;
            
            for (let i = pos; i < bufferContent.length; i++) {
                if (bufferContent[i] === '{') braceCount++;
                if (bufferContent[i] === '}') braceCount--;
                if (braceCount === 0) {
                    try {
                        objects.push(JSON.parse(bufferContent.substring(start, i + 1)));
                        pos = i + 1;
                        break;
                    } catch (e) {
                        pos = i + 1;
                        break;
                    }
                }
            }
        } else {
            break;
        }
    }
    
    return objects;
}

export async function GET(request: NextRequest) {
    try {
        const userKey = await getUserKeyFromCookie();
        
        if (!userKey) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const conversationId = searchParams.get('conversationId');

        if (!conversationId) {
            return NextResponse.json(
                { error: "Conversation ID is required" },
                { status: 400 }
            );
        }

        if (!process.env.BOT_ID) {
            return NextResponse.json(
                { error: "Bot ID not configured" },
                { status: 500 }
            );
        }

        // Stream events from Botpress and forward to client
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                let streamClosed = false;
                const sendEvent = (event: string, data: any) => {
                    if (streamClosed) return;
                    try {
                        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
                    } catch (error: any) {
                        streamClosed = true;
                        const isInvalidState = error?.code === 'ERR_INVALID_STATE';
                        if (!isInvalidState) {
                            console.error('[Listen] Error sending event:', error);
                        }
                    }
                };

                try {
                    const response = await fetch(`${BASE_URL}/conversations/${conversationId}/listen`, {
                        headers: { 'x-user-key': userKey },
                    });

                    if (!response.ok) {
                        console.error('[Listen] HTTP Error:', response.status, response.statusText);
                        streamClosed = true;
                        sendEvent('error', {});
                        controller.close();
                        return;
                    }

                    console.log(`[Listen] Connected to conversation: ${conversationId}`);
                    sendEvent('connected', {});

                    const reader = response.body?.getReader();
                    if (!reader) {
                        controller.close();
                        return;
                    }

                    const decoder = new TextDecoder();
                    let buffer = '';

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\n');
                        buffer = lines.pop() || '';

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const dataContent = line.slice(6).trim();
                                
                                if (dataContent && dataContent !== 'ping') {
                                    try {
                                        const data = JSON.parse(dataContent);
                                        sendEvent('message', {
                                            type: data.type,
                                            data: data.data
                                        });
                                    } catch (err) {
                                        const jsonObjects = parseJSONObjects(dataContent);
                                        jsonObjects.forEach((data) => {
                                            sendEvent('message', {
                                                type: data.type,
                                                data: data.data
                                            });
                                        });
                                    }
                                }
                            }
                        }
                    }

                    console.log('[Listen] Stream ended');
                    if (!streamClosed) {
                        sendEvent('disconnected', {});
                        streamClosed = true;
                        controller.close();
                    }
                } catch (error) {
                    console.error('[Listen] Error:', error);
                    if (!streamClosed) {
                        sendEvent('error', {});
                        streamClosed = true;
                        controller.close();
                    }
                }
            },
        });

        console.log('Stream created', stream);

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}
