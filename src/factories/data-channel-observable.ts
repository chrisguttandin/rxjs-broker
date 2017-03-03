import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IDataChannelObservableFactoryOptions } from '../interfaces';

export class DataChannelObservable<T> extends Observable<T> {

    constructor ({ dataChannel }: IDataChannelObservableFactoryOptions) {
        super((observer) => {
            const handleCloseEvent = () => observer.complete();
            const handleErrorEvent = ({ error }: ErrorEvent) => observer.error(error);
            const handleMessageEvent = ({ data }: MessageEvent) => {
                try {
                    observer.next(JSON.parse(data));
                } catch (err) {
                    observer.next(data);
                }
            };

            dataChannel.addEventListener('close', handleCloseEvent);
            dataChannel.addEventListener('error', handleErrorEvent);
            dataChannel.addEventListener('message', handleMessageEvent);

            return () => {
                dataChannel.removeEventListener('close', handleCloseEvent);
                dataChannel.removeEventListener('error', handleErrorEvent);
                dataChannel.removeEventListener('message', handleMessageEvent);
            };
        });
    }

}

@Injectable()
export class DataChannelObservableFactory {

    public create ({ dataChannel }: IDataChannelObservableFactoryOptions) {
        return new DataChannelObservable({ dataChannel });
    }

}
