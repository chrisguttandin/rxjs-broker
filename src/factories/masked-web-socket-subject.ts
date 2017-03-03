import { Injectable } from '@angular/core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { AnonymousSubject } from 'rxjs/Subject';
import { IJsonObject, IMaskableSubject, IMaskedWebSocketSubjectFactoryOptions } from '../interfaces';
import { TJsonValue } from '../types';

export class MaskedWebSocketSubject extends AnonymousSubject<TJsonValue> implements IMaskableSubject {

    private _mask: TJsonValue;

    private _maskableSubject: IMaskableSubject;

    constructor ({ mask, maskableSubject }: IMaskedWebSocketSubjectFactoryOptions) {
        const maskedWebSocketSubject = maskableSubject
            .asObservable()
            .filter((message) => Object
                .keys(mask)
                .every((key) => JSON.stringify((<IJsonObject> mask)[key]) === JSON.stringify((<IJsonObject> message)[key])))
            .map(({ message }: any) => message);

        super(maskableSubject, maskedWebSocketSubject);

        this._mask = mask;
        this._maskableSubject = maskableSubject;
    }

    public close () {
        this._maskableSubject.close();
    }

    public mask (mask: TJsonValue): MaskedWebSocketSubject {
        return new MaskedWebSocketSubject({ mask, maskableSubject: this });
    }

    public next (value: TJsonValue) {
        this.send(value);
    }

    public send (value: TJsonValue) {
        return this._maskableSubject.send(Object.assign({}, this._mask, { message: value }));
    }

}

@Injectable()
export class MaskedWebSocketSubjectFactory {

    public create ({ mask, maskableSubject }: IMaskedWebSocketSubjectFactoryOptions): MaskedWebSocketSubject {
        return new MaskedWebSocketSubject({ mask, maskableSubject });
    }

}
