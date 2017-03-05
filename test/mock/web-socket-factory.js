import { WebSocketMock } from './web-socket';

export class WebSocketFactoryMock {

    constructor () {
        this.create = sinon.spy(this.create); // eslint-disable-line no-undef
    }

    create () { // eslint-disable-line class-methods-use-this
        return new WebSocketMock();
    }

}
