import EventTarget from 'event-target';

export class DataChannelMock {

    constructor () {
        this.addEventListener = EventTarget.addEventListener;
        this.bufferedAmount = 0;
        this.bufferedAmountLowThreshold = 0;
        this.close = sinon.spy(); // eslint-disable-line no-undef
        this.dispatchEvent = EventTarget.dispatchEvent;
        this.removeEventListener = sinon.stub(); // eslint-disable-line no-undef
        this.send = sinon.spy(); // eslint-disable-line no-undef

        this.removeEventListener.returns(EventTarget.removeEventListener);
    }

}
