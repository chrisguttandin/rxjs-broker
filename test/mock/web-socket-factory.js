import { spy } from 'sinon';

export class WebSocketFactoryMock {

    constructor () {
        this.create = spy(this.create);
        this._webSockets = [];
    }

    get webSockets () {
        return this._webSockets;
    }

    async create () {
        /* eslint-disable indent */
        const webSocket = {
                  close: spy()
              };
        /* eslint-enable indent */

        this._webSockets.push(webSocket);

        return webSocket;
    }

}
