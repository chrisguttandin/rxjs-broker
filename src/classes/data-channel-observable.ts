import { Observable } from 'rxjs';
import { IDataChannelSubjectConfig } from '../interfaces';

export class DataChannelObservable<T> extends Observable<T> { // tslint:disable-line rxjs-no-subclass

    constructor (dataChannel: RTCDataChannel, { openObserver }: IDataChannelSubjectConfig) {
        super((observer) => {
            const handleCloseEvent = () => observer.complete();
            const handleErrorEvent = <EventListener> (({ error }: ErrorEvent) => observer.error(error));
            const handleMessageEvent = ({ data }: MessageEvent) => {
                try {
                    observer.next(JSON.parse(data));
                } catch (err) {
                    observer.next(data);
                }
            };
            const handleOpenEvent = () => {
                if (openObserver !== undefined) {
                    openObserver.next();
                }
            };

            dataChannel.addEventListener('close', handleCloseEvent);
            dataChannel.addEventListener('error', handleErrorEvent);
            dataChannel.addEventListener('message', handleMessageEvent);
            dataChannel.addEventListener('open', handleOpenEvent);

            return () => {
                dataChannel.removeEventListener('close', handleCloseEvent);
                dataChannel.removeEventListener('error', handleErrorEvent);
                dataChannel.removeEventListener('message', handleMessageEvent);
                dataChannel.removeEventListener('open', handleOpenEvent);
            };
        });
    }

}
