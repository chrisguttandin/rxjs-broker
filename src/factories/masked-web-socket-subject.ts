import { Injectable } from '@angular/core';
import { AnonymousSubject } from 'rxjs/Subject';
import { IMaskableSubject } from '../interfaces/maskable-subject';

export class MaskedWebSocketSubject<T> extends AnonymousSubject<T> implements IMaskableSubject {

    private _mask;

    private _webSocketSubject;

    constructor ({ mask, webSocketSubject }) {
        const maskedWebSocketSubject = webSocketSubject
            .asObservable()
            .filter((message) => Object
                .keys(mask)
                .every((key) => JSON.stringify(mask[key]) === JSON.stringify(message[key])))
            .map(({ message }: any) => message);

        super(webSocketSubject, maskedWebSocketSubject);

        this._mask = mask;
        this._webSocketSubject = webSocketSubject;
    }

    public close () {
        this._webSocketSubject.close();
    }

    public mask (mask) {
        return new MaskedWebSocketSubject({ mask, webSocketSubject: this });
    }

    public next (value) {
        this.send(value);
    }

    public send (value) {
        return this._webSocketSubject.send(Object.assign({}, this._mask, { message: value }));
    }

}

@Injectable()
export class MaskedWebSocketSubjectFactory {

    public create ({ mask, webSocketSubject }): IMaskableSubject {
        return new MaskedWebSocketSubject({ mask, webSocketSubject });
    }

}
