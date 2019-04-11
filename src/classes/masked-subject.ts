import { Observable, Observer } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject'; // tslint:disable-line no-submodule-imports rxjs-no-internal
import { filter, map } from 'rxjs/operators';
import { IRemoteSubject, IStringifyableJsonObject } from '../interfaces';
import { TStringifyableJsonValue } from '../types';

export class MaskedSubject<T extends TStringifyableJsonValue, U extends IStringifyableJsonObject & { message: T }, V extends IStringifyableJsonObject | U> // tslint:disable-line max-line-length
        extends AnonymousSubject<T>
        implements IRemoteSubject<T> {

    private _mask: Partial<Pick<U, Exclude<keyof U, 'message'>>>;

    private _maskableSubject: IRemoteSubject<V>;

    constructor (mask: Partial<Pick<U, Exclude<keyof U, 'message'>>>, maskableSubject: IRemoteSubject<V>) {
        const destination: Observer<T> = {
            complete: maskableSubject.complete,
            error: maskableSubject.error,
            next: (value) => this.send(value)
        };

        const stringifiedValues = Object
            .keys(mask)
            .map((key) => [ key, JSON.stringify(mask[key]) ]);

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
