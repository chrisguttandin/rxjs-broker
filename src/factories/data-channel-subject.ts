import { Injectable } from '@angular/core';
import { AnonymousSubject } from 'rxjs/Subject';
import { IDataChannel, IDataChannelSubjectFactoryOptions, IDataChannelSubjectOptions, IMaskableSubject } from '../interfaces';
import { TJsonValue } from '../types';
import { DataChannelObservableFactory } from './data-channel-observable';
import { DataChannelObserverFactory } from './data-channel-observer';
import { MaskedDataChannelSubject, MaskedDataChannelSubjectFactory } from './masked-data-channel-subject';

export class DataChannelSubject extends AnonymousSubject<TJsonValue> implements IMaskableSubject {

    private _dataChannel: IDataChannel;

    private _maskedDataChannelSubjectFactory: MaskedDataChannelSubjectFactory;

    constructor ({
        dataChannel, dataChannelObservableFactory, dataChannelObserverFactory, maskedDataChannelSubjectFactory
    }: IDataChannelSubjectOptions) {
        const observable = dataChannelObservableFactory.create({ dataChannel });

        const observer = dataChannelObserverFactory.create({ dataChannel });

        super(observer, observable);

        this._dataChannel = dataChannel;
        this._maskedDataChannelSubjectFactory = maskedDataChannelSubjectFactory;
    }

    public close () {
        this._dataChannel.close();
    }

    public mask (mask: TJsonValue): MaskedDataChannelSubject {
        return this._maskedDataChannelSubjectFactory.create({ mask, maskableSubject: this });
    }

    public send (message: TJsonValue) {
        const { destination }: any = this;

        if (!this.isStopped) {
            return destination.send(message);
        }
    }

}

@Injectable()
export class DataChannelSubjectFactory {

    private _options: {
        dataChannelObservableFactory: DataChannelObservableFactory,
        dataChannelObserverFactory: DataChannelObserverFactory,
        maskedDataChannelSubjectFactory: MaskedDataChannelSubjectFactory
    };

    constructor (
        dataChannelObservableFactory: DataChannelObservableFactory,
        dataChannelObserverFactory: DataChannelObserverFactory,
        maskedDataChannelSubjectFactory: MaskedDataChannelSubjectFactory
    ) {
        this._options = { dataChannelObservableFactory, dataChannelObserverFactory, maskedDataChannelSubjectFactory };
    }

    public create ({ dataChannel }: IDataChannelSubjectFactoryOptions): IMaskableSubject {
        return new DataChannelSubject(Object.assign({}, this._options, { dataChannel }));
    }

}
