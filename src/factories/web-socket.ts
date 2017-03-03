import { IWebSocketFactoryOptions } from '../interfaces';

export class WebSocketFactory {

    public create ({ url }: IWebSocketFactoryOptions) {
        return new WebSocket(url);
    }

}
