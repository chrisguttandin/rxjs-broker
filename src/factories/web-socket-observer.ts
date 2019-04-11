import { WebSocketObserver } from '../classes/web-socket-observer';
import { IWebSocketObserverFactoryOptions } from '../interfaces';

export class WebSocketObserverFactory {

    public create<T> ({ webSocket }: IWebSocketObserverFactoryOptions) {
        return new WebSocketObserver<T>({ webSocket });
    }

}

export const WEB_SOCKET_OBSERVER_FACTORY_PROVIDER = { deps: [ ], provide: WebSocketObserverFactory };
