import { TBinaryType, TDataChannelState, TEventHandler } from '../types';

// @todo This is an extract of @types/webrtc because it can't be used anymore since it causes a conflict with the built-in types.

export interface IDataChannel extends EventTarget {

    readonly bufferedAmount: number;

    readonly id: number;

    readonly label: string;

    readonly maxPacketLifeTime: null | number;

    readonly maxRetransmits: null | number;

    readonly negotiated: boolean;

    readonly ordered: boolean;

    readonly protocol: string;

    readonly readyState: TDataChannelState;

    bufferedAmountLowThreshold: number;

    binaryType: TBinaryType;

    close (): void;

    send (data: string | Blob | ArrayBuffer | ArrayBufferView): void;

    onopen: TEventHandler;

    onmessage (event: MessageEvent): void;

    onbufferedamountlow: TEventHandler;

    onerror (event: ErrorEvent): void;

    onclose: TEventHandler;

}
