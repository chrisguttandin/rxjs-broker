import { AnonymousSubject } from 'rxjs/internal/Subject'; // tslint:disable-line no-submodule-imports rxjs-no-internal
import { IDataChannel, IMaskableSubject, IParsedJsonObject } from '../interfaces';
import {
    TDataChannelObservableFactory,
    TDataChannelObserverFactory,
    TMaskedDataChannelSubjectFactory,
    TStringifyableJsonValue
} from '../types';
import { MaskedDataChannelSubject } from './masked-data-channel-subject';

export class DataChannelSubject extends AnonymousSubject<TStringifyableJsonValue> implements IMaskableSubject<TStringifyableJsonValue> {

    private _createMaskedDataChannelSubject: TMaskedDataChannelSubjectFactory;

    private _dataChannel: IDataChannel;

    constructor (
        createDataChannelObservable: TDataChannelObservableFactory,
        createDataChannelObserver: TDataChannelObserverFactory,
        createMaskedDataChannelSubject: TMaskedDataChannelSubjectFactory,
        dataChannel: IDataChannel
    ) {
        const observable = createDataChannelObservable<TStringifyableJsonValue>(dataChannel);

        const observer = createDataChannelObserver<TStringifyableJsonValue>(dataChannel);

        super(observer, observable);

        this._createMaskedDataChannelSubject = createMaskedDataChannelSubject;
        this._dataChannel = dataChannel;
    }

    public close () {
        this._dataChannel.close();
    }

    public mask <TMessage extends TStringifyableJsonValue> (mask: IParsedJsonObject): MaskedDataChannelSubject<TMessage> {
        return this._createMaskedDataChannelSubject<TMessage>(mask, this);
    }

    public send (message: TStringifyableJsonValue) {
        const { destination }: any = this;

        if (!this.isStopped) {
            return destination.send(message);
        }
    }

}
