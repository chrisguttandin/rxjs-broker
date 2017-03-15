import { spy, stub } from 'sinon';
import EventTarget from 'event-target';

export class DataChannelMock {

    constructor () {
        this.addEventListener = EventTarget.addEventListener;
        this.bufferedAmount = 0;
        this.bufferedAmountLowThreshold = 0;
        this.close = spy();
        this.dispatchEvent = EventTarget.dispatchEvent;
        this.removeEventListener = stub();
        this.send = spy();

        this.removeEventListener.returns(EventTarget.removeEventListener);
    }

}
