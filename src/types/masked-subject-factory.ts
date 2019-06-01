import { IRemoteSubject, IStringifyableJsonObject } from '../interfaces';
import { TStringifyableJsonValue } from './stringifyable-json-value';

export type TMaskedSubjectFactory = <T extends TStringifyableJsonValue, U extends IStringifyableJsonObject & { message: T } = IStringifyableJsonObject & { message: T }, V extends IStringifyableJsonObject | U = IStringifyableJsonObject | U>( // tslint:disable-line max-line-length
    mask: Partial<Omit<U, 'message'>>,
    maskableSubject: IRemoteSubject<V>
) => IRemoteSubject<T>;
