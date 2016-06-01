export class WebSocketFactory {

    create ({ url }) {
        return new WebSocket(url); // eslint-disable-line no-undef
    }

}
