import { Observable } from 'rxjs';
import { createWebSocketObservable } from '../../../src/factories/web-socket-observable';

describe('createWebSocketObservable()', () => {

    it('should return an Observable', () => {
        expect(createWebSocketObservable({})).to.be.an.instanceOf(Observable);
    });

});
