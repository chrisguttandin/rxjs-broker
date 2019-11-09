export type TGetTypedKeysFunction = <T extends object>(object: T) => (keyof T)[];
