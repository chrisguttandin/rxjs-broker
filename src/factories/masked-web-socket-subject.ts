import { filter, map } from 'rxjs/operators';
import { AnonymousSubject } from 'rxjs/Subject';
import { IMaskableSubject, IMaskedWebSocketSubjectFactoryOptions, IParsedJsonObject, IStringifyableJsonObject } from '../interfaces';
import { TStringifyableJsonValue } from '../types';

export class MaskedWebSocketSubject<TMessage extends TStringifyableJsonValue>
        extends AnonymousSubject<TMessage>
        implements IMaskableSubject<TMessage> {

    private _mask: IParsedJsonObject;

    private _maskableSubject: IMaskableSubject<TStringifyableJsonValue>;

    constructor ({ mask, maskableSubject }: IMaskedWebSocketSubjectFactoryOptions) {
        const stringifiedValues = Object
            .keys(mask)
            .map((key) => [ key, JSON.stringify(mask[key]) ]);

        const maskedWebSocketSubject = maskableSubject
            .asObservable()
            .pipe(
                filter<TStringifyableJsonValue, { message: TMessage }>((message): message is { message: TMessage } => stringifiedValues
                    .every(([ key, value ]) => {
                        return (value === JSON.stringify((<IStringifyableJsonObject> message)[key]));
                    })),
                map(({ message }) => message)
            );

        super(maskableSubject, maskedWebSocketSubject);

        this._mask = mask;
        this._maskableSubject = maskableSubject;
    }

    public close () {
        this._maskableSubject.close();
    }

    public mask<TMakedMessage extends TStringifyableJsonValue> (mask: IParsedJsonObject): MaskedWebSocketSubject<TMakedMessage> {
        // @todo Casting this to any is a lazy fix to make TypeScript accept this as an IMaskableSubject.
        return new MaskedWebSocketSubject<TMakedMessage>({ mask, maskableSubject: <any> this });
    }

    public next (value: TMessage) {
        this.send(value);
    }

    public send (value: TMessage) {
        return this._maskableSubject.send({ ...this._mask, message: value });
    }

}

export class MaskedWebSocketSubjectFactory {

    public create<TMessage extends TStringifyableJsonValue>
            ({ mask, maskableSubject }: IMaskedWebSocketSubjectFactoryOptions): MaskedWebSocketSubject<TMessage> {
        return new MaskedWebSocketSubject<TMessage>({ mask, maskableSubject });
    }

}

export const MASKED_WEB_SOCKET_SUBJECT_FACTORY_PROVIDER = { deps: [ ], provide: MaskedWebSocketSubjectFactory };
