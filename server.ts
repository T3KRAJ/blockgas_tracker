import BaseChainListener from "./services/BaseChainListener";
import logger from "./utils/logger";
import { serverPort } from "./config";

const clientSubscriptions = new Map(); // ws => Map(chainId => listener)

const server = Bun.serve({
  port: serverPort,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("WebSocket server is running");
  },
  websocket: {
    open(ws) {
      logger.info("Client connected");
      ws.send("Client connected");
      clientSubscriptions.set(ws, new Map());
    },
    message(ws, message: string) {
      try {
        const data = JSON.parse(message);
        if (!data.action || !data.chainId) {
          ws.send(JSON.stringify({ error: "Missing action or chainId in message" }));
          return;
        }
        const subs = clientSubscriptions.get(ws);
        if (!subs) {
          ws.send(JSON.stringify({ error: "Client not initialized" }));
          return;
        }
        if (data.action === "subscribe") {
          if (subs.has(data.chainId)) {
            ws.send(JSON.stringify({ error: `Already subscribed to chainId ${data.chainId}` }));
            return;
          }
          const listener = new BaseChainListener(data.chainId, ws);
          listener.startListener();
          subs.set(data.chainId, listener);
          ws.send(JSON.stringify({ success: `Subscribed to chainId ${data.chainId}` }));
        } else if (data.action === "unsubscribe") {
          if (!subs.has(data.chainId)) {
            ws.send(JSON.stringify({ error: `Not subscribed to chainId ${data.chainId}` }));
            return;
          }
          const listener = subs.get(data.chainId);
          if (listener && typeof listener.stopListener === "function") {
            listener.stopListener();
          }
          subs.delete(data.chainId);
          ws.send(JSON.stringify({ success: `Unsubscribed from chainId ${data.chainId}` }));
        } else {
          ws.send(JSON.stringify({ error: "Unknown action" }));
        }
      } catch (err: Error | any) {
        ws.send(JSON.stringify({ error: err.message }));
      }
    },
    close(ws) {
      logger.info("Client disconnected");
      // Clean up all listeners for this client
      const subs = clientSubscriptions.get(ws);
      if (subs) {
        for (const listener of subs.values()) {
          if (listener && typeof listener.stopListener === "function") {
            listener.stopListener();
          }
        }
        clientSubscriptions.delete(ws);
      }
    },
  },
});

console.log(`🚀 Server running on ws://localhost:${server.port}`);