import { IStringifyable, IStringifyableJsonArray, IStringifyableJsonObject } from '../interfaces';

export type TStringifyableJsonValue = boolean | number | string | IStringifyable | IStringifyableJsonArray | IStringifyableJsonObject;
