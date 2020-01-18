import { AnonymousSubject } from 'rxjs/internal/Subject'; // tslint:disable-line rxjs-no-compat no-submodule-imports rxjs-no-internal
import { IDataChannelSubjectConfig, IRemoteSubject } from '../interfaces';
import { TDataChannelObservableFactory, TDataChannelObserverFactory, TStringifyableJsonValue } from '../types';

export class DataChannelSubject<T extends TStringifyableJsonValue> extends AnonymousSubject<T> implements IRemoteSubject<T> {

    private _dataChannel: RTCDataChannel;

    constructor (
        createDataChannelObservable: TDataChannelObservableFactory,
        createDataChannelObserver: TDataChannelObserverFactory,
        dataChannel: RTCDataChannel,
        dataChannelSubjectConfig: IDataChannelSubjectConfig
    ) {
        const observable = createDataChannelObservable<T>(dataChannel, dataChannelSubjectConfig);
        const observer = createDataChannelObserver<T>(dataChannel);

        super(observer, observable);

        this._dataChannel = dataChannel;
    }

    public close (): void {
        this._dataChannel.close();
    }

    public send (message: T): Promise<void> { // tslint:disable-line:invalid-void
        const { destination }: any = this;

        if (!this.isStopped) {
            return destination.send(message);
        }

        return Promise.resolve();
    }

}
