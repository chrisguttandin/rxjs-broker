export class WebSocketFactory {

    create ({ url }) {
        return new WebSocket(url);
    }

}
