import { IStringifyableJsonObject } from './stringifyable-json-object';

export interface IStringifyable {

    toJSON (): IStringifyableJsonObject;

}
