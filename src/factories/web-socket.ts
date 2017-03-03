import { Injectable } from '@angular/core';
import { IWebSocketFactoryOptions } from '../interfaces';

@Injectable()
export class WebSocketFactory {

    public create ({ url }: IWebSocketFactoryOptions) {
        return new WebSocket(url);
    }

}
