import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { AnonymousSubject } from 'rxjs/Subject';
import { IJsonObject, IMaskableSubject, IMaskedDataChannelSubjectFactoryOptions } from '../interfaces';
import { TJsonValue } from '../types';

export class MaskedDataChannelSubject extends AnonymousSubject<TJsonValue> implements IMaskableSubject {

    private _mask: TJsonValue;

    private _maskableSubject: IMaskableSubject;

    constructor ({ mask, maskableSubject }: IMaskedDataChannelSubjectFactoryOptions) {
        const maskedDataChannelSubject = maskableSubject
            .asObservable()
            .filter((message) => Object
                .keys(mask)
                .every((key) => JSON.stringify((<IJsonObject> mask)[key]) === JSON.stringify((<IJsonObject> message)[key])))
            .map(({ message }: any) => message);

        super(maskableSubject, maskedDataChannelSubject);

        this._mask = mask;
        this._maskableSubject = maskableSubject;
    }

    public close () {
        this._maskableSubject.close();
    }

    public mask (mask: TJsonValue): MaskedDataChannelSubject {
        return new MaskedDataChannelSubject({ mask, maskableSubject: this });
    }

    public next (value: TJsonValue) {
        this.send(value);
    }

    public send (value: TJsonValue) {
        return this._maskableSubject.send(Object.assign({}, this._mask, { message: value }));
    }

}

export class MaskedDataChannelSubjectFactory {

    public create ({ mask, maskableSubject }: IMaskedDataChannelSubjectFactoryOptions): MaskedDataChannelSubject {
        return new MaskedDataChannelSubject({ mask, maskableSubject });
    }

}
