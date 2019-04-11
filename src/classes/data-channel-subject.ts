import { AnonymousSubject } from 'rxjs/internal/Subject'; // tslint:disable-line no-submodule-imports rxjs-no-internal
import { IMaskableSubject, IParsedJsonObject } from '../interfaces';
import {
    TDataChannelObservableFactory,
    TDataChannelObserverFactory,
    TMaskedSubjectFactory,
    TStringifyableJsonValue
} from '../types';
import { MaskedSubject } from './masked-subject';

export class DataChannelSubject extends AnonymousSubject<TStringifyableJsonValue> implements IMaskableSubject<TStringifyableJsonValue> {

    private _createMaskedSubject: TMaskedSubjectFactory;

    private _dataChannel: RTCDataChannel;

    constructor (
        createDataChannelObservable: TDataChannelObservableFactory,
        createDataChannelObserver: TDataChannelObserverFactory,
        createMaskedSubject: TMaskedSubjectFactory,
        dataChannel: RTCDataChannel
    ) {
        const observable = createDataChannelObservable<TStringifyableJsonValue>(dataChannel);

        const observer = createDataChannelObserver<TStringifyableJsonValue>(dataChannel);

        super(observer, observable);

        this._createMaskedSubject = createMaskedSubject;
        this._dataChannel = dataChannel;
    }

    public close () {
        this._dataChannel.close();
    }

    public mask <TMessage extends TStringifyableJsonValue> (mask: IParsedJsonObject): MaskedSubject<TMessage> {
        return this._createMaskedSubject<TMessage>(mask, this);
    }

    public send (message: TStringifyableJsonValue) {
        const { destination }: any = this;

        if (!this.isStopped) {
            return destination.send(message);
        }
    }

}
