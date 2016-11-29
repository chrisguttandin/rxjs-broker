import { WebSocketMock } from './web-socket';

export class WebSocketFactoryMock {

    constructor () {
        this.create = sinon.spy(this.create); // eslint-disable-line no-undef
        this._webSockets = [];
    }

    get webSockets () {
        return this._webSockets;
    }

    create () {
        const webSocket = new WebSocketMock();

        this._webSockets.push(webSocket);

        return webSocket;
    }

}
