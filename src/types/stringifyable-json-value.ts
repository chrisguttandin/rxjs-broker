import { IStringifyable, IStringifyableJsonArray, IStringifyableJsonObject } from '../interfaces';

export type TStringifyableJsonValue = boolean |
    null |
    number |
    string |
    undefined |
    IStringifyable |
    IStringifyableJsonArray |
    IStringifyableJsonObject;
