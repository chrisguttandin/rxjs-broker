import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core';
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
import { IDataChannel, IStringifyableJsonObject, IMaskableSubject } from './interfaces';
import { TParsedJsonValue, TStringifyableJsonValue } from './types';

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

export const connect = (url: string): IMaskableSubject<IStringifyableJsonObject> => {
    const webSocket = webSocketFactory.create({ url });

    return webSocketSubjectFactory.create({ webSocket });
};

export { IDataChannel, IStringifyableJsonObject, IMaskableSubject };

/**
 * This property is true if the browser supports WebSockets.
 */
export const isSupported = (typeof window !== undefined && 'WebSocket' in window);

export { TParsedJsonValue, TStringifyableJsonValue };

export const wrap = (dataChannel: IDataChannel): IMaskableSubject<IStringifyableJsonObject> => dataChannelSubjectFactory.create({ dataChannel });
