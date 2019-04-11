import { AnonymousSubject } from 'rxjs/internal/Subject'; // tslint:disable-line no-submodule-imports rxjs-no-internal
import { filter, map } from 'rxjs/operators';
import { IMaskableSubject, IParsedJsonObject, IStringifyableJsonObject } from '../interfaces';
import { TStringifyableJsonValue } from '../types';

export class MaskedDataChannelSubject<TMessage extends TStringifyableJsonValue>
        extends AnonymousSubject<TMessage>
        implements IMaskableSubject<TMessage> {

    private _mask: IParsedJsonObject;

    private _maskableSubject: IMaskableSubject<TStringifyableJsonValue>;

    constructor (mask: IParsedJsonObject, maskableSubject: IMaskableSubject<TStringifyableJsonValue>) {
        const stringifiedValues = Object
            .keys(mask)
            .map((key) => [ key, JSON.stringify(mask[key]) ]);

        const maskedDataChannelSubject = maskableSubject
            .asObservable()
            .pipe(
                filter<TStringifyableJsonValue, { message: TMessage }>((message): message is { message: TMessage } => stringifiedValues
                    .every(([ key, value ]) => {
                        return (value === JSON.stringify((<IStringifyableJsonObject> message)[key]));
                    })),
                map(({ message }) => message)
            );

        super(maskableSubject, maskedDataChannelSubject);

        this._mask = mask;
        this._maskableSubject = maskableSubject;
    }

    public close () {
        this._maskableSubject.close();
    }

    public mask<TMakedMessage extends TStringifyableJsonValue> (mask: IParsedJsonObject): MaskedDataChannelSubject<TMakedMessage> {
        // @todo Casting this to any is a lazy fix to make TypeScript accept this as an IMaskableSubject.
        return new MaskedDataChannelSubject<TMakedMessage>(mask, <any> this);
    }

    public next (value: TMessage) {
        this.send(value);
    }

    public send (value: TMessage) {
        return this._maskableSubject.send({ ...this._mask, message: value });
    }

}
