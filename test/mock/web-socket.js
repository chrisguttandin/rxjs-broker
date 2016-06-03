import { spy, stub } from 'sinon';
import EventTarget from 'event-target';

export class WebSocketMock {

    constructor () {
        this.addEventListener = EventTarget.addEventListener;
        this.close = spy();
        this.dispatchEvent = EventTarget.dispatchEvent;
        this.removeEventListener = stub();
        this.send = spy();

        this.removeEventListener.returns(EventTarget.removeEventListener);
    }

}
