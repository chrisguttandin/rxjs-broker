import EventTarget from 'event-target';

export class WebSocketMock {

    constructor () {
        this.addEventListener = EventTarget.addEventListener;
        this.removeEventListener = EventTarget.removeEventListener;
        this.dispatchEvent = EventTarget.dispatchEvent;
    }

}
