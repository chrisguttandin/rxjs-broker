import { spy, stub } from 'sinon';

// @todo This is an obviously imperfect implementation of the EventTarget.
export class WebSocketMock {

    constructor () {
        const events = new Map();

        this.addEventListener = (type, listener) => {
            if (events.has(type)) {
                events.get(type).add(listener);
            } else {
                events.set(type, new Set([ listener ]));
            }
        };
        this.close = spy();
        this.dispatchEvent = (event) => {
            if (events.has(event.type)) {
                events.get(event.type).forEach((listener) => {
                    listener(event);
                });
            }
        };
        this.removeEventListener = stub();
        this.send = spy();

        this.removeEventListener.callsFake((type, listener) => {
            if (events.has(type)) {
                events.get(type).delete(listener);
            }
        });
    }

}
