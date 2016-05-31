import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { WebSocketBrokerFactory } from './web-socket-broker-factory';
import { WebSocketFactory } from './web-socket-factory';
import { WebSocketSubjectFactory } from './web-socket-subject-factory';

/* eslint-disable indent */
const injector = ReflectiveInjector.resolveAndCreate([
          WebSocketBrokerFactory,
          WebSocketFactory,
          WebSocketSubjectFactory,
      ]);
/* eslint-enable indent */

const webSocketBrokerFactory = injector.get(WebSocketBrokerFactory);

export const connect = (url) => webSocketBrokerFactory.create({ url });
