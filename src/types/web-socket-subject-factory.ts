import { WebSocketSubject } from '../classes/web-socket-subject';

export type TWebSocketSubjectFactory = (dataChannel: WebSocket) => WebSocketSubject;
