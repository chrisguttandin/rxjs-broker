import { TBinaryType, TDataChannelState, TEventHandler } from '../types';

// @todo This is an extract of @types/webrtc because it can't be used anymore since it causes a conflict with the built-in types.

export interface IDataChannel extends EventTarget {

    readonly bufferedAmount: number;

    bufferedAmountLowThreshold: number;

    binaryType: TBinaryType;

    readonly id: number;

    readonly label: string;

    readonly maxPacketLifeTime: null | number;

    readonly maxRetransmits: null | number;

    readonly negotiated: boolean;

    onbufferedamountlow: TEventHandler;

    onclose: TEventHandler;

    onopen: TEventHandler;

    readonly ordered: boolean;

    readonly protocol: string;

    readonly readyState: TDataChannelState;

    close (): void;

    send (data: string | Blob | ArrayBuffer | ArrayBufferView): void;

    onmessage (event: MessageEvent): void;

    onerror (event: ErrorEvent): void;

}
