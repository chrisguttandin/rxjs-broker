import { WebSocketObservable } from '../classes/web-socket-observable';
import { IWebSocketObservableFactoryOptions } from '../interfaces';

export class WebSocketObservableFactory {

    public create<T> ({ webSocket }: IWebSocketObservableFactoryOptions) {
        return new WebSocketObservable<T>({ webSocket });
    }

}

export const WEB_SOCKET_OBSERVABLE_FACTORY_PROVIDER = { deps: [ ], provide: WebSocketObservableFactory };
