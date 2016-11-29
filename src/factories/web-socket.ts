import { Injectable } from '@angular/core';

@Injectable()
export class WebSocketFactory {

    public create ({ url }) {
        return new WebSocket(url);
    }

}
