import { WebSocketMock } from './web-socket';
import { spy } from 'sinon';

export class WebSocketFactoryMock {

    constructor () {
        this.create = spy(this.create);
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
