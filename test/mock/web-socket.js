import EventTarget from 'event-target';

export class WebSocketMock {

    constructor () {
        this.addEventListener = EventTarget.addEventListener;
        this.close = sinon.spy(); // eslint-disable-line no-undef
        this.dispatchEvent = EventTarget.dispatchEvent;
        this.removeEventListener = sinon.stub(); // eslint-disable-line no-undef
        this.send = sinon.spy(); // eslint-disable-line no-undef

        this.removeEventListener.returns(EventTarget.removeEventListener);
    }

}
