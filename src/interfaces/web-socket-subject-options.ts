import { MaskedWebSocketSubjectFactory, WebSocketObservableFactory, WebSocketObserverFactory } from '../factories';
import { IWebSocketSubjectFactoryOptions } from './web-socket-subject-factory-options';

export interface IWebSocketSubjectOptions extends IWebSocketSubjectFactoryOptions {

    maskedWebSocketSubjectFactory: MaskedWebSocketSubjectFactory;

    webSocketObservableFactory: WebSocketObservableFactory;

    webSocketObserverFactory: WebSocketObserverFactory;

}
