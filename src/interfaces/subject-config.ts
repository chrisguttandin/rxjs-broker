import { NextObserver } from 'rxjs';

export interface ISubjectConfig<T> {
    openObserver?: NextObserver<void>;

    deserializer?(event: MessageEvent<string>): T;
}
