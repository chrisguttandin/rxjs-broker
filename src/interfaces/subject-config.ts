import { NextObserver } from 'rxjs';

export interface ISubjectConfig<T = unknown> {
    openObserver?: NextObserver<void>;

    deserializer?(event: MessageEvent<string>): T;
}
