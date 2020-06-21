import { Observable } from 'rxjs';
import { createTransportObservable } from '../../../src/factories/transport-observable';

describe('createTransportObservable()', () => {
    it('should return an Observable', () => {
        expect(createTransportObservable({}, {})).to.be.an.instanceOf(Observable);
    });
});
