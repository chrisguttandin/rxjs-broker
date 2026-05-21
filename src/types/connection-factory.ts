export type ConnectionFactory = (() => RTCDataChannel) | (() => WebSocket);
