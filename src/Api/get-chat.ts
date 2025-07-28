interface WSResponseChunk {
  result?: {
    response?: string;
    message_id?: number;
    token_cost?: number;
    token_count?: number;
    conversation_id?: string;
    metadata?: {
      model_name?: string;
      persona?: string;
    };
  };
}

interface Message {
  id: number;
  source: "User" | "AI" | string;
  message: string;
}

interface FormattedMessage {
  user?: string;
  assistant?: string;
}

const formatMessagesForPayload = (messages: Message[]): FormattedMessage[] => {
  const latestMessages = messages.slice(-10);
  return latestMessages
    .map((msg) => {
      if (msg.source === "User") {
        return { user: msg.message };
      } else if (msg.source === "AI") {
        return { assistant: msg.message };
      }
      return null;
    })
    .filter((msg): msg is NonNullable<typeof msg> => msg !== null);
};

let convID = "";

const messages: Message[] = [];

const WEBSOCKET_BASE =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL ||
  "wss://ecoapilwebapp02-ash2f8e6fcgzexgq.centralindia-01.azurewebsites.net";

const RESPONSE_REGEX = /<Response>:\s*(.*)$/;

function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function buildWebSocketUrl(conversationId: string, token: string): string {
  return `${WEBSOCKET_BASE}/api/v2/ws/${conversationId}?token=${token}`;
}

const sendMessage = async (
  message: string
  // sessionId: string | null
): Promise<string> => {
  try {
    const userDetails = {
      access_token:
        localStorage.getItem("access_token") ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTM2ODI5MzksInN1YiI6Inlhc2h2YXNoaXNodGhhIn0.2FZFJEzXRI2ZSy7MDXYJQb_sz7t9-KizglLCtSGSN5U",
    };

    const token = `Bearer ${userDetails.access_token}`;
    if (!userDetails.access_token) {
      throw new Error("Missing token or session ID");
    }

    messages.push({
      id: messages.length + 1,
      source: "User",
      message: message,
    });

    const formattedMessages = formatMessagesForPayload(messages);

    // 1. Format the payload
    const payload = {
      metadata: {
        persona: "general",
        model_name: "GPT-4o",
        streaming: true,
        assistant_type: "knowledge_Based",
        temperature: 0,
        k: 3,
      },
      message_text: message,
      messages: formattedMessages,
      app_id: "534dcbe8694011f0a2026a872321dae9", // optional
      ...(convID !== "" && { conversation_id: convID }),
    };

    // 2. Open WebSocket
    const socketUrl = buildWebSocketUrl(convID == "" ? "new" : convID, token);
    const ws = new WebSocket(socketUrl);

    return await new Promise((resolve, reject) => {
      // let responseText = "";

      ws.onopen = () => {
        console.log("WebSocket connected");
        ws.send(JSON.stringify(payload));
      };

      ws.onmessage = (event) => {
        try {
          console.log(
            "WebSocket message received:",
            event.data.match(RESPONSE_REGEX)
          );
          const chunk = JSON.parse(event.data);
          const match = chunk.match(RESPONSE_REGEX);

          if (match) {
            const parsed: WSResponseChunk = safeJsonParse(match[1].trim(), {});
            const result = parsed?.result;

            console.log("Parsed result:", result);

            if (convID == "" && result?.conversation_id) {
              convID = result.conversation_id;
              console.log("New conversation ID:", convID);
            }

            if (result?.response) {
              // responseText += result.response;

              messages.push({
                id: messages.length + 1,
                source: "AI",
                message: result.response,
              });
              resolve(result.response);
              ws.close();
            }
          }
        } catch (e) {
          console.error("Failed to process chunk", e);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error", err);
        ws.close();
        reject("WebSocket error");
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
      };
    });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return "Oops, something went wrong.";
  }
};

export default sendMessage;
