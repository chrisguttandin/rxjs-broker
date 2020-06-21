import { TGetTypedKeysFunction } from '../types';

export const getTypedKeys: TGetTypedKeysFunction = <T extends object>(object: T) => <(keyof T)[]>Object.keys(object);
