export class WebSocketFactory {

    create ({ url }) { // eslint-disable-line class-methods-use-this
        return new WebSocket(url);
    }

}
