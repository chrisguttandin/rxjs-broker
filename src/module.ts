import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core';
import {
    DataChannelObservableFactory,
    DataChannelObserverFactory,
    DataChannelSubjectFactory,
    MaskedDataChannelSubjectFactory,
    MaskedWebSocketSubjectFactory,
    WebSocketFactory,
    WebSocketObservableFactory,
    WebSocketObserverFactory,
    WebSocketSubjectFactory
} from './factories';
import { IDataChannel } from './interfaces';

const injector = ReflectiveInjector.resolveAndCreate([
    DataChannelObservableFactory,
    DataChannelObserverFactory,
    DataChannelSubjectFactory,
    MaskedDataChannelSubjectFactory,
    MaskedWebSocketSubjectFactory,
    WebSocketFactory,
    WebSocketObservableFactory,
    WebSocketObserverFactory,
    WebSocketSubjectFactory
]);

const dataChannelSubjectFactory = injector.get(DataChannelSubjectFactory);
const webSocketFactory = injector.get(WebSocketFactory);
const webSocketSubjectFactory = injector.get(WebSocketSubjectFactory);

export const connect = (url: string) => {
    const webSocket = webSocketFactory.create({ url });

    return webSocketSubjectFactory.create({ webSocket });
};

/**
 * This property is true if the browser supports WebSockets.
 */
export const isSupported = (typeof window !== undefined && 'WebSocket' in window);

export const wrap = (dataChannel: IDataChannel) => dataChannelSubjectFactory.create({ dataChannel });
