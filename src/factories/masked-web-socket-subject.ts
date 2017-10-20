import { filter, map } from 'rxjs/operators';
import { AnonymousSubject } from 'rxjs/Subject';
import { IMaskableSubject, IMaskedWebSocketSubjectFactoryOptions, IStringifyableJsonObject } from '../interfaces';
import { TParsedJsonValue, TStringifyableJsonValue } from '../types';

export class MaskedWebSocketSubject<TMessage extends TStringifyableJsonValue>
        extends AnonymousSubject<TMessage>
        implements IMaskableSubject<TMessage> {

    private _mask: TParsedJsonValue;

    private _maskableSubject: IMaskableSubject<TStringifyableJsonValue>;

    constructor ({ mask, maskableSubject }: IMaskedWebSocketSubjectFactoryOptions) {
        const maskedWebSocketSubject = maskableSubject
            .asObservable()
            .pipe(
                filter((message: TStringifyableJsonValue) => Object
                    .keys(mask)
                    .every((key) => {
                        const maskValue = JSON.stringify((<IStringifyableJsonObject> mask)[key]);
                        const messageValue = JSON.stringify((<IStringifyableJsonObject> message)[key]);

                        return maskValue === messageValue;
                    })),
                map(({ message }: { message: TMessage }) => message)
            );

        super(maskableSubject, maskedWebSocketSubject);

        this._mask = mask;
        this._maskableSubject = maskableSubject;
    }

    public close () {
        this._maskableSubject.close();
    }

    public mask<TMakedMessage extends TStringifyableJsonValue> (mask: TParsedJsonValue): MaskedWebSocketSubject<TMakedMessage> {
        return new MaskedWebSocketSubject<TMakedMessage>({ mask, maskableSubject: this });
    }

    public next (value: TMessage) {
        this.send(value);
    }

    public send (value: TMessage) {
        return this._maskableSubject.send(Object.assign({}, this._mask, { message: value }));
    }

}

export class MaskedWebSocketSubjectFactory {

    public create<TMessage extends TStringifyableJsonValue>
            ({ mask, maskableSubject }: IMaskedWebSocketSubjectFactoryOptions): MaskedWebSocketSubject<TMessage> {
        return new MaskedWebSocketSubject<TMessage>({ mask, maskableSubject });
    }

}
