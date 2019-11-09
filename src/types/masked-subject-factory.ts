import { IRemoteSubject } from '../interfaces';
import { TStringifyableJsonObject } from './stringifyable-json-object';
import { TStringifyableJsonValue } from './stringifyable-json-value';

export type TMaskedSubjectFactory = <T extends TStringifyableJsonValue, U extends TStringifyableJsonObject & { message: T } = TStringifyableJsonObject & { message: T }, V extends TStringifyableJsonObject | U = TStringifyableJsonObject | U>( // tslint:disable-line max-line-length
    mask: Partial<Omit<U, 'message'>>,
    maskableSubject: IRemoteSubject<V>
) => IRemoteSubject<T>;
