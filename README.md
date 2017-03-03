# rxjs-broker

**An rxjs message broker for WebRTC DataChannels WebSockets and WebWorkers.**

[![tests](https://img.shields.io/travis/chrisguttandin/rxjs-broker/master.svg?style=flat-square)](https://travis-ci.org/chrisguttandin/rxjs-broker)
[![dependencies](https://img.shields.io/david/chrisguttandin/rxjs-broker.svg?style=flat-square)](https://www.npmjs.com/package/rxjs-broker)
[![version](https://img.shields.io/npm/v/rxjs-broker.svg?style=flat-square)](https://www.npmjs.com/package/rxjs-broker)

This module is using the power of [RxJS](http://reactivex.io/rxjs) to wrap WebSockets or WebRTC DataChannels. It returns a Subject which can be used with all the operators RxJS provides, but does also have some special functionality.

## Usage

To install `rxjs-broker` via [npm](https://www.npmjs.com/package/rxjs-broker) you can execute the following command.

```shell
npm install rxjs-broker
```

`rxjs-broker` does provide two utility functions: `connect()` and `wrap()`. If you're using ES2015 modules you can import them like that.

```js
import { connect, wrap } from 'rxjs-broker';
```

### connect(url: string): WebSocketSubject

The `connect()` method takes an URL as parameter and returns a `WebSocketSubject` which extends the `AnonymousSubject` provided by RxJS. It also implements the `IMaskableSubject` interface which adds three additional methods. It gets explained in more detail below.

```js
const webSocketSubject = connect('wss://super-cool-websock.et');
```

### wrap(dataChannel: DataChannel): DataChannelSubject

The `wrap()` method can be used to turn a WebRTC DataChannel into a `DataChannelSubject` which does also extend the `AnonymousSubject` and implements the `IMaskableSubject` interface.

```js
// Let's image a variable called dataChannel containing a WebRTC DataChannel exists
const dataChannelSubject = wrap(dataChannel);
```

### IMaskableSubject

As mentioned above the `IMaskableSubject` interface is used to describe the common behavior of the `DataChannelSubject` and the `WebSocketSubject`. In TypeScript it looks like this:

```typescript
interface IMaskableSubject {

    close (): void;

    mask (mask): IMaskableSubject;

    send (message): Promise<any>;

}
```

#### close()

The `close()` method is meant to close the underlying WebSocket.

#### mask(mask): IMaskableSubject

The `mask()` method takes a JSON object which gets used to extract incoming data and two enhance outgoing data. If there is for example a DataChannel which receives two types of message: control messages and measurement messages. They might look somehow like this:

```json
{
    "type": "control",
    "message": {
        "heating": "off"
    }
}
```

```json
{
    "type": "measurement",
    "message": {
        "temperature": "30°"
    }
}
```

In case you are not interested in the messages of type control and only want to receive and send messages of type measurement, you can use `mask()` to achieve exactly that.

```js
const maskedSubject = maskableSubject.mask({ type: 'measurement' });

// Will receive unwrapped messages like { temperature: '30°' }.
maskedSubject.subscribe((message) => {
    ...
});
```

#### send(message): Promise<any>

The `send()` method is basically a supercharged version of `next()`. It will stringify a given JSON message before sending it and returns a `Promise` which resolves when the message is actually on it's way. It also wraps the message with the provided mask. Considering the example introduced above, the usage of the `send()` method will look like this:

```js
const maskedSubject = maskableSubject.mask({ type: 'measurement' });

// Will send wrapped messages like { type: 'measurement', message: { temperature: '30°' } }.
maskedSubject.send({ temperature: '30°' });
```
