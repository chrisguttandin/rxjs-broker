import { WebSocketSubject } from '../classes/web-socket-subject';
import { TWebSocketSubjectFactoryFactory } from '../types';

export const createWebSocketSubjectFactory: TWebSocketSubjectFactoryFactory = (
    createDataChannelObservable,
    createDataChannelObserver,
    createMaskedWebSocketSubject
) => (webSocket) => {
    return new WebSocketSubject(createDataChannelObservable, createDataChannelObserver, createMaskedWebSocketSubject, webSocket);
};
