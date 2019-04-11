import { Injectable } from '@angular/core';
import { DataChannelSubject } from '../classes/data-channel-subject';
import { IDataChannelSubjectFactoryOptions, IMaskableSubject } from '../interfaces';
import { TStringifyableJsonValue } from '../types';
import { DataChannelObservableFactory } from './data-channel-observable';
import { DataChannelObserverFactory } from './data-channel-observer';
import { MaskedDataChannelSubjectFactory } from './masked-data-channel-subject';

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

    public create ({ dataChannel }: IDataChannelSubjectFactoryOptions): IMaskableSubject<TStringifyableJsonValue> {
        return new DataChannelSubject({ ...this._options, dataChannel });
    }

}

export const DATA_CHANNEL_SUBJECT_FACTORY_PROVIDER = {
    deps: [ DataChannelObservableFactory, DataChannelObserverFactory, MaskedDataChannelSubjectFactory ],
    provide: DataChannelSubjectFactory
};
