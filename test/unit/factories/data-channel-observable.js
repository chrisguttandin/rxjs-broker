import { Observable } from 'rxjs';
import { createDataChannelObservable } from '../../../src/factories/data-channel-observable';

describe('createDataChannelObservable()', () => {

    it('should return an Observable', () => {
        expect(createDataChannelObservable({ }, { })).to.be.an.instanceOf(Observable);
    });

});
