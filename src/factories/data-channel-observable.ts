import { Observable } from 'rxjs/Observable';
import { IDataChannelObservableFactoryOptions } from '../interfaces';

export class DataChannelObservable<T> extends Observable<T> {

    constructor ({ dataChannel }: IDataChannelObservableFactoryOptions) {
        super((observer) => {
            const handleCloseEvent = () => observer.complete();
            const handleErrorEvent = <EventListener> (({ error }: ErrorEvent) => observer.error(error));
            const handleMessageEvent = <EventListener> (({ data }: MessageEvent) => {
                try {
                    observer.next(JSON.parse(data));
                } catch (err) {
                    observer.next(data);
                }
            });

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

export class DataChannelObservableFactory {

    public create<T> ({ dataChannel }: IDataChannelObservableFactoryOptions) {
        return new DataChannelObservable<T>({ dataChannel });
    }

}

export const DATA_CHANNEL_OBSERVABLE_FACTORY_PROVIDER = { deps: [ ], provide: DataChannelObservableFactory };
