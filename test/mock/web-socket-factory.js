import { WebSocketMock } from './web-socket';
import { spy } from 'sinon';

export class WebSocketFactoryMock {

    constructor () {
        this.create = spy(this.create);
    }

    create () { // eslint-disable-line class-methods-use-this
        return new WebSocketMock();
    }

}
