import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { WebSocketFactory } from './web-socket-factory';
import { WebSocketObservableFactory } from './web-socket-observable-factory';
import { WebSocketObserverFactory } from './web-socket-observer-factory';
import { WebSocketSubjectFactory } from './web-socket-subject-factory';

/* eslint-disable indent */
const injector = ReflectiveInjector.resolveAndCreate([
          WebSocketFactory,
          WebSocketObservableFactory,
          WebSocketObserverFactory,
          WebSocketSubjectFactory,
      ]);
/* eslint-enable indent */

const webSocketFactory = injector.get(WebSocketFactory);
const webSocketSubjectFactory = injector.get(WebSocketSubjectFactory);

export const connect = (url) => {
    const webSocket = webSocketFactory.create({ url });

    return webSocketSubjectFactory.create({ webSocket });
};
