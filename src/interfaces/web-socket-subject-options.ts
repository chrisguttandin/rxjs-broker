import { MaskedWebSocketSubjectFactory } from '../factories/masked-web-socket-subject';
import { WebSocketObservableFactory } from '../factories/web-socket-observable';
import { WebSocketObserverFactory } from '../factories/web-socket-observer';
import { IWebSocketSubjectFactoryOptions } from './web-socket-subject-factory-options';

export interface IWebSocketSubjectOptions extends IWebSocketSubjectFactoryOptions {

    maskedWebSocketSubjectFactory: MaskedWebSocketSubjectFactory;

    webSocketObservableFactory: WebSocketObservableFactory;

    webSocketObserverFactory: WebSocketObserverFactory;

}
