export class WebSocketFactory {

    create ({ url }) {
        return new Promise((resolve, reject) => {
            var webSocket = new WebSocket(url); // eslint-disable-line no-undef

            webSocket.addEventListener('error', (event) => reject(event.error));
            webSocket.addEventListener('open', () => resolve(webSocket));
        });
    }

}
