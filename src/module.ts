import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { Injector } from '@angular/core'; // tslint:disable-line:ordered-imports
import { DATA_CHANNEL_OBSERVABLE_FACTORY_PROVIDER } from './factories/data-channel-observable';
import { DATA_CHANNEL_OBSERVER_FACTORY_PROVIDER } from './factories/data-channel-observer';
import { DATA_CHANNEL_SUBJECT_FACTORY_PROVIDER, DataChannelSubjectFactory } from './factories/data-channel-subject';
import { MASKED_DATA_CHANNEL_SUBJECT_FACTORY_PROVIDER } from './factories/masked-data-channel-subject';
import { MASKED_WEB_SOCKET_SUBJECT_FACTORY_PROVIDER } from './factories/masked-web-socket-subject';
import { WEB_SOCKET_FACTORY_PROVIDER, WebSocketFactory } from './factories/web-socket';
import { WEB_SOCKET_OBSERVABLE_FACTORY_PROVIDER } from './factories/web-socket-observable';
import { WEB_SOCKET_OBSERVER_FACTORY_PROVIDER } from './factories/web-socket-observer';
import { WEB_SOCKET_SUBJECT_FACTORY_PROVIDER, WebSocketSubjectFactory } from './factories/web-socket-subject';
import { IDataChannel, IMaskableSubject } from './interfaces';
import { TStringifyableJsonValue } from './types';

export * from './interfaces';
export * from './types';

const injector = Injector.create([
    DATA_CHANNEL_OBSERVABLE_FACTORY_PROVIDER,
    DATA_CHANNEL_OBSERVER_FACTORY_PROVIDER,
    DATA_CHANNEL_SUBJECT_FACTORY_PROVIDER,
    MASKED_DATA_CHANNEL_SUBJECT_FACTORY_PROVIDER,
    MASKED_WEB_SOCKET_SUBJECT_FACTORY_PROVIDER,
    WEB_SOCKET_FACTORY_PROVIDER,
    WEB_SOCKET_OBSERVABLE_FACTORY_PROVIDER,
    WEB_SOCKET_OBSERVER_FACTORY_PROVIDER,
    WEB_SOCKET_SUBJECT_FACTORY_PROVIDER
]);

const dataChannelSubjectFactory = injector.get(DataChannelSubjectFactory);
const webSocketFactory = injector.get(WebSocketFactory);
const webSocketSubjectFactory = injector.get(WebSocketSubjectFactory);

export const connect = (url: string): IMaskableSubject<TStringifyableJsonValue> => {
    const webSocket = webSocketFactory.create({ url });

    return webSocketSubjectFactory.create({ webSocket });
};

/**
 * This property is true if the browser supports WebSockets.
 */
export const isSupported = (typeof window !== 'undefined' && 'WebSocket' in window);

export const wrap = (dataChannel: IDataChannel): IMaskableSubject<TStringifyableJsonValue> => {
    return dataChannelSubjectFactory.create({ dataChannel });
};
