import { env } from 'node:process';
import { webdriverio } from '@vitest/browser-webdriverio';
import { defineConfig } from 'vitest/config';
import { WebSocketServer } from 'ws';

export default defineConfig({
    plugins: [
        {
            config: () => {
                let webSocketServer: null | WebSocketServer = null;

                return {
                    test: {
                        browser: {
                            commands: {
                                startWebSocketServer: (_: unknown, port: number) => {
                                    webSocketServer = new WebSocketServer({ port });

                                    const promise = new Promise<void>((resolve) => {
                                        if (webSocketServer !== null) {
                                            webSocketServer.on('listening', () => resolve());
                                        }
                                    });

                                    webSocketServer.on('connection', (webSocket) =>
                                        webSocket.on('message', (webSocketMessage) => webSocket.send(webSocketMessage.toString()))
                                    );

                                    return promise;
                                },
                                stopWebSocketServer: () =>
                                    new Promise<void>((resolve, reject) => {
                                        if (webSocketServer === null) {
                                            resolve();
                                        } else {
                                            webSocketServer.close((err) => (err === undefined ? resolve() : reject(err)));

                                            webSocketServer = null;
                                        }
                                    })
                            }
                        }
                    }
                };
            },
            name: 'web-socket-server-commands'
        }
    ],
    test: {
        bail: 1,
        browser: {
            enabled: true,
            instances: env.CI
                ? env.TARGET === 'chrome'
                    ? [{ browser: 'chrome', name: 'Chrome', provider: webdriverio() }]
                    : env.TARGET === 'firefox'
                      ? [{ browser: 'firefox', name: 'Firefox', provider: webdriverio() }]
                      : env.TARGET === 'safari'
                        ? [{ browser: 'safari', headless: false, name: 'Safari', provider: webdriverio() }]
                        : []
                : [
                      { browser: 'chrome', headless: true, name: 'Chrome', provider: webdriverio() },
                      {
                          browser: 'chrome',
                          headless: true,
                          name: 'Chrome Canary',
                          provider: webdriverio({
                              capabilities: {
                                  'goog:chromeOptions': {
                                      binary: '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary'
                                  }
                              }
                          })
                      },
                      {
                          browser: 'firefox',
                          headless: true,
                          name: 'Firefox Developer',
                          provider: webdriverio({
                              capabilities: {
                                  'moz:firefoxOptions': { binary: '/Applications/Firefox\ Developer\ Edition.app/Contents/MacOS/firefox' }
                              }
                          })
                      },
                      { browser: 'firefox', headless: true, name: 'Firefox', provider: webdriverio() },
                      { browser: 'safari', headless: false, name: 'Safari', provider: webdriverio() }
                  ]
        },
        dir: 'test/integration/',
        include: ['**/*.js'],
        watch: false
    }
});
