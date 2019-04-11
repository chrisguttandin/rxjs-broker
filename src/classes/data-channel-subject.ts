import { AnonymousSubject } from 'rxjs/internal/Subject'; // tslint:disable-line no-submodule-imports rxjs-no-internal
import { MaskedDataChannelSubjectFactory } from '../factories/masked-data-channel-subject';
import { IDataChannel, IDataChannelSubjectOptions, IMaskableSubject, IParsedJsonObject } from '../interfaces';
import { TStringifyableJsonValue } from '../types';
import { MaskedDataChannelSubject } from './masked-data-channel-subject';

export class DataChannelSubject extends AnonymousSubject<TStringifyableJsonValue> implements IMaskableSubject<TStringifyableJsonValue> {

    private _dataChannel: IDataChannel;

    private _maskedDataChannelSubjectFactory: MaskedDataChannelSubjectFactory;

    constructor ({
        dataChannel, dataChannelObservableFactory, dataChannelObserverFactory, maskedDataChannelSubjectFactory
    }: IDataChannelSubjectOptions) {
        const observable = dataChannelObservableFactory.create<TStringifyableJsonValue>({ dataChannel });

        const observer = dataChannelObserverFactory.create<TStringifyableJsonValue>({ dataChannel });

        super(observer, observable);

        this._dataChannel = dataChannel;
        this._maskedDataChannelSubjectFactory = maskedDataChannelSubjectFactory;
    }

    public close () {
        this._dataChannel.close();
    }

    public mask <TMessage extends TStringifyableJsonValue> (mask: IParsedJsonObject): MaskedDataChannelSubject<TMessage> {
        return this._maskedDataChannelSubjectFactory.create<TMessage>({ maskableSubject: this, mask });
    }

    public send (message: TStringifyableJsonValue) {
        const { destination }: any = this;

        if (!this.isStopped) {
            return destination.send(message);
        }
    }

}
