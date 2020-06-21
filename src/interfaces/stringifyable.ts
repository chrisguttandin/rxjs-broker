import { TStringifyableJsonObject } from '../types';

export interface IStringifyable {
    toJSON(): TStringifyableJsonObject;
}
