import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { DataChannelObservableFactory } from './factories/data-channel-observable';
import { DataChannelObserverFactory } from './factories/data-channel-observer';
import { DataChannelSubjectFactory } from './factories/data-channel-subject';
import { MaskedDataChannelSubjectFactory } from './factories/masked-data-channel-subject';
import { MaskedWebSocketSubjectFactory } from './factories/masked-web-socket-subject';
import { WebSocketFactory } from './factories/web-socket';
import { WebSocketObservableFactory } from './factories/web-socket-observable';
import { WebSocketObserverFactory } from './factories/web-socket-observer';
import { WebSocketSubjectFactory } from './factories/web-socket-subject';
import { ReflectiveInjector } from '@angular/core';

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

export const connect = (url) => {
    const webSocket = webSocketFactory.create({ url });

    return webSocketSubjectFactory.create({ webSocket });
};

export const wrap = (dataChannel) => dataChannelSubjectFactory.create({ dataChannel });
