import { Injectable } from '@angular/core';
import { AnonymousSubject } from 'rxjs/Subject';
import { IMaskableSubject } from '../interfaces/maskable-subject';

export class MaskedDataChannelSubject<T> extends AnonymousSubject<T> implements IMaskableSubject {

    private _mask;

    private _dataChannelSubject;

    constructor ({ dataChannelSubject, mask }) {
        const maskedDataChannelSubject = dataChannelSubject
            .asObservable()
            .filter((message) => Object
                .keys(mask)
                .every((key) => JSON.stringify(mask[key]) === JSON.stringify(message[key])))
            .map(({ message }: any) => message);

        super(dataChannelSubject, maskedDataChannelSubject);

        this._dataChannelSubject = dataChannelSubject;
        this._mask = mask;
    }

    public close () {
        this._dataChannelSubject.close();
    }

    public mask (mask) {
        return new MaskedDataChannelSubject({ mask, dataChannelSubject: this });
    }

    public next (value) {
        this.send(value);
    }

    public send (value) {
        return this._dataChannelSubject.send(Object.assign({}, this._mask, { message: value }));
    }

}

@Injectable()
export class MaskedDataChannelSubjectFactory {

    public create ({ dataChannelSubject, mask }): IMaskableSubject {
        return new MaskedDataChannelSubject({ dataChannelSubject, mask });
    }

}
