import { Observable, Observer } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject'; // tslint:disable-line rxjs-no-compat no-submodule-imports rxjs-no-internal
import { filter, map } from 'rxjs/operators';
import { IRemoteSubject } from '../interfaces';
import { TGetTypedKeysFunction, TStringifyableJsonObject, TStringifyableJsonValue } from '../types';

export class MaskedSubject<T extends TStringifyableJsonValue, U extends TStringifyableJsonObject & { message: T }, V extends TStringifyableJsonObject | U> // tslint:disable-line max-line-length
        extends AnonymousSubject<T>
        implements IRemoteSubject<T> {

    private _mask: Partial<Omit<U, 'message'>>;

    private _maskableSubject: IRemoteSubject<V>;

    constructor (getTypedKeys: TGetTypedKeysFunction, mask: Partial<Omit<U, 'message'>>, maskableSubject: IRemoteSubject<V>) { // tslint:disable-line max-line-length rxjs-no-exposed-subjects
        const destination: Observer<T> = {
            complete: maskableSubject.complete,
            error: maskableSubject.error,
            next: (value) => this.send(value)
        };

        const stringifiedValues = getTypedKeys(mask)
            .map((key) => [ key, JSON.stringify(mask[key]) ] as const);

        const source: Observable<T> = (<Observable<U>> maskableSubject)
            .pipe(
                filter((message): message is U => stringifiedValues
                    .every(([ key, value ]) => (value === JSON.stringify(message[key])))),
                map(({ message }) => message)
            );

        super(destination, source);

        this._mask = mask;
        this._maskableSubject = maskableSubject;
    }

    public close (): void {
        this._maskableSubject.close();
    }

    public send (value: T): Promise<void> {
        return this._maskableSubject.send(<V> { ...this._mask, message: value });
    }

}
