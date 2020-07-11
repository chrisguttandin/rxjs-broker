import { Observable } from 'rxjs';
import { ISubjectConfig } from '../interfaces';

// tslint:disable-next-line rxjs-no-subclass
export class TransportObservable<T extends RTCDataChannel | WebSocket, U> extends Observable<U> {
    constructor(transport: T, { openObserver }: ISubjectConfig) {
        super((observer) => {
            const handleCloseEvent = () => observer.complete();
            const handleErrorEvent = <EventListener>(
                (({ error }: ErrorEvent) => (error === undefined ? observer.error(new Error('Unknown Error')) : observer.error(error)))
            );
            const handleMessageEvent = <EventListener>(({ data }: MessageEvent) => {
                try {
                    observer.next(JSON.parse(data));
                } catch (err) {
                    observer.next(data);
                }
            });
            const handleOpenEvent = () => {
                if (openObserver !== undefined) {
                    openObserver.next();
                }
            };

            transport.addEventListener('close', handleCloseEvent);
            transport.addEventListener('error', handleErrorEvent);
            transport.addEventListener('message', handleMessageEvent);
            transport.addEventListener('open', handleOpenEvent);

            return () => {
                transport.removeEventListener('close', handleCloseEvent);
                transport.removeEventListener('error', handleErrorEvent);
                transport.removeEventListener('message', handleMessageEvent);
                transport.removeEventListener('open', handleOpenEvent);
            };
        });
    }
}
