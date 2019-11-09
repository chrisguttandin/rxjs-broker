import { MaskedSubject } from '../classes/masked-subject';
import { IRemoteSubject } from '../interfaces';
import { TMaskedSubjectFactoryFactory, TStringifyableJsonObject, TStringifyableJsonValue } from '../types';

export const createMaskedSubjectFactory: TMaskedSubjectFactoryFactory = (getTypedKeys) => {
    return <T extends TStringifyableJsonValue, U extends TStringifyableJsonObject & { message: T } = TStringifyableJsonObject & { message: T }, V extends TStringifyableJsonObject | U = TStringifyableJsonObject | U>( // tslint:disable-line max-line-length
        mask: Partial<Omit<U, 'message'>>,
        maskableSubject: IRemoteSubject<V>
    ) => {
        return new MaskedSubject<T, U, V>(getTypedKeys, mask, maskableSubject);
    };
};
