import { Subject } from 'rxjs';
import { TStringifyableJsonValue } from '../types';

export interface IRemoteSubject<T extends TStringifyableJsonValue> extends Subject<T> {

    close (): void;

    send (message: T): Promise<void>;

}
