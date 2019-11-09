import { IStringifyableJsonObject } from '../interfaces';

export type TStringifyableJsonObject<T extends IStringifyableJsonObject = IStringifyableJsonObject> = {

    [ P in keyof T ]: T[P];

};
