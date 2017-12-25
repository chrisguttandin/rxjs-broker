import { IWebSocketFactoryOptions } from '../interfaces';

export class WebSocketFactory {

    public create ({ url }: IWebSocketFactoryOptions) {
        return new WebSocket(url);
    }

}

export const WEB_SOCKET_FACTORY_PROVIDER = { deps: [ ], provide: WebSocketFactory };
