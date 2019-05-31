import { IStringifyable, IStringifyableJsonArray, IStringifyableJsonObject } from '../interfaces';

export type TStringifyableJsonValue = boolean | // tslint:disable-line:no-null-undefined-union
    null |
    number |
    string |
    undefined |
    IStringifyable |
    IStringifyableJsonArray |
    IStringifyableJsonObject;
