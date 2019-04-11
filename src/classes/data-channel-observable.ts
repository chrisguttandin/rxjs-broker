import { Observable } from 'rxjs';

export class DataChannelObservable<T> extends Observable<T> { // tslint:disable-line rxjs-no-subclass

    constructor (dataChannel: RTCDataChannel) {
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
