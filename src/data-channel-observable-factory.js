import { Observable } from 'rxjs/Observable';

class DataChannelObservable extends Observable {

    constructor ({ dataChannel }) {
        super((observer) => {
            const handleCloseEvent = () => observer.complete();
            const handleErrorEvent = ({ error }) => observer.error(error);
            const handleMessageEvent = ({ data }) => {
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

export class DataChannelObservableFactory {

    create ({ dataChannel }) {
        return new DataChannelObservable({ dataChannel });
    }

}
