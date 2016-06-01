import EventTarget from 'event-target';
import { spy } from 'sinon';

export class WebSocketMock {

    constructor () {
        this.addEventListener = EventTarget.addEventListener;
        this.close = spy();
        this.dispatchEvent = EventTarget.dispatchEvent;
        this.removeEventListener = EventTarget.removeEventListener;
        this.send = spy();
    }

}
