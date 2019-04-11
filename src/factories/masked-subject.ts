import { MaskedSubject } from '../classes/masked-subject';
import { IRemoteSubject, IStringifyableJsonObject } from '../interfaces';
import { TMaskedSubjectFactory, TStringifyableJsonValue } from '../types';

export const createMaskedSubject: TMaskedSubjectFactory = <T extends TStringifyableJsonValue, U extends IStringifyableJsonObject & { message: T } = IStringifyableJsonObject & { message: T }, V extends IStringifyableJsonObject | U = IStringifyableJsonObject | U>( // tslint:disable-line max-line-length
    mask: Partial<Pick<U, Exclude<keyof U, 'message'>>>,
    maskableSubject: IRemoteSubject<V>
) => {
    return new MaskedSubject<T, U, V>(mask, maskableSubject);
};
