import { TGetTypedKeysFunction } from './get-typed-keys-function';
import { TMaskedSubjectFactory } from './masked-subject-factory';

export type TMaskedSubjectFactoryFactory = (getTypedKeys: TGetTypedKeysFunction) => TMaskedSubjectFactory;
